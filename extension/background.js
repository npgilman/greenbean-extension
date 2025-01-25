let queryCount = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "incrementQueryCount") {
    console.log("Incremented query count");
    // Get current queryCount from storage, then increment
    chrome.storage.session.get("queryCount", (data) => {
      let queryCount = data.queryCount || 0;
      queryCount++;
      chrome.storage.session.set({ queryCount }, () => {
        // Send the updated queryCount back as a response
        sendResponse({ queryCount });
      });
    });
    return true;  // Indicate that the response will be sent asynchronously
  } else if (message.action === "getQueryCount") {
    console.log("Getting query count...");
    chrome.storage.session.get("queryCount", (data) => {
      const queryCount = data.queryCount || 0;
      console.log("Current query count:", queryCount);
      sendResponse({ queryCount });
    });
    return true;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log("Request to OpenAI API detected:", details.url);
    chrome.runtime.sendMessage({ action: "incrementQueryCount" }, (response) => {
      // Handle response from listener
      console.log("Response from increment:", response);
    });
  },
  { urls: ["https://chatgpt.com/backend-api/lat/r"] },
  ["requestBody"]
);

