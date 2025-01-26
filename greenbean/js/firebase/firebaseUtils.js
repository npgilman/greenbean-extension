import { getDocs, collection, query, where, doc, setDoc, documentId } from "firebase/firestore";
import { db } from './firebaseConfig.js';


export async function getUserData(userId) {
  try {
    const q = query(collection(db, 'users'), where(documentId(), "==", userId));
    return await getDocs(q);
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
}

export async function enrollUser(userId, name) {
  await setDoc(doc(db, "users", userId), {
    userName: name,
    dateJoined: new Date(),
    queryCounter: 0,
    queryTimes: []
  });
}

export async function getLeaderboard() {
  const leaderboardRoot = document.getElementById("leaderboard");
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let leaderboardData = []; // Array to store user data temporarily

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const userName = userData.userName || 'Unknown User'; // Default if no userName exists
      const queryCounter = userData.queryCounter || 0;

      // Push each user’s data into the leaderboardData array
      leaderboardData.push({ userName, queryCounter });
    });

    // Sort the leaderboardData array by queryCounter in descending order
    leaderboardData.sort((a, b) => a.queryCounter - b.queryCounter);

    // Build the leaderboard HTML
    let leaderboardHTML = '';
    leaderboardData.forEach((user) => {
      leaderboardHTML += `
        <li class="leaderboard-item">
          <div class="user-info">
            <span class="username">${user.userName}</span>
            <span class="query-counter">Queries: ${user.queryCounter}</span>
          </div>
        </li>
      `;
    });

    leaderboardRoot.innerHTML = leaderboardHTML; // Update the DOM after sorting and building HTML
  } catch (error) {
    console.error("Error fetching leaderboard data: ", error);
  }
}
