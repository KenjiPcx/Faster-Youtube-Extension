window.addEventListener("load", () => {
  // Checks whether there are videos on the page to enable the setting
  let hasVideos = false;
  let videos = document.querySelectorAll("video");
  hasVideos = videos.length > 0;

  // Checks for videos nested inside iframes as well
  let hasNestedVideos = false;
  let iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    let nestedVideos = iframe.contentDocument!.querySelectorAll("video");
    if (nestedVideos.length > 0) {
      hasNestedVideos = true;
    }
  });

  // Set state to enable/disable the control in the popup
  chrome.storage.local.set({ hasVideos: hasVideos || hasNestedVideos });

  // Sets up speed handlers for videos
  if (hasVideos) {
    chrome.runtime.onMessage.addListener(
      async (request, sender, sendResponse) => {
        let videos = document.querySelectorAll("video");
        if (request.type === "setSpeed") {
          videos.forEach((video) => {
            video!.playbackRate = request.playbackSpeed as number;
          });
          await chrome.storage.local.set({
            playbackSpeed: request.playbackSpeed,
          });
        }
        if (request.type === "saveOriginalSpeed") {
          await chrome.storage.local.set({
            originalPlaybackSpeed: videos[0]!.playbackRate,
          });
        }
      }
    );
  }

  // Sets up speed handlers for videos nested within iframes
  if (hasNestedVideos) {
    chrome.runtime.onMessage.addListener(
      async (request, sender, sendResponse) => {
        let iframes = document.querySelectorAll("iframe");
        iframes.forEach(async (iframe) => {
          let videos = iframe.contentDocument!.querySelectorAll("video");
          if (request.type === "setSpeed") {
            videos.forEach((video) => {
              video!.playbackRate = request.playbackSpeed as number;
            });
            await chrome.storage.local.set({
              playbackSpeed: request.playbackSpeed,
            });
          }
          if (request.type === "saveOriginalSpeed") {
            await chrome.storage.local.set({
              originalPlaybackSpeed: videos[0]!.playbackRate,
            });
          }
        });
      }
    );
  }
});

console.log("Hello");
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
});
