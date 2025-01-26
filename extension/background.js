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

const currentEmail = null

let queryCount = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "signInUser") {
    const email = message.email;
    if (email) {
      // Check if user email exists in Firestore
      const userEmailRef = doc(db, "users", email); // Use email as document ID

      getDoc(userEmailRef).then(docSnap => {
        if (docSnap.exists()) {
          // User exists, proceed with sign-in logic
          saveUserEmail(email); // Save the Gmail to Firestore and chrome storage
          sendResponse({ success: true, message: "User signed in successfully." });
        } else {
          // User not found, send failure response
          sendResponse({ success: false, message: "Email not found in database." });
        }
      }).catch(error => {
        console.error("Error checking user email:", error);
        sendResponse({ success: false, message: "An error occurred while signing in." });
      });

      // Return true to indicate that the response is asynchronous
      return true;
    } else {
      sendResponse({ success: false, message: "No email provided." });
    }
  }

  if (message.action === "signOutUser") {
    signOutUser(); // Call the function to sign out the user
    sendResponse({ success: true, message: "User signed out successfully." });
  }

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

async function saveUserEmail(email) {
  try {
    const userEmailRef = doc(db, "users", email); // Use email as document ID

    const docSnap = await getDoc(userEmailRef);

    if (docSnap.exists()) {
      // Save email to chrome storage so we can remember it
      chrome.storage.local.set({ userEmail: email }, () => {
        console.log("User email saved to chrome storage:", email);
      });
    } else {
      console.log("User: ", email, " not found.");
    }
    
  } catch (error) {
    console.error("Error saving user email:", error);
  }
}


async function incrementQueryCount(email) {
  try {
    const userRef = doc(db, "users", email);

    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // If the document exists, retrieve and update the queryCount
      const currentQueryCount = docSnap.data().queryCounter || 0;
      await updateDoc(userRef, { queryCounter: currentQueryCount + 1 });
      console.log("Query count (all-time) updated to:", currentQueryCount + 1);
    } else {
      // If the document doesn't exist, initialize it with queryCount = 1
      console.log("Can't increment, user doesn't exist")
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

async function appendDateTime(email) {
  try {
    const userRef = doc(db, "users", email);

    const docSnap = await getDoc(userRef);

    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().slice(0, 10); // Get YYYY-MM-DD format

    if (docSnap.exists()) {
      // If the document exists, retrieve the current queryDates object
      const currentQueryDates = docSnap.data().queryDates || {};

      // Check if the current date already exists in the object
      if (currentQueryDates[formattedDate]) {
        // If it exists, increment the counter for that day
        currentQueryDates[formattedDate]++;
      } else {
        // If it doesn't exist, initialize the counter for that day
        currentQueryDates[formattedDate] = 1;
      }

      // Update document with the modified queryDates object
      await updateDoc(userRef, { queryDates: currentQueryDates });
      console.log("Updated query count for date:", formattedDate);
    } else {
      console.log("Can't increment daily counter, user doesn't exist");
    }
  } catch (error) {
    console.error("Error updating Firestore document:", error);
  }
}


function signOutUser() {
  chrome.storage.local.remove("userEmail", () => {
    console.log("User signed out and email removed from storage.");
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Check if the user email is stored in local storage (user is signed in)
    chrome.storage.local.get("userEmail", (data) => {
      if (data.userEmail) {
        console.log("Request to OpenAI API detected:", details.url);
        incrementQueryCount(data.userEmail);
        console.log("Sent request to increment");
        appendDateTime(data.userEmail);
        console.log("Sent request to append time");
      } else {
        console.log("No user signed in. Skipping increment and append.");
      }
    });
  },
  { urls: ["https://chatgpt.com/backend-api/lat/r"] },
  ["requestBody"]
);