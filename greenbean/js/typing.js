export function registerDBLoaded() {
  document
    .getElementById("animated-text")
    .addEventListener("db_loaded", function () {
      const textElement = document.getElementById("animated-text");
      const text = textElement.textContent;
      textElement.textContent = "";

      let index = 0;
      function type() {
        if (index < text.length) {
          textElement.textContent += text.charAt(index);
          index++;
          setTimeout(type, 1); // Adjust typing speed here
        } else {
          textElement.style.borderRight = "none"; // Remove the caret after typing is complete
        }
      }

      type();
      console.log("triggeres");
    });

  document
    .getElementById("hide-controls")
    .addEventListener("db_loaded", function () {
      console.log("triggeres");
      document.getElementById("hide-controls").style.display = "block";
    });

  // Text rotation for the h2 element
  document
    .getElementById("changing-text")
    .addEventListener("db_loaded", function () {
      
      const changingTextElement = document.getElementById("changing-text");
      const texts = [
        "Switzerland for a week",
        "Canada for 17 hours",
        "the entire US for 2 hours",
      ];
      let textIndex = 0;

      function changeText() {
        console.log("Changed")
        changingTextElement.style.opacity = 0; // Start fade out
        setTimeout(() => {
          changingTextElement.textContent = texts[textIndex];
          changingTextElement.style.opacity = 1; // Fade in new text
          textIndex = (textIndex + 1) % texts.length;
        }, 1000); // Match this duration with the CSS transition duration
      }
      setInterval(changeText, 4000); // Change text every 4 seconds to account for fade duration
    });
}

export function dispatchDBLoaded() {
  document
    .getElementById("animated-text")
    .dispatchEvent(new Event("db_loaded"));
  document
    .getElementById("hide-controls")
    .dispatchEvent(new Event("db_loaded"));
  document
    .getElementById("changing-text")
    .dispatchEvent(new Event("db_loaded"));
}
