import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx2QVtsJW_FEvBq37p8r1LMBpmsDnKldw",
  authDomain: "swamphacks25.firebaseapp.com",
  projectId: "swamphacks25",
  storageBucket: "swamphacks25.firebasestorage.app",
  messagingSenderId: "527497271738",
  appId: "1:527497271738:web:95735707f581ab6c86e583",
  measurementId: "G-HNEMK974ZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userRef = doc(db, "users", "user1");

let queryCount = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getQueryCount") {
    // console.log("Getting query count for this session...");
    chrome.storage.session.get("queryCount", (data) => {
      const queryCount = data.queryCount || 0;
      console.log("Query count (this session):", queryCount);
      sendResponse({ queryCount });
    });
    return true;
  }
});

async function incrementQueryCount() {
  try {
    // Fetch the document
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // If the document exists, retrieve and update the queryCount
      const currentQueryCount = docSnap.data().queries || 0;
      await updateDoc(userRef, { queries: currentQueryCount + 1 });
      console.log("Query count (all-time) updated to:", currentQueryCount + 1);
    } else {
      // If the document doesn't exist, initialize it with queryCount = 1
      await setDoc(userRef, { queries: 1 });
      console.log("Document created with initial query count: 1");
    }
  } catch (error) {
    console.error("Error updating Firestore document:", error);
  }
  chrome.storage.session.get("queryCount", (data) => {
    let queryCount = data.queryCount || 0;
    queryCount++;
    chrome.storage.session.set({ queryCount }, () => {
      console.log("Query count (this session) updated to:", queryCount);
    });
  });
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