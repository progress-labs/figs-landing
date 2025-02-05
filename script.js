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

class PurposeTabs {
  constructor(container) {
    this.container = container;
    this.tabButtons = [...container.querySelectorAll('.purpose__tab-button')];
    this.tabContents = [...container.querySelectorAll('.purpose__tab-content')];
    this.currentTab = 0;
    this.carousels = new Map();
    this.setupCarousels();
  }

  setupCarousels() {
    this.tabContents.forEach(content => {
      const carouselContainer = content.querySelector('[data-js="PurposeCarousel"]');
      if (carouselContainer) {
        const carousel = new PurposeCarousel(carouselContainer);
        carousel.init();
        this.carousels.set(content, carousel);
      }
    });
  }

  showTab(index) {
    this.tabButtons.forEach(button => {
      button.classList.remove('purpose__tab-button--active');
    });
    this.tabContents.forEach(content => {
      content.classList.remove('purpose__tab-content--active');
    });

    this.tabButtons[index].classList.add('purpose__tab-button--active');
    this.tabContents[index].classList.add('purpose__tab-content--active');
    
    // Reiniciar el carousel de la tab activa
    const activeCarousel = this.carousels.get(this.tabContents[index]);
    if (activeCarousel) {
      activeCarousel.resetCarousel();
    }
  }

  setupTabEvents() {
    this.tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.currentTab = index;
        this.showTab(this.currentTab);
      });
    });
  }

  init() {
    this.showTab(this.currentTab);
    this.setupTabEvents();
  }
}

class PurposeCarousel {
  constructor(container) {
    this.container = container;
    this.wrapper = container.querySelector('.purpose__cards-wrapper');
    this.cards = [...container.querySelectorAll('.purpose__card')];
    this.leftArrow = container.querySelector('.purpose__nav-arrow--left');
    this.rightArrow = container.querySelector('.purpose__nav-arrow--right');
    this.cardWidth = 290 + 16;
    this.setupCardEvents();
  }

  moveCarousel(direction) {
    if (direction === 'right') {
      this.wrapper.scrollBy({ left: this.cardWidth, behavior: 'smooth' });
    } else {
      this.wrapper.scrollBy({ left: -this.cardWidth, behavior: 'smooth' });
    }
  }

  setupNavigationEvents() {
    this.leftArrow.addEventListener('click', () => this.moveCarousel('left'));
    this.rightArrow.addEventListener('click', () => this.moveCarousel('right'));

    // Enable touch scroll
    this.wrapper.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const isStart = this.wrapper.scrollLeft === 0;
        const isEnd = this.wrapper.scrollLeft >= this.wrapper.scrollWidth - this.wrapper.clientWidth;
        
        this.leftArrow.style.opacity = isStart ? '0.5' : '1';
        this.rightArrow.style.opacity = isEnd ? '0.5' : '1';
      });
    });
  }

  setupCardEvents() {
    this.cards.forEach(card => {
      card.addEventListener('click', () => {
        const wasActive = card.classList.contains('active');
        
        this.cards.forEach(c => c.classList.remove('active'));
        
        if (!wasActive) {
          card.classList.add('active');
        }
      });
    });
  }

  resetCarousel() {
    if (this.wrapper) {
      this.wrapper.scrollLeft = 0;
    }
    
    this.cards.forEach(card => {
      card.classList.remove('active');
    });
  }

  init() {
    this.setupNavigationEvents();
  }
}

class MapAnimation {
  constructor() {
    this.container = document.querySelector('.purpose__numbers-map-container');
    this.hasPlayed = false;
    this.setupObserver();
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasPlayed) {
          this.container.classList.add('start-animation');
          this.hasPlayed = true;
        }
      });
    }, {
      threshold: 0.5
    });

    if (this.container) {
      this.observer.observe(this.container);
    }
  }
}

class NumberSpinner {
  constructor() {
    this.numberElement = document.querySelector('.purpose__numbers-stat:first-child .purpose__numbers-value');
    this.startValue = 290000;
    this.endValue = 325000;
    this.increment = 1000;
    this.duration = 2000; // 2 segundos para la animación
    this.hasPlayed = false;
    this.setupObserver();
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasPlayed) {
          this.animate();
          this.hasPlayed = true;
        }
      });
    }, {
      threshold: 0.5
    });

    if (this.numberElement) {
      this.observer.observe(this.numberElement);
    }
  }

  animate() {
    let current = this.startValue;
    const steps = (this.endValue - this.startValue) / this.increment;
    const stepDuration = this.duration / steps;

    const counter = setInterval(() => {
      current += this.increment;
      
      if (current <= this.endValue) {
        this.numberElement.textContent = current.toString();
      } else {
        this.numberElement.textContent = this.endValue.toString();
        clearInterval(counter);
      }
    }, stepDuration);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const carousels = [...document.querySelectorAll('[data-js="PillarsCarousel"]')];
  carousels.forEach(container => {
    const carousel = new PillarsCarousel(container);
    carousel.init();
  });

  const purposeTabs = [...document.querySelectorAll('.purpose__tabs')];
  purposeTabs.forEach(container => {
    const tabs = new PurposeTabs(container);
    tabs.init();
  });

  new MapAnimation();
  
  new NumberSpinner();
});
