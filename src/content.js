console.log("Hello");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "click") {
        console.log("User clicked the button!");
    }
});
chrome.action.onClicked.addListener(async (tab) => {
    console.log("EE: ");
    await chrome.scripting.insertCSS({
        files: ["youtube-anti-distraction.css"],
        target: { tabId: tab.id },
    });
});
