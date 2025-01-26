import { getDataFromFirestore } from "./firebase/firebaseUtils.js";
import { createAuth0Client } from "@auth0/auth0-spa-js";

// add listeners
const button = document.getElementById("order");

// other stuff
let auth0client = null;

const fetchAuthConfig = () => fetch("/auth_config.json");
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();
  console.log("here");
  auth0client = await createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
  });
};

window.onload = async () => {
  await configureClient();
    console.log("loaded window");
  updateUI();
};

const updateUI = async () => {
  const isAuthenticated = await auth0client.isAuthenticated();
  console.log(isAuthenticated);

  document.getElementById("order").disabled = isAuthenticated;
};
const login = async () => {
    console.log(window.location.origin);
    await auth0client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    });

    // save token for use
    let token = await auth0Client.getTokenSilently();

  };
  
const logout = () => {
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

button.addEventListener("click", () => {
    login();
  });
  


