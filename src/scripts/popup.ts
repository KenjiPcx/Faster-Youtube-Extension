let youtube_url = "https://www.youtube.com/watch?";

// Whenever the popup is loaded
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTab = tabs[0] as chrome.tabs.Tab;

    // Controls and ui
    let focusModeSwitch = document.getElementById("focusModeSwitch");
    let fasterVideosSwitch = document.getElementById("fasterVideosSwitch");
    let playbackSpeedMultiplierCard = document.getElementById(
      "playbackSpeedMultiplierCard"
    );

    // Checks whether focus mode was enabled previously and
    // set the slider if it was set
    if (currentTab.url?.startsWith(youtube_url)) {
      chrome.storage.local.get(["focusMode"], function (result) {
        let focusMode = result.focusMode || false;
        if (focusMode) {
          focusModeSwitch?.setAttribute("checked", "");
          chrome.runtime.sendMessage({ type: "enableFocusMode" });
        }
      });
    } else {
      focusModeSwitch?.setAttribute("disabled", "");
    }

    // Checks whether faster mode was enabled before and sets it if it was
    if (currentTab.url?.startsWith(youtube_url)) {
      chrome.storage.local.get(["fasterVideos"], function (result) {
        let fasterVideos = result.fasterVideos || false;
        if (fasterVideos) {
          fasterVideosSwitch?.setAttribute("checked", "");
        } else {
          playbackSpeedMultiplierCard!.style.display = "none";
        }
      });
    } else {
      fasterVideosSwitch?.setAttribute("disabled", "");
      playbackSpeedMultiplierCard!.style.display = "none";
    }
  });

  // Initialize commands
  initFocusModeSwitch();
  initFasterVideosSwitch();
  initFasterVideos();
});

const initFocusModeSwitch = () => {
  // Sends an event to background.js to enable/disable focus mode
  document
    .getElementById("focusModeSwitch")
    ?.addEventListener("change", (e: any) => {
      let message = e.target.checked ? "enableFocusMode" : "disableFocusMode";
      chrome.runtime.sendMessage({ type: message });
    });
};

const initFasterVideosSwitch = () => {
  // Sends an event to background.js to enable/disable faster videos
  document
    .getElementById("fasterVideosSwitch")
    ?.addEventListener("change", async (e: any) => {
      let fasterVideosEnabled = e.target.checked;
      let playbackSpeedMultiplierCard = document.getElementById(
        "playbackSpeedMultiplierCard"
      );
      let playbackSpeedMultiplier = document.getElementById(
        "playbackSpeedMultiplier"
      ) as HTMLInputElement;

      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        let id = tabs[0].id!;

        if (fasterVideosEnabled) {
          // Show the card
          playbackSpeedMultiplierCard!.style.display = "block";
          // Update the speed to the card option and save original speed
          let playbackSpeed = parseFloat(playbackSpeedMultiplier.value);
          chrome.tabs.sendMessage(id, { type: "saveOriginalSpeed" });
          await setSpeed(playbackSpeed);
        } else {
          // Hide the card and reset the speed back to original
          playbackSpeedMultiplierCard!.style.display = "none";
          chrome.tabs.sendMessage(id, { type: "setOriginalSpeed" });
        }

        await chrome.storage.local.set({ fasterVideos: fasterVideosEnabled });
      });
    });
};

const initFasterVideos = () => {
  // Send an event to background.js to set the custom speed
  document
    .getElementById("playbackSpeedMultiplier")
    ?.addEventListener("change", async (e: any) => {
      let playbackSpeed = parseFloat(e.target.value);
      await setSpeed(playbackSpeed);
    });
};

const setSpeed = async (playbackSpeed: number) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let id = tabs[0].id!;
    chrome.tabs.sendMessage(id, {
      type: "setSpeed",
      playbackSpeed: playbackSpeed,
    });
  });
  await chrome.storage.local.set({ playbackSpeed: playbackSpeed });
};
