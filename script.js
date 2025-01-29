document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.pillar-card');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  let currentIndex = 0;

  function showCard(index) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  }

  leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
    showCard(currentIndex);
  });

  rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
    showCard(currentIndex);
  });

  showCard(currentIndex); // Mostrar la primera tarjeta al cargar
});
