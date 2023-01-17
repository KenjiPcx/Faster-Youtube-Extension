chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  let video = document.querySelector("video");
  if (request.type === "setSpeed") {
    video!.playbackRate = request.playbackSpeed as number;
    await chrome.storage.local.set({
      playbackSpeed: request.playbackSpeed,
    });
  }
  if (request.type === "saveOriginalSpeed") {
    await chrome.storage.local.set({
      originalPlaybackSpeed: video!.playbackRate,
    });
  }
  if (request.type === "setOriginalSpeed") {
    chrome.storage.local.get(["originalPlaybackSpeed"], (result) => {
      video!.playbackRate = result.originalPlaybackSpeed;
    });
  }
});
