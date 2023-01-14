let youtube_url = "https://www.youtube.com/watch?";

// Whenever the popup is loaded
document.addEventListener("DOMContentLoaded", async () => {
  await chrome.tabs.query({ active: true }, async (tabs) => {
    let currentTab = tabs[0] as chrome.tabs.Tab;
    let focusModeSwitch = document.getElementById("focusModeSwitch");

    // Checks whether focus mode was enabled previously and
    // set the slider if it was set
    if (currentTab.url?.startsWith(youtube_url)) {
      await chrome.storage.local.get(["focusMode"], function (result) {
        let focusMode = result.focusMode || false;
        if (focusMode) {
          focusModeSwitch?.setAttribute("checked", "");
        }
      });
    } else {
      focusModeSwitch?.setAttribute("disabled", "");
    }
  });
});

// Sends an event to the background.js file to enable/disable focus mode
document
  .getElementById("focusModeSwitch")!
  .addEventListener("change", (e: any) => {
    let message = e.target.checked ? "enableFocusMode" : "disableFocusMode";
    chrome.runtime.sendMessage({ type: message });
  });
