document.body.classList.add("block-link-previews");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggle") {
    if (message.isEnabled) {
      document.body.classList.add("block-link-previews");
    } else {
      document.body.classList.remove("block-link-previews");
    }
  }
});
