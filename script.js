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
        const carousel = new Carousel(carouselContainer);
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

class Carousel {
  constructor(container) {
    this.container = container;
    let prefix = 'purpose';
    if (container.classList.contains('people__cards')) {
      prefix = 'people';
    } else if (container.classList.contains('product__cards')) {
      prefix = 'product';
    }
    
    this.wrapper = container.querySelector(`.${prefix}__cards-wrapper`);
    this.cards = [...container.querySelectorAll(`.${prefix}__card`)];
    this.leftArrow = container.querySelector(`.${prefix}__nav-arrow--left`);
    this.rightArrow = container.querySelector(`.${prefix}__nav-arrow--right`);
    this.cardWidth = 290 + 16;
    this.prefix = prefix;
    
    this.cards.forEach(card => this.updateCardTransform(card));
  }

  updateArrowsVisibility() {
    const totalCardsWidth = this.cards.length * this.cardWidth;
    const availableWidth = this.wrapper.clientWidth;
    
    const isAllContentVisible = availableWidth >= totalCardsWidth;
    
    if (isAllContentVisible) {
      this.leftArrow.style.display = 'none';
      this.rightArrow.style.display = 'none';
      return;
    }
    
    const canScrollLeft = this.wrapper.scrollLeft > 0;
    const canScrollRight = this.wrapper.scrollLeft < (this.wrapper.scrollWidth - this.wrapper.clientWidth);
    
    this.leftArrow.style.display = canScrollLeft ? 'flex' : 'none';
    this.rightArrow.style.display = canScrollRight ? 'flex' : 'none';
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

    this.wrapper.addEventListener('scroll', () => {
      requestAnimationFrame(() => this.updateArrowsVisibility());
    });

    window.addEventListener('resize', () => {
      requestAnimationFrame(() => this.updateArrowsVisibility());
    });
  }

  updateCardTransform(card) {
    const header = card.querySelector(`.${this.prefix}__card-header`);
    const content = card.querySelector(`.${this.prefix}__card-content`);
    if (header && content) {
      const headerHeight = header.offsetHeight;
      let translateY = 56;
      if (headerHeight > 50) {
        translateY = 94;
      } else if (headerHeight > 45) {
        translateY = 70;
      }
      content.style.transform = `translateY(calc(100% - ${translateY}px))`;
      console.log(`Card header height: ${headerHeight}, translateY: ${translateY}`);
    }
  }

  setupCardEvents() {
    this.cards.forEach(card => {
      card.addEventListener('click', () => {
        const wasActive = card.classList.contains('active');
        this.cards.forEach(c => c.classList.remove('active'));
        if (!wasActive) {
          card.classList.add('active');
          const content = card.querySelector(`.${this.prefix}__card-content`);
          if (content) {
            content.style.transform = 'translateY(0)';
          }
        } else {
          this.updateCardTransform(card);
        }
      });
    });
  }

  resetCarousel() {
    if (this.wrapper) {
      this.wrapper.scrollLeft = 0;
      this.updateArrowsVisibility();
    }
    
    this.cards.forEach(card => {
      card.classList.remove('active');
    });
  }

  init() {
    this.setupCardEvents();
    this.setupNavigationEvents();
    this.updateArrowsVisibility();
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
    this.startValue = 100000;
    this.endValue = 325000;
    this.increment = 1000;
    this.duration = 8000;
    this.hasPlayed = false;
    this.setupObserver();
  }

  formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
        this.numberElement.textContent = this.formatNumber(current);
      } else {
        this.numberElement.textContent = this.formatNumber(this.endValue);
        clearInterval(counter);
      }
    }, stepDuration);
  }
}

class StickyNav {
  constructor() {
    this.nav = document.querySelector('.nav-bar');
    this.navTop = this.nav.offsetTop;
    this.ticking = false;
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateNav();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
    
    this.nav.querySelectorAll('.nav-bar__link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  updateNav() {
    const scrollY = window.scrollY;
    
    if (scrollY > this.navTop) {
      this.nav.classList.add('nav-bar--sticky');
    } else {
      this.nav.classList.remove('nav-bar--sticky');
    }
  }
}

class PeopleTabs {
  constructor(container) {
    this.container = container;
    this.tabButtons = [...container.querySelectorAll('.people__tab-button')];
    this.tabContents = [...container.querySelectorAll('.people__tab-content')];
    this.currentTab = 0;
    this.carousels = [...container.querySelectorAll('[data-js="Carousel"]')];
  }

  showTab(index) {
    this.tabButtons.forEach(button => {
      button.classList.remove('people__tab-button--active');
    });
    this.tabContents.forEach(content => {
      content.classList.remove('people__tab-content--active');
    });

    this.tabButtons[index].classList.add('people__tab-button--active');
    this.tabContents[index].classList.add('people__tab-content--active');

    const activeCarousel = this.carousels[index];
    if (activeCarousel) {
      const carousel = activeCarousel.__carousel;
      if (carousel) {
        carousel.cards.forEach(card => carousel.updateCardTransform(card));
      }
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
    this.carousels.forEach(container => {
      const carousel = new Carousel(container);
      container.__carousel = carousel;
      carousel.init();
    });

    this.showTab(this.currentTab);
    this.setupTabEvents();
  }
}

class ParallaxEffect {
  constructor() {
    this.peopleWrapper = document.querySelector('.people-wrapper');
    this.purposeWrapper = document.querySelector('.purpose-wrapper');
    this.productWrapper = document.querySelector('.product-wrapper');
    this.valuesIntroWrapper = document.querySelector('.values-intro-wrapper');
    this.setupParallax();
  }

  setupParallax() {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => this.updateParallax());
    });
  }

  updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.15;
    
    if (this.peopleWrapper && this.purposeWrapper && this.productWrapper && this.valuesIntroWrapper) {
      this.peopleWrapper.style.setProperty('--parallax-offset', `${rate}px`);
      this.purposeWrapper.style.setProperty('--parallax-offset', `${rate}px`);
      this.productWrapper.style.setProperty('--parallax-offset', `${rate}px`);
      this.valuesIntroWrapper.style.setProperty('--parallax-offset', `${rate}px`);
    }
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
  
  const peopleTabs = [...document.querySelectorAll('[data-js="PeopleTabs"]')];
  peopleTabs.forEach(container => {
    const tabs = new PeopleTabs(container);
    tabs.init();
  });

  new ParallaxEffect();

  const standaloneCarousels = [...document.querySelectorAll('[data-js="Carousel"]:not(.people__tab-content [data-js="Carousel"])')];
  standaloneCarousels.forEach(container => {
    const carousel = new Carousel(container);
    carousel.init();
  });

  new StickyNav();
});
