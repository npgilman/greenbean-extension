document.addEventListener('DOMContentLoaded', function () {
  // Typing animation for the h1 element
  const textElement = document.getElementById('animated-text');
  const text = textElement.textContent;
  textElement.textContent = '';

  let index = 0;
  function type() {
    if (index < text.length) {
      textElement.textContent += text.charAt(index);
      index++;
      setTimeout(type, 100); // Adjust typing speed here
    } else {
      textElement.style.borderRight = 'none'; // Remove the caret after typing is complete
    }
  }

  type();

  // Text rotation for the h2 element
  const changingTextElement = document.getElementById('changing-text');
  const texts = [
    'Switzerland for a week',
    'Canada for 17 hours',
    'the entire US for 2 hours'
  ];
  let textIndex = 0;

  function changeText() {
    changingTextElement.style.opacity = 0; // Start fade out
    setTimeout(() => {
      changingTextElement.textContent = texts[textIndex];
      changingTextElement.style.opacity = 1; // Fade in new text
      textIndex = (textIndex + 1) % texts.length;
    }, 1000); // Match this duration with the CSS transition duration
  }

  setInterval(changeText, 4000); // Change text every 4 seconds to account for fade duration
});