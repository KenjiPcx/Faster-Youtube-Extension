// // Default Settings
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.setBadgeText({
//     text: "OFF",
//   });
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
