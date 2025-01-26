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
  
    // Check if the user is authenticated first
    const isAuthenticated = await auth0client.isAuthenticated();
    console.log(isAuthenticated);
  
    // If the user is authenticated, show normal content
    if (isAuthenticated) {
      console.log("authenticated");
    } else {
      // If not authenticated, check if the page was redirected after login
      const isRedirected = window.location.search.includes('code=') && window.location.search.includes('state=');
      
      if (!isRedirected) {
        await auth0client.loginWithRedirect({
          authorizationParams: {
            redirect_uri: window.location.origin,
          },
        });
      }
    }
  };
  

const login = async () => {
  console.log(window.location.origin);
  

  // save token for use
  let token = await auth0Client.getTokenSilently();
};

const logout = () => {
  auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
};
