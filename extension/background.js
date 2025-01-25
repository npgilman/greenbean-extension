import { collection, updateDoc } from "firebase/firestore"; 
import { db } from './firebase/firebaseConfig.js';

let queryCount = 0;
const userRef = doc(db, "users", "user1")

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getQueryCount") {
    console.log("Getting query count...");
    chrome.storage.session.get("queryCount", (data) => {
      const queryCount = data.queryCount || 0;
      console.log("Current query count:", queryCount);
      sendResponse({ queryCount });
    });
    return true;
  }
});

async function incrementQueryCount() {
  chrome.storage.session.get("queryCount", (data) => {
      let queryCount = data.queryCount || 0;
      queryCount++;
      chrome.storage.session.set({ queryCount }, () => {
          console.log("Query count updated to:", queryCount);
      });
  });
  try {
    await updateDoc(userRef, {
      queries: queryCount
    });
    console.log("Document was updated: ", userRef.id);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log("Request to OpenAI API detected:", details.url);
    incrementQueryCount();
    console.log("Sent request to increment");
  },
  { urls: ["https://chatgpt.com/backend-api/lat/r"] },
  ["requestBody"]
);

