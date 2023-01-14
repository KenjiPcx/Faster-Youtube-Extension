let youtube_url = "https://www.youtube.com/watch?";
// Whenever the popup is loaded
document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true }, (tabs) => {
        let currentTab = tabs[0];
        // Controls and ui
        let focusModeSwitch = document.getElementById("focusModeSwitch");
        let energyBarSwitch = document.getElementById("energyBarSwitch");
        let fasterVideosSwitch = document.getElementById("fasterVideosSwitch");
        let playbackSpeedMultiplier = document.getElementById("playbackSpeedMultiplier");
        // Checks whether focus mode was enabled previously and
        // set the slider if it was set
        if (currentTab.url?.startsWith(youtube_url)) {
            chrome.storage.local.get(["focusMode"], function (result) {
                let focusMode = result.focusMode || false;
                if (focusMode) {
                    focusModeSwitch?.setAttribute("checked", "");
                }
            });
        }
        else {
            focusModeSwitch?.setAttribute("disabled", "");
        }
        // Checks whether energy bar was enabled before and sets it if it was
        chrome.storage.local.get(["fasterVideos"], function (result) {
            let energyBar = result.energyBar || false;
            if (energyBar) {
                energyBarSwitch?.setAttribute("checked", "");
            }
        });
        // Checks whether faster mode was enabled before and sets it if it was
        if (currentTab.url?.startsWith(youtube_url)) {
            chrome.storage.local.get(["fasterVideos"], function (result) {
                let fasterVideos = result.fasterVideos || false;
                if (fasterVideos) {
                    fasterVideosSwitch?.setAttribute("checked", "");
                }
                else {
                    playbackSpeedMultiplier.style.display = "none";
                }
            });
        }
        else {
            fasterVideosSwitch?.setAttribute("disabled", "");
            playbackSpeedMultiplier.style.display = "none";
        }
    });
});
// Sends an event to the background.js file to enable/disable focus mode
document
    .getElementById("focusModeSwitch")
    .addEventListener("change", (e) => {
    let message = e.target.checked ? "enableFocusMode" : "disableFocusMode";
    chrome.runtime.sendMessage({ type: message });
});