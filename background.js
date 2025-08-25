chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: false });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url && tab.url.startsWith("https://docs.google.com/")) {
    const { isEnabled } = await chrome.storage.local.get("isEnabled");
    const newIsEnabled = !isEnabled;
    await chrome.storage.local.set({ isEnabled: newIsEnabled });

    const iconPath = newIsEnabled
      ? {
          "16": "icons/icon16.png",
          "48": "icons/icon48.png",
          "128": "icons/icon128.png",
        }
      : {
          "16": "icons/icon16-disabled.png",
          "48": "icons/icon48-disabled.png",
          "128": "icons/icon128-disabled.png",
        };
    await chrome.action.setIcon({ path: iconPath, tabId: tab.id });

    await chrome.tabs.sendMessage(tab.id, {
      action: "toggle",
      isEnabled: newIsEnabled,
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.startsWith("https://docs.google.com/")
  ) {
    const { isEnabled } = await chrome.storage.local.get("isEnabled");
    const iconPath = isEnabled
      ? {
          "16": "icons/icon16.png",
          "48": "icons/icon48.png",
          "128": "icons/icon128.png",
        }
      : {
          "16": "icons/icon16-disabled.png",
          "48": "icons/icon48-disabled.png",
          "128": "icons/icon128-disabled.png",
        };
    await chrome.action.setIcon({ path: iconPath, tabId: tabId });
  }
});
