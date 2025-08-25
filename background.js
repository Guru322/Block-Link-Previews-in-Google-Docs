const DOCS_MATCH = "https://docs.google.com/";

function getIconPath(isEnabled) {
  return isEnabled
    ? {
        16: "icons/icon16.png",
        48: "icons/icon48.png",
        128: "icons/icon128.png",
      }
    : {
        16: "icons/icon16-disabled.png",
        48: "icons/icon48-disabled.png",
        128: "icons/icon128-disabled.png",
      };
}

async function applyIconToAllDocsTabs(isEnabled) {
  const tabs = await chrome.tabs.query({ url: DOCS_MATCH + "*" });
  const path = getIconPath(isEnabled);
  await Promise.all(
    tabs.map((t) => chrome.action.setIcon({ path, tabId: t.id }))
  );
}

async function broadcastToggle(isEnabled) {
  const tabs = await chrome.tabs.query({ url: DOCS_MATCH + "*" });
  await Promise.all(
    tabs.map((t) =>
      chrome.tabs.sendMessage(t.id, { action: "toggle", isEnabled }).catch(() => {})
    )
  );
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ isEnabled: true });
  await applyIconToAllDocsTabs(true);
});

chrome.runtime.onStartup?.addListener(async () => {
  const { isEnabled } = await chrome.storage.local.get("isEnabled");
  await applyIconToAllDocsTabs(isEnabled !== false); // default true
});

chrome.action.onClicked.addListener(async (tab) => {
  let isDocs = false;
  if (tab.url) {
    isDocs = tab.url.startsWith(DOCS_MATCH);
  } else {
    const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
    isDocs = !!active?.url?.startsWith(DOCS_MATCH);
  }
  if (!isDocs) return;

  const { isEnabled } = await chrome.storage.local.get("isEnabled");
  const newIsEnabled = !isEnabled;
  await chrome.storage.local.set({ isEnabled: newIsEnabled });
  await applyIconToAllDocsTabs(newIsEnabled);
  await broadcastToggle(newIsEnabled);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith(DOCS_MATCH)) {
    const { isEnabled } = await chrome.storage.local.get("isEnabled");
    await chrome.action.setIcon({ path: getIconPath(isEnabled !== false), tabId });
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: "toggle",
        isEnabled: isEnabled !== false,
      });
    } catch (e) {
    }
  }
});
