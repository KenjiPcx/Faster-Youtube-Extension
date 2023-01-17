let url = "https://www.youtube.com/watch?";
chrome.runtime.onMessage.addListener((msg) => {
    chrome.tabs.query({ active: true }, async (tabs) => {
        console.log(tabs);
        let currentTab = tabs[0];
        if (currentTab.url?.startsWith(url)) {
            if (msg.type === "enableFocusMode") {
                await chrome.scripting.insertCSS({
                    files: ["focus-mode.css"],
                    target: { tabId: currentTab.id },
                });
                await chrome.storage.local.set({ focusMode: true });
            }
            if (msg.type === "disableFocusMode") {
                await chrome.scripting.removeCSS({
                    files: ["focus-mode.css"],
                    target: { tabId: currentTab.id },
                });
                await chrome.storage.local.set({ focusMode: false });
            }
        }
    });
});
