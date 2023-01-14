// Display a timer like interface about how long I've spent on this domain
document
    .getElementById("focusModeSwitch")
    .addEventListener("change", (e) => {
    console.log("Sent message");
    let message = e.target.checked ? "enableFocusMode" : "disableFocusMode";
    chrome.runtime.sendMessage({ type: message });
});
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(["focusMode"], function (result) {
        let focusMode = result.focusMode || false;
        let focusModeSwitch = document.getElementById("focusModeSwitch");
        if (focusMode) {
            focusModeSwitch?.setAttribute("checked", "");
        }
    });
});
