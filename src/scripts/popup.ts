let youtube_url = "https://www.youtube.com/watch?";

// Whenever the popup is loaded
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTab = tabs[0] as chrome.tabs.Tab;

    // Controls and ui
    let focusModeSwitch = document.getElementById("focusModeSwitch");
    let energyBarSwitch = document.getElementById("energyBarSwitch");
    let energyLevelBar = document.getElementById("energyBar");
    let fasterVideosSwitch = document.getElementById("fasterVideosSwitch");
    let playbackSpeedMultiplier = document.getElementById(
      "playbackSpeedMultiplier"
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

    // Checks whether energy bar was enabled before and sets it if it was
    chrome.storage.local.get(["energyBar"], function (result) {
      let energyBar = result.energyBar || false;
      if (energyBar) {
        energyBarSwitch?.setAttribute("checked", "");
      } else {
        energyLevelBar!.style.display = "none";
      }
    });

    // Checks whether faster mode was enabled before and sets it if it was
    if (currentTab.url?.startsWith(youtube_url)) {
      chrome.storage.local.get(["fasterVideos"], function (result) {
        let fasterVideos = result.fasterVideos || false;
        if (fasterVideos) {
          fasterVideosSwitch?.setAttribute("checked", "");
        } else {
          playbackSpeedMultiplier!.style.display = "none";
        }
      });
    } else {
      fasterVideosSwitch?.setAttribute("disabled", "");
      playbackSpeedMultiplier!.style.display = "none";
    }
  });

  // Initialize commands
  initFocusModeSwitch();
  initEnergyBarSwitch();
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

const initEnergyBarSwitch = () => {
  // Sends an event to background.js to enable/disable energy bar
  document
    .getElementById("energyBarSwitch")
    ?.addEventListener("change", async (e: any) => {
      let energyBarEnabled = e.target.checked;
      let energyLevelBar = document.getElementById("energyBar");
      if (energyBarEnabled) {
        energyLevelBar!.style.display = "block";
      } else {
        energyLevelBar!.style.display = "none";
      }
      await chrome.storage.local.set({ energyBar: energyBarEnabled });
    });
};

const initFasterVideosSwitch = () => {
  // Sends an event to background.js to enable/disable faster videos
  document
    .getElementById("fasterVideosSwitch")
    ?.addEventListener("change", async (e: any) => {
      let fasterVideosEnabled = e.target.checked;
      let playbackSpeedMultiplierDropdown = document.getElementById(
        "playbackSpeedMultiplierDropdown"
      );
      let playbackSpeedMultiplier = document.getElementById(
        "playbackSpeedMultiplier"
      ) as HTMLInputElement;
      console.log(playbackSpeedMultiplier);

      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        let id = tabs[0].id!;

        if (fasterVideosEnabled) {
          // Show the dropdown
          playbackSpeedMultiplierDropdown!.style.display = "block";
          // Update the speed to the dropdown option and save original speed
          let playbackSpeed = parseFloat(playbackSpeedMultiplier.value);
          chrome.tabs.sendMessage(id, { type: "saveOriginalSpeed" });
          console.log(playbackSpeedMultiplier.value);
          console.log(playbackSpeed);
          await setSpeed(playbackSpeed);
        } else {
          // Hide the dropdown and reset the speed back to original
          playbackSpeedMultiplierDropdown!.style.display = "none";
          chrome.tabs.sendMessage(id, { type: "setOriginalSpeed" });
        }

        await chrome.storage.local.set({ fasterVideos: fasterVideosEnabled });
      });
    });
};

// Send an event to background.js to set the custom speed
const initFasterVideos = () => {
  document
    .getElementById("playbackSpeedMultiplier")
    ?.addEventListener("change", async (e: any) => {
      let playbackSpeed = parseFloat(e.target.value);
      console.log("Playbackspeed", playbackSpeed);
      await setSpeed(playbackSpeed);
    });
};

// Function to set playback speed
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
