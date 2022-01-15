import Swiper, {EffectCards} from 'swiper';
import {getCurrentScrollbarWidth, isWebp} from './utils.js';
import * as burger from './components/burger.js';
import {DynamicAdapt} from './components/DynamicAdapt.js';
import {compensateScrollbarWidth} from './components/burger.js';

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', documentClickHandler);

  isWebp();

  select();
  video();
  card();
  slider();
  resizeObserver();
  intersectionObserver();
  headerResize();

  const da = new DynamicAdapt('max');
  da.init();
});

// Наблюдение за изменением высоты хедера
function headerResize() {
  const header = document.querySelector('.header');

  const outputSize = () => {
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  };
  outputSize();

  const resizeObserver = new ResizeObserver(outputSize);
  resizeObserver.observe(header);
}

// Наблюдение за скроллом хедера
function intersectionObserver() {
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.header');

  const headerObserver = new IntersectionObserver((entries, observer) => {
    if (!header) return;

    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        header.classList.add('_scrolled');
      } else {
        header.classList.remove('_scrolled');
      }
    });
  }, {rootMargin: '-50px 0px 0px 0px'});
  headerObserver.observe(hero);
}

function documentClickHandler(e) {
}

function resizeObserver() {
  const header = document.querySelector('.header');

  if (!header) {
    console.warn('resizeObserver');
    return;
  }

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      if (entry.target === document.documentElement) {
        // const width = entry.contentBoxSize ? entry.contentBoxSize[0].inlineSize : entry.contentRect.width;
        const width = window.innerWidth;

        const logoEl = document.querySelector('.logo__img');
        const headerActionsEl = document.querySelector('.header__actions');

        const condition = width < 992 && width >= 768;

        logoEl && (logoEl.src = condition ? './img/logo.svg' : './img/logo-full.svg');
        headerActionsEl && (headerActionsEl.style.columnGap = condition ? '10px' : '20px');

        if (width >= 768 && burger.isMenuOpen()) {
          burger.closeMenu();
        }
      }
    }
  });

  resizeObserver.observe(document.documentElement);
}

function slider() {
  Swiper.use([EffectCards]);
  const appsSlider = new Swiper('.apps__slider', {
    // slidesPerView: 1.2,
    // spaceBetween: 0,
    // centeredSlides: true,
    // grabCursor: true,
    slideToClickedSlide: true,
    effect: 'cards',
    cardsEffect: {
      slideShadows: false,
      // prev: {
      //   scale: 0.5,
      // },
      // next: {
      //   scale: 0.5,
      // },
    },
  });
}

function card() {
  const cardTitles = document.querySelectorAll('.card__title');

  if (!cardTitles.length) {
    console.warn('card');
    return;
  }

  const marginBottom = getMarginBottom(cardTitles[0]);

  const ro = new ResizeObserver(entries => {
    resize(cardTitles);
  });

  cardTitles.forEach(item => ro.observe(item));

  function getMarginBottom(el) {
    return parseInt((el.currentStyle || window.getComputedStyle(el)).marginBottom);
  }

  function resize(cardTitles) {
    const maxHeight = Math.max(...Array.from(cardTitles).map(item => item.offsetHeight));
    cardTitles.forEach(item => item.style.marginBottom = maxHeight - item.offsetHeight + marginBottom + 'px');
  }
}

function video() {
  const video = document.querySelector('.media-box__video');
  const playBtn = document.querySelector('.media-box__play-btn');

  if (!video || !playBtn) {
    console.warn('video');
    return;
  }

  playBtn.addEventListener('click', clickHandler);
  video.addEventListener('play', playHandler);
  video.addEventListener('pause', pauseHandler);

  function clickHandler(e) {
    playBtn.classList.add('_hide');
    video.play();
  }

  function playHandler(e) {
    playBtn.classList.add('_hide');
  }

  function pauseHandler(e) {
    playBtn.classList.remove('_hide');
  }
}

function select() {
  const selectElements = document.querySelectorAll('.select');

  if (!selectElements.length) {
    console.warn('select');
    return;
  }

  selectElements.forEach(el => selectItem(el));

  function selectItem(el) {
    const currentEl = el.querySelector('.select__current');
    let newItem = el.querySelector('[aria-selected]');
    chooseItem(currentEl, newItem);

    el.addEventListener('click', clickHandler);
    el.addEventListener('focus', focusHandler);

    function chooseItem(currEl, newItem, prevItem = null) {
      if (prevItem === newItem) return;
      if (prevItem) {
        newItem.setAttribute('aria-selected', '');
        prevItem.removeAttribute('aria-selected');
      }
      currEl.textContent = newItem.textContent;
      currEl.dataset.lang = newItem.dataset.lang;
    }

    function clickHandler(e) {
      if (e.target.closest('.select__header')) {
        el.classList.toggle('_open');
        return;
      }
      const prevItem = el.querySelector('[aria-selected]');
      newItem = e.target.closest('.select__item');
      if (newItem) {
        chooseItem(currentEl, newItem, prevItem);
        el.classList.remove('_open');
      }
    }

    function focusHandler(e) {
      el.addEventListener('keydown', keyDownHandler);
      el.addEventListener('blur', blurHandler);

      function keyDownHandler(e) {
        let nextItem = null;

        if (e.code === 'ArrowDown') {
          e.preventDefault();
          nextItem = newItem.nextElementSibling;
        }
        if (e.code === 'ArrowUp') {
          e.preventDefault();
          nextItem = newItem.previousElementSibling;
        }
        if (nextItem) {
          chooseItem(currentEl, nextItem, newItem);
          newItem = nextItem;
        }
        if (e.code === 'Enter') {
          el.classList.toggle('_open');
        }
      }

      function blurHandler(e) {
        el.removeEventListener('keydown', keyDownHandler);
        el.removeEventListener('blur', blurHandler);
        el.classList.remove('_open');
      }
    }
  }
}