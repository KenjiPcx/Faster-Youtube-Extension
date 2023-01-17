let youtube_url = "https://www.youtube.com/watch?";
let port = chrome.runtime.connect();

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
          port.postMessage({ type: "enableFocusMode" });
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
      port.postMessage({ type: message });
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
        port.postMessage({ type: "startEnergyMonitor" });
        console.log("Sent a startEnergyMonitor evnet");
        port.onMessage.addListener(energyBarListener);
      } else {
        energyLevelBar!.style.display = "none";
        port.onMessage.removeListener(energyBarListener);
        console.log("Sent a stopEnergyMonitor event");
        port.postMessage({ type: "stopEnergyMonitor" });
      }
      await chrome.storage.local.set({ energyBar: energyBarEnabled });
    });
};

const energyBarListener = (message: any, port: chrome.runtime.Port) => {
  console.log(message.energyLevels);
  let energyLevels = document.getElementById("energyLevel");
  if (energyLevels) {
    energyLevels.style.width = `${message.energyLevels}%`;
  }
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

      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        let id = tabs[0].id!;

        if (fasterVideosEnabled) {
          // Show the dropdown
          playbackSpeedMultiplierDropdown!.style.display = "block";
          // Update the speed to the dropdown option and save original speed
          let playbackSpeed = parseFloat(playbackSpeedMultiplier.value);
          chrome.tabs.sendMessage(id, { type: "saveOriginalSpeed" });
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

chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
  console.log("REplaced");
  port = chrome.runtime.connect();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("updated");
  port = chrome.runtime.connect();
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log("Removed");
  port = chrome.runtime.connect();
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Activated");
  port = chrome.runtime.connect();
});
