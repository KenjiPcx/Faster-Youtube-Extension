let youtube_url = "https://www.youtube.com/watch?";
// Whenever the popup is loaded
document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let currentTab = tabs[0];
        // Controls and ui
        let focusModeSwitch = document.getElementById("focusModeSwitch");
        let energyBarSwitch = document.getElementById("energyBarSwitch");
        let energyLevelBar = document.getElementById("energyBar");
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
        chrome.storage.local.get(["energyBar"], function (result) {
            let energyBar = result.energyBar || false;
            if (energyBar) {
                energyBarSwitch?.setAttribute("checked", "");
            }
            else {
                energyLevelBar.style.display = "none";
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
// Sends an event to background.js to enable/disable focus mode
document
    .getElementById("focusModeSwitch")
    ?.addEventListener("change", (e) => {
    let message = e.target.checked ? "enableFocusMode" : "disableFocusMode";
    chrome.runtime.sendMessage({ type: message });
});
// Sends an event to background.js to enable/disable faster videos
document
    .getElementById("energyBarSwitch")
    ?.addEventListener("change", async (e) => {
    let energyBarEnabled = e.target.checked;
    let energyLevelBar = document.getElementById("energyBar");
    if (energyBarEnabled) {
        energyLevelBar.style.display = "block";
    }
    else {
        energyLevelBar.style.display = "none";
    }
    await chrome.storage.local.set({ energyBar: energyBarEnabled });
});
// Sends an event to background.js to enable/disable faster videos
document
    .getElementById("fasterVideosSwitch")
    ?.addEventListener("change", async (e) => {
    let fasterVideosEnabled = e.target.checked;
    let playbackSpeedMultiplier = document.getElementById("playbackSpeedMultiplier");
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        let id = tabs[0].id;
        if (fasterVideosEnabled) {
            // Show the dropdown
            playbackSpeedMultiplier.style.display = "block";
            // Update the speed to the dropdown option and save original speed
            let playbackSpeed = parseFloat(playbackSpeedMultiplier.value);
            chrome.tabs.sendMessage(id, { type: "saveOriginalSpeed" });
            await setSpeed(playbackSpeed);
        }
        else {
            // Hide the dropdown and reset the speed back to original
            playbackSpeedMultiplier.style.display = "none";
            chrome.tabs.sendMessage(id, { type: "setOriginalSpeed" });
        }
        await chrome.storage.local.set({ fasterVideos: fasterVideosEnabled });
    });
});
// Send an event to background.js to set the custom speed
document
    .getElementById("playbackSpeedMultiplier")
    ?.addEventListener("change", async (e) => {
    let playbackSpeed = parseFloat(e.target.value);
    await setSpeed(playbackSpeed);
});
// Function to set playback speed
const setSpeed = async (playbackSpeed) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let id = tabs[0].id;
        chrome.tabs.sendMessage(id, {
            type: "setSpeed",
            playbackSpeed: playbackSpeed,
        });
    });
    console.log(`Sent set speed message with speed ${playbackSpeed}`);
    await chrome.storage.local.set({ playbackSpeed: playbackSpeed });
};
