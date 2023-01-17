let interval: NodeJS.Timeout;
let startTime = new Date().getTime();
let energyLevels = 0;
let url = "https://www.youtube.com/watch?";
let limit = 300000;
let portConnected = false;

chrome.runtime.onConnect.addListener((port) => {
  portConnected = true;
  port.onMessage.addListener((msg) => {
    if (msg.type === "enableFocusMode" || msg.type === "disableFocusMode")
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        let currentTab = tabs[0] as chrome.tabs.Tab;
        if (currentTab.url?.startsWith(url)) {
          if (msg.type === "enableFocusMode") {
            await chrome.scripting.insertCSS({
              files: ["focus-mode.css"],
              target: { tabId: currentTab.id! },
            });
            await chrome.storage.local.set({ focusMode: true });
          }

          if (msg.type === "disableFocusMode") {
            await chrome.scripting.removeCSS({
              files: ["focus-mode.css"],
              target: { tabId: currentTab.id! },
            });
            await chrome.storage.local.set({ focusMode: false });
          }
        }
      });

    if (msg.type === "startEnergyMonitor") {
      console.log("Started energy monitor");
      // Get the previously stored energy
      chrome.storage.local.get(
        ["energyLevels"],
        (res) => (energyLevels = res.energyLevels || 0)
      );

      // Handle time logging
      startTime = new Date().getTime();
      initEnergyLevelInterval();
    }

    if (msg.type === "stopEnergyMonitor") {
      // Save the energy level
      chrome.storage.local.set({ energyLevels: energyLevels });

      // Clear the interval so that it can be reset again
      if (interval) {
        clearInterval(interval);
      }
    }
  });

  port.onDisconnect.addListener((port) => {
    portConnected = false;
    if (interval) {
      clearInterval(interval);
    }
    initEnergyLevelInterval();
  });

  chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
    if (interval) {
      clearInterval(interval);
    }
    initEnergyLevelInterval();
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (interval) {
      clearInterval(interval);
    }
    initEnergyLevelInterval();
  });

  chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (interval) {
      clearInterval(interval);
    }
    initEnergyLevelInterval();
  });

  chrome.tabs.onActivated.addListener((activeInfo) => {
    if (interval) {
      clearInterval(interval);
    }
    initEnergyLevelInterval();
  });

  const initEnergyLevelInterval = () => {
    interval = setInterval(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.get(tabs[0].id!, async (tab) => {
          let elapsedTime = new Date().getTime() - startTime;
          if (tab.url?.startsWith(url)) {
            if (energyLevels > limit) {
              energyLevels = limit;
              await chrome.scripting.executeScript({
                files: ["timeout.js"],
                target: { tabId: tabs[0].id! },
              });
            }
            energyLevels += elapsedTime;
          } else {
            energyLevels -= elapsedTime;
            if (energyLevels < 0) energyLevels = 0;
          }
          startTime = new Date().getTime();
          if (portConnected) {
            port.postMessage({
              energyLevels: (1 - energyLevels / limit) * 100,
            });
            console.log(
              `Posted time to browser ${(1 - energyLevels / limit) * 100}`
            );
          }
        });
      });
    }, 5000);
  };
});
