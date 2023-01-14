// Checks whether focus mode was enabled previously and
// set the slider if it was set
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["focusMode"], function (result) {
    let focusMode = result.focusMode || false;
    let focusModeSwitch = document.getElementById("focusModeSwitch");
    if (focusMode) {
      focusModeSwitch?.setAttribute("checked", "");
    }
  });
});

// Sends an event to the background.js file to enable/disable focus mode
document
  .getElementById("focusModeSwitch")!
  .addEventListener("change", (e: any) => {
    console.log("Sent message");
    let message = e.target.checked ? "enableFocusMode" : "disableFocusMode";
    chrome.runtime.sendMessage({ type: message });
  });
