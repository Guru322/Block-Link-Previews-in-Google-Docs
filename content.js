const setBlockingClass = (enabled) => {
  if (enabled) {
    document.body.classList.add("block-link-previews");
  } else {
    document.body.classList.remove("block-link-previews");
  }
};

chrome.storage.local.get("isEnabled", (data) => {
  setBlockingClass(data.isEnabled);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggle") {
    setBlockingClass(message.isEnabled);
  }
});
