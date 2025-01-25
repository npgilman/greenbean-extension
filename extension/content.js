document.addEventListener("DOMContentLoaded", () => {
  console.log("Content script loaded");  // Check if content script is running
  
  const checkInputDiv = () => {
    const inputDiv = document.querySelector("#prompt-textarea");
    
    if (inputDiv) {
      console.log("Input div found:", inputDiv);  // Log the input div to confirm it's selected
      
      // Check if listener is already attached
      if (!inputDiv.hasAttribute('data-listener-attached')) {
        inputDiv.addEventListener("keydown", (e) => {
          console.log("Key pressed:", e.key);  // Check which key is pressed
          
          // Only act on Enter key press
          if (e.key === "Enter" && !e.shiftKey) {
            const queryText = inputDiv.innerText.trim();
            if (queryText) {
              console.log("Query submitted:", queryText);  // Log the query being submitted
              chrome.runtime.sendMessage({ action: "incrementQueryCount" });
            }
          }
        });

        inputDiv.setAttribute('data-listener-attached', 'true');  // Mark listener as attached
      }
      clearInterval(intervalId);  // Stop the polling once the input div is found
    }
  };

  // Poll for the input div, checking every second
  const intervalId = setInterval(checkInputDiv, 1000);
});
