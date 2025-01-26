// const carousel = document.querySelector('.carousel');
// const items = carousel.querySelectorAll('.carousel-item');
// let currentIndex = 0;

// function nextSlide() {
//   currentIndex = (currentIndex + 1) % items.length;
//   carousel.style.transform = `translateX(-${currentIndex * 100}%)`; 
// }

// setInterval(nextSlide, 5000); // Change slide every 5 seconds

const splitCardCarousels = document.querySelectorAll('#split-card-section .carousel');
splitCardCarousels.forEach((splitCardCarousel) => {
  const splitCardItems = splitCardCarousel.querySelectorAll('.carousel-item');
  let splitCardCurrentIndex = 0;

  function nextSplitCardSlide() {
    splitCardCurrentIndex = (splitCardCurrentIndex + 1) % splitCardItems.length;
    splitCardCarousel.style.transform = `translateX(-${splitCardCurrentIndex * 100}%)`;
  }

  setInterval(nextSplitCardSlide, 5000);
});

// const carousel = document.querySelector('.carousel');
// const items = carousel.querySelectorAll('.carousel-item');
// let currentIndex = 0;

// function nextSlide() {
//   const itemWidth = items[0].offsetWidth; // Get the fixed width of an item
//   currentIndex = (currentIndex + 1) % items.length;
//   carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`; 
// }

// setInterval(nextSlide, 5000); // Change slide every 5 seconds
