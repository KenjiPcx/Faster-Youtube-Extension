window.addEventListener("load", () => {
  // Checks whether there are videos on the page to enable the setting
  let hasVideos = false;
  let videos = document.querySelectorAll("video");
  hasVideos = videos.length > 0;

  // Set state to enable/disable the control in the popup
  chrome.storage.local.set({ hasVideos: hasVideos });

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
});