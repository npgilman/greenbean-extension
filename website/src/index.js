// index.js

import { getDataFromFirestore } from './firebase/firebaseUtils.js';

// Add an event listener for the click event
const button = document.getElementById('loadStatsButton');
button.addEventListener('click', () => {
  getDataFromFirestore();
});


// do other stuff
