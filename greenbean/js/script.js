import { getUserData, enrollUser, getLeaderboard } from "./firebase/firebaseUtils.js";
import { createAuth0Client } from "@auth0/auth0-spa-js";
import { dispatchDBLoaded, registerDBLoaded } from "./typing.js";
import renderChart from "./chart-util.js";


// add listeners
registerDBLoaded();
document.getElementById("logout").addEventListener("click", () => {
  auth0client.logout();
  location.reload();
});

// other stuff
let auth0client = null;

const fetchAuthConfig = () => fetch("/auth_config.json");
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0client = await createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
  });
};

window.onload = async () => {
  await configureClient();

  // Check if the user is authenticated
  const isAuthenticated = await auth0client.isAuthenticated();
  console.log(isAuthenticated);

  if (!isAuthenticated) {
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      await auth0client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
    } else {
      await auth0client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin,
        },
      });
    }
  }
  
  const user = await auth0client.getUser();
  const queryShot = await getUserData(user.email);
  if (queryShot.empty) {
    await enrollUser(user.sub, user.email, user.given_name);
  }

  await populateUserData(user.email);
  await getLeaderboard();
  await renderChart(user.email);

};

const populateUserData = async (userId) => {
  console.log(userId);
  const queryShot = await getUserData(userId);
  console.log(queryShot.docs);
  if (queryShot.size !== 1) {
    console.error("userId should be unique. returned results != 1.");
  }
  const userData = queryShot.docs[0].data();
  const mwhUsed = userData.queryCounter * 0.0029;
  console.log(userData);

  document.getElementById("greenbean-username").innerText = userData.userName;
  document.getElementById("greenbean-joindate").innerText = new Date(userData.dateJoined.seconds * 1000).toLocaleDateString();
  document.getElementById("greenbean-mwh").innerText = mwhUsed;
  document.getElementById("total-queries").innerText = userData.queryCounter;
  document.getElementById("total-mwh").innerText = mwhUsed;

  // carousel stats
  document.getElementById("numQueries").innerText = userData.queryCounter;
  document.getElementById("numKwhs").innerText = userData.queryCounter * .0029;
  document.getElementById("numGoogles").innerText = userData.queryCounter * 9;
  document.getElementById("numBottles").innerText = userData.queryCounter * 3;

  dispatchDBLoaded();
}


async function seedDB() {
  const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"];
  for (let i = 0; i < names.length; i++) {
    await enrollUser(`${names[i]}@gmail.com`, names[i]);
  }
  await getLeaderboard();
}

// seedDB();