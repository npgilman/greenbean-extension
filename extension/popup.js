document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ action: "getQueryCount" }, (response) => {
    document.getElementById("query-count").textContent = response.queryCount;
  });

  // Check if a user is already signed in
  chrome.storage.local.get("userEmail", (data) => {
    if (data.userEmail) {
      // User is signed in
      document.getElementById("signInSection").style.display = "none";
      document.getElementById("signOutSection").style.display = "block";
      document.getElementById("userEmailDisplay").textContent = data.userEmail;
    } else {
      // No user signed in
      document.getElementById("signInSection").style.display = "block";
      document.getElementById("signOutSection").style.display = "none";
    }
  });

  // Sign In button logic
  document.getElementById("signInButton").addEventListener("click", function() {
    const email = document.getElementById("email").value;

    // Simple email validation (Gmail only)
    if (email && email.includes("@")) {
      // Save the email in chrome storage for future use
      chrome.runtime.sendMessage({ action: "signInUser", email: email }, function(response) {
        if (response.success) {
          alert(response.message);
          window.close()
        } else {
          alert(response.message);
        }
      });
    } else {
      alert("Please enter a valid Gmail address.");
    }
  });

  // Sign Out button logic
  document.getElementById("signOutButton").addEventListener("click", function() {
    chrome.runtime.sendMessage({ action: "signOutUser" }, function(response) {
      alert("Signed out successfully.");
      window.close()
    });
  });
});
