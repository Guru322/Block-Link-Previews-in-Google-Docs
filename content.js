const setBlockingClass = (enabled) => {
  if (enabled) {
    document.body.classList.add("block-link-previews");
  } else {
    document.body.classList.remove("block-link-previews");
  }
};

chrome.storage.local.get("isEnabled", (data) => {
  const enabled = data.isEnabled === undefined ? true : data.isEnabled;
  setBlockingClass(enabled);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggle") {
    setBlockingClass(message.isEnabled);
  }
});
