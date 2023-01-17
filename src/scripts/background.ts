let url = "https://www.youtube.com/watch?";

chrome.runtime.onMessage.addListener((msg) => {
  chrome.tabs.query({ active: true }, async (tabs) => {
    let currentTab = tabs[0] as chrome.tabs.Tab;

    if (currentTab.url?.startsWith(url)) {
      if (msg.type === "enableFocusMode") {
        await chrome.scripting.insertCSS({
          css: `*::-webkit-scrollbar {
                  display: none;
                }
                #below {
                  display: none;
                }
                #secondary {
                  display: none;
                }
                #player-theater-container {
                  margin-top: min(2.5vmax, 10rem);
                  margin-bottom: min(2.5vmax, 10rem);
                }
                .ytp-endscreen-content {
                  display: none;
                }
                .ytp-autonav-endscreen-upnext-container {
                  display: none;
                }
                .ytp-autonav-endscreen-button-container {
                  display: none;
                }`,
          target: { tabId: currentTab.id! },
        });
        await chrome.storage.local.set({ focusMode: true });
      }

      if (msg.type === "disableFocusMode") {
        await chrome.scripting.removeCSS({
          css: `*::-webkit-scrollbar {
                  display: none;
                }
                #below {
                  display: none;
                }
                #secondary {
                  display: none;
                }
                #player-theater-container {
                  margin-top: min(2.5vmax, 10rem);
                  margin-bottom: min(2.5vmax, 10rem);
                }
                .ytp-endscreen-content {
                  display: none;
                }
                .ytp-autonav-endscreen-upnext-container {
                  display: none;
                }
                .ytp-autonav-endscreen-button-container {
                  display: none;
                }`,
          target: { tabId: currentTab.id! },
        });
        await chrome.storage.local.set({ focusMode: false });
      }
    }
  });
});
