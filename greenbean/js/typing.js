document.addEventListener('DOMContentLoaded', function () {
    const textElement = document.getElementById('animated-text');
    const text = textElement.textContent;
    textElement.textContent = '';
  
    let index = 0;
    function type() {
      if (index < text.length) {
        textElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, 1); // Adjust typing speed here
      } else {
        textElement.style.borderRight = 'none'; // Remove the caret after typing is complete
      }
    }
  
    type();
  });