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
}

export function dispatchDBLoaded() {
  document.getElementById("animated-text").dispatchEvent(new Event("db_loaded"));
  document.getElementById("hide-controls").dispatchEvent(new Event("db_loaded"));
}