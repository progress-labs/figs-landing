class PillarsCarousel {
  constructor(container) {
    this.container = container;
    this.cards = [...container.querySelectorAll('.pillar-card')];
    this.leftArrow = container.querySelector('.left-arrow');
    this.rightArrow = container.querySelector('.right-arrow');
    this.currentIndex = 0;
  }

  showCard(index) {
    this.cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  }

  setupNavigationEvents() {
    this.leftArrow.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.cards.length - 1;
      this.showCard(this.currentIndex);
    });

    this.rightArrow.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex < this.cards.length - 1) ? this.currentIndex + 1 : 0;
      this.showCard(this.currentIndex);
    });
  }

  init() {
    this.showCard(this.currentIndex);
    this.setupNavigationEvents();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const carousels = [...document.querySelectorAll('[data-js="PillarsCarousel"]')];
  carousels.forEach(container => {
    const carousel = new PillarsCarousel(container);
    carousel.init();
  });
});
