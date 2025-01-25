// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);