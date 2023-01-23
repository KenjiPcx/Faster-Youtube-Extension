let allowed = ["https://www.youtube.com/"];
// Whenever the popup is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get the UI components
    let fasterVideosSwitch = document.getElementById("fasterVideosSwitch");
    let playbackSpeedMultiplierCard = document.getElementById("playbackSpeedMultiplierCard");
    let matched = false;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        allowed.forEach((url) => {
            if (tabs[0].url.startsWith(url)) {
                matched = true;
            }
        });
        chrome.storage.local.get(["hasVideos"], (result) => {
            console.log("hasVideos", result.hasVideos);
            if (!result.hasVideos || !matched) {
                // Disable when no vids were found
                fasterVideosSwitch?.setAttribute("disabled", "");
                playbackSpeedMultiplierCard.style.display = "none";
                return;
            }
            // Checks whether faster mode was enabled before and sets it if it was
            chrome.storage.local.get(["fasterVideos"], (result) => {
                let fasterVideos = result.fasterVideos || false;
                if (fasterVideos) {
                    fasterVideosSwitch?.setAttribute("checked", "");
                }
                else {
                    playbackSpeedMultiplierCard.style.display = "none";
                }
            });
            // Initialize commands
            initFasterVideosSwitch();
            initFasterVideos();
        });
    });
});
const initFasterVideosSwitch = () => {
    // Sends an event to background.js to enable/disable faster videos
    document
        .getElementById("fasterVideosSwitch")
        ?.addEventListener("change", async (e) => {
        let fasterVideosEnabled = e.target.checked;
        let playbackSpeedMultiplierCard = document.getElementById("playbackSpeedMultiplierCard");
        let playbackSpeedMultiplier = document.getElementById("playbackSpeedMultiplier");
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            let id = tabs[0].id;
            if (fasterVideosEnabled) {
                // Show the card and
                // Update the speed to the card option and save original speed
                playbackSpeedMultiplierCard.style.display = "block";
                chrome.tabs.sendMessage(id, { type: "saveOriginalSpeed" });
                await setSpeed(parseFloat(playbackSpeedMultiplier.value));
            }
            else {
                // Hide the card and reset the speed back to original
                playbackSpeedMultiplierCard.style.display = "none";
                chrome.storage.local.get(["originalPlaybackSpeed"], async (result) => {
                    await setSpeed(result.originalPlaybackSpeed);
                });
            }
            // Remember whether setting is enabled for next time
            await chrome.storage.local.set({ fasterVideos: fasterVideosEnabled });
        });
    });
};
const initFasterVideos = () => {
    // Update playback speed whenever dropdown option is selected
    document
        .getElementById("playbackSpeedMultiplier")
        ?.addEventListener("change", async (e) => {
        await setSpeed(parseFloat(e.target.value));
    });
};
const setSpeed = async (playbackSpeed) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let id = tabs[0].id;
        chrome.tabs.sendMessage(id, {
            type: "setSpeed",
            playbackSpeed: playbackSpeed,
        });
    });
    await chrome.storage.local.set({ playbackSpeed: playbackSpeed });
};
