const styles = {
  files: ["styles.css"],
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: true });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith("https://docs.google.com/")) {
    const { isEnabled } = await chrome.storage.local.get("isEnabled");
    const newIsEnabled = !isEnabled;
    chrome.storage.local.set({ isEnabled: newIsEnabled });

    if (newIsEnabled) {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        ...styles,
      });
      await chrome.action.setIcon({
        path: {
          "16": "icons/icon16.png",
          "48": "icons/icon48.png",
          "128": "icons/icon128.png",
        },
        tabId: tab.id,
      });
    } else {
      await chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        ...styles,
      });
      await chrome.action.setIcon({
        path: {
          "16": "icons/icon16-disabled.png",
          "48": "icons/icon48-disabled.png",
          "128": "icons/icon128-disabled.png",
        },
        tabId: tab.id,
      });
    }
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.startsWith("https://docs.google.com/")
  ) {
    const { isEnabled } = await chrome.storage.local.get("isEnabled");
    if (isEnabled) {
      await chrome.scripting.insertCSS({
        target: { tabId: tabId },
        ...styles,
      });
      await chrome.action.setIcon({
        path: {
          "16": "icons/icon16.png",
          "48": "icons/icon48.png",
          "128": "icons/icon128.png",
        },
        tabId: tabId,
      });
    } else {
      await chrome.action.setIcon({
        path: {
          "16": "icons/icon16-disabled.png",
          "48": "icons/icon48-disabled.png",
          "128": "icons/icon128-disabled.png",
        },
        tabId: tabId,
      });
    }
  }
});
