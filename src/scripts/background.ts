const url = "https://www.youtube.com/watch?";
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.setBadgeText({
//     text: "OFF",
//   });
// });

// chrome.action.onClicked.addListener(async (tab) => {
//   // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//   const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//   // Next state will always be the opposite
//   const nextState = prevState === "ON" ? "OFF" : "ON";

//   // Set the action badge to the next state
//   await chrome.action.setBadgeText({
//     tabId: tab.id,
//     text: nextState,
//   });
//   if (nextState === "ON") {
//     // Insert the CSS file when the user turns the extension on
//     await chrome.scripting.insertCSS({
//       files: ["focus-mode.css"],
//       target: { tabId: tab.id! },
//     });
//   } else if (nextState === "OFF") {
//     // Remove the CSS file when the user turns the extension off
//     await chrome.scripting.removeCSS({
//       files: ["focus-mode.css"],
//       target: { tabId: tab.id! },
//     });
//   }
// });

// // Main Program
// let startTime: number;
// let intervalId: NodeJS.Timeout;
// let elapsedTime: number;
// let timeSpentOnYouTube = 0;
// const YOUTUBE_URL = "https://www.youtube.com/";
// const UPDATE_INTERVAL = 2 * 1000;
// let prevIsYouTube: boolean = false;

// setInterval(() => {
//   console.log(timeSpentOnYouTube);
// }, 1000);
// chrome.action.onClicked.addListener(async (tab) => {
//   console.log("Clicked action");
// });

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   console.log("Active event");
//   console.log(activeInfo);

//   // If previous timer already exists
//   if (intervalId) {
//     if (prevIsYouTube) {
//       timeSpentOnYouTube += Date.now() - startTime;
//     } else if (timeSpentOnYouTube > 0) {
//       timeSpentOnYouTube -= Date.now() - startTime;
//       if (timeSpentOnYouTube < 0) {
//         timeSpentOnYouTube = 0;
//       }
//     }
//     clearInterval(intervalId);
//   }

//   // Set up a new timer for the current tab
//   chrome.tabs.get(activeInfo.tabId, (tab) => {
//     prevIsYouTube = tab.url!.startsWith(YOUTUBE_URL);

//     startTime = Date.now();
//     intervalId = setInterval(() => {
//       elapsedTime = Date.now() - startTime;
//       if (tab.url?.startsWith(YOUTUBE_URL)) {
//         timeSpentOnYouTube += elapsedTime;
//       } else {
//         timeSpentOnYouTube -= elapsedTime;
//         if (timeSpentOnYouTube < 0) {
//           timeSpentOnYouTube = 0;
//         }
//       }
//       startTime = Date.now();
//     }, UPDATE_INTERVAL);
//   });
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log("Update event");

//   if (intervalId) {
//     if (prevIsYouTube) {
//       timeSpentOnYouTube += Date.now() - startTime;
//     } else if (timeSpentOnYouTube > 0) {
//       timeSpentOnYouTube -= Date.now() - startTime;
//       if (timeSpentOnYouTube < 0) {
//         timeSpentOnYouTube = 0;
//       }
//     }
//   }
// });

// chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
//   if (intervalId) {
//     if (prevIsYouTube) {
//       timeSpentOnYouTube += Date.now() - startTime;
//     } else if (timeSpentOnYouTube > 0) {
//       timeSpentOnYouTube -= Date.now() - startTime;
//       if (timeSpentOnYouTube < 0) {
//         timeSpentOnYouTube = 0;
//       }
//     }
//     clearInterval(intervalId);
//   }
// });

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log("Your question was: " + request.myQuestion);

//   // here we will get information whether ext is ON or OFF from the popup;

//   sendResponse({ state: "I don't know, but I'll find it out!" });
// });

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.setBadgeText({
//     text: "OFF",
//   });
// });

// // chrome.action.onClicked.addListener(async (tab) => {
// //   if (tab.url!.startsWith(url)) {

// //     if (tab.id) {
// //       // Insert the CSS file when the user turns the extension on
// //       await chrome.scripting.insertCSS({
// //         files: ["focus-mode.css"],
// //         target: { tabId: tab.id },
// //       });
// //     } else if (nextState === "OFF") {
// //       // Remove the CSS file when the user turns the extension off
// //       await chrome.scripting.removeCSS({
// //         files: ["focus-mode.css"],
// //         target: { tabId: tab.id },
// //       });
// //     }
// //   }
// // });

// Receives the message calls to handle actions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.tabs.query({ active: true }, async (tabs) => {
    let currentTab = tabs[0] as chrome.tabs.Tab;

    // Enable/Disable focus mode
    if (currentTab.url?.startsWith(url)) {
      if (request.type === "enableFocusMode") {
        await chrome.scripting.insertCSS({
          files: ["focus-mode.css"],
          target: { tabId: currentTab.id! },
        });
        await chrome.storage.local.set({ focusMode: true });
      }

      if (request.type === "disableFocusMode") {
        await chrome.scripting.removeCSS({
          files: ["focus-mode.css"],
          target: { tabId: currentTab.id! },
        });
        await chrome.storage.local.set({ focusMode: false });
      }
    }
  });
});
