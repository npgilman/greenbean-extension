import { getDocs, collection, query, where, doc, setDoc, documentId, getDoc } from "firebase/firestore";
import { db } from './firebaseConfig.js';
import {renderSmallChart} from '../chart-util.js';  

export async function getUserData(userId) {
  try {
    const q = query(collection(db, 'users'), where(documentId(), "==", userId));
    return await getDocs(q);
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
}

function generateRandomMap() {
  const map = {};
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    map[dateString] = Math.floor(Math.random() * 20) + 1;
  }
  return map;
}

function sumMapValues(map) {
  return Object.values(map).reduce((sum, value) => sum + value, 0);
}
function seedDB() {
  const users = ["mark", "john", "jane", "alice", "bob"];
  for (let i = 0; i < users.length; i++) {
    const queryDates = generateRandomMap();
    const queryCounter = sumMapValues(queryDates);
    enrollUser(i, `${users[i]}@gmail.com`, users[i], queryDates, queryCounter);
  }
}



// export async function enrollUser(userId, email, name, queryDates, queryCounter) {
//   await setDoc(doc(db, "users", email), {
//     userName: name,
//     dateJoined: new Date(),
//     queryDates: queryDates,
//     queryCounter:  queryCounter,
//   });
// }
export async function enrollUser(userId, email, name) {
  await setDoc(doc(db, "users", email), {
    userName: name,
    dateJoined: new Date().toISOString.split('T')[0],
    queryDates: { [new Date().toLocaleDateString('en-GB')]: 0 },
    queryCounter: 0,
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
      leaderboardData.push({ userName, queryCounter, userId: doc.id });
    });

    // Sort the leaderboardData array by queryCounter in descending order
    leaderboardData.sort((a, b) => b.queryCounter - a.queryCounter); // Sort in descending order

    // Build the leaderboard HTML
    let leaderboardHTML = '';
    leaderboardData.forEach((user) => {
      leaderboardHTML += `
        <li class="leaderboard-item" data-user-id="${user.userId}">
          <div class="user-info">
            <span class="username">${user.userName}</span>
            <span class="query-counter">Queries: ${user.queryCounter}</span>
          </div>
          <canvas id="chart-${user.userId}" class="small-chart" style="display:none;"></canvas>
        </li>
      `;
    });

    leaderboardRoot.innerHTML = leaderboardHTML; // Update the DOM after sorting and building HTML

    // Add click event listener for each leaderboard item
    document.querySelectorAll('.leaderboard-item').forEach(item => {
      item.addEventListener('click', async (event) => {
        const userId = item.getAttribute('data-user-id');
        const chartContainer = document.getElementById(`chart-${userId}`);

        // Toggle visibility of the chart (show the chart if hidden, hide if already visible)
        if (chartContainer.style.display === 'none') {
          chartContainer.style.display = 'block';
          await renderSmallChart(userId, chartContainer);
        } else {
          chartContainer.style.display = 'none';
        }
      });
    });
  } catch (error) {
    console.error("Error fetching leaderboard data: ", error);
  }
}


export async function getUserQueryData(userId) {

  const userRef = doc(db, 'users', userId); // Reference to the user document

  // Get the current date and subtract 30 days to calculate the start date
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);

  // Format the date as 'YYYY-MM-DD'
  const formatDate = (date) => date.toISOString().split('T')[0];

  try {
    // Fetch the user document
    const docSnapshot = await getDoc(userRef);
    
    if (!docSnapshot.exists()) {
      console.error("User document does not exist.");
      return null;
    }

    const userData = docSnapshot.data();
    const queryMap = userData.queryDates || {}; // Assume queries is the field storing the date-query map
    console.log(queryMap)
    // Initialize the result array with 30 elements, filled with 0s
    const result = [];

    // Loop through the last 30 days and fetch the query data
    for (let i = 1; i <= 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + i); // Increment the date by i days
      const formattedDate = formatDate(date);

      // Use the map to find the query count for that date, defaulting to 0 if not present
      result.push(queryMap[formattedDate] || 0);
    }
    console.log("result", result);
    return result;

  } catch (error) {
    console.error("Error fetching user query data:", error);
    return null;
  }
}