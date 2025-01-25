let queryCount = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "incrementQueryCount") {
    queryCount++;
    chrome.storage.session.set({ queryCount });
  } else if (message.action === "getQueryCount") {
    sendResponse({ queryCount });
  }
});
