// Type: Service Worker
// Description: Service Worker for the Productivity Extension

// Features
// - Needs an on off interface
// - Data structure to store the amount of time spent on youtube in one session
// - Check if page is youtube
// - Hide everything on my screen when timer is up
// - Cooldown feature when I am not watching youtube
//     - Cooloff feature to reset the timer
// - Integration with my Todoist to make sure I am not supposed to watch YouTube at this time
// - Need to integrate some failure condition to make sure I don't turn it off

let startTime;

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

const YOUTUBE_URL = "https://www.youtube.com/";
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.startsWith(YOUTUBE_URL)) {
    chrome.action.setBadgeText({
      text: "ON",
    });
  } else {
    chrome.action.setBadgeText({
      text: "OFF",
    });
  }
});

