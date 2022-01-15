import {getCurrentScrollbarWidth} from '../utils.js';

const burgerBtn = document.querySelector('.burger-btn');
const menu = document.querySelector('.menu');
const header = document.querySelector('.header');
let isOpen = false;
const activeClassName = '_active';
const lockClassName = '_lock';

if (!burgerBtn || !menu || !header) {
  console.warn('menuBurger');
  // return;
}

document.body.addEventListener('click', clickHandler);

function clickHandler(e) {
  const target = e.target;

  if (target.closest('.burger-btn')) {
    toggleMenu();
  }
}

export function openMenu() {
  try {
    isOpen = true;
    burgerBtn.classList.add(activeClassName);
    menu.classList.add(activeClassName);
    header.classList.add(activeClassName);
    compensateScrollbarWidth();
    lockBody();
  } catch (e) {
    console.warn(e);
  }
}

export function closeMenu() {
  try {
    isOpen = false;
    burgerBtn.classList.remove(activeClassName);
    menu.classList.remove(activeClassName);
    header.classList.remove(activeClassName);
    compensateScrollbarWidth(0);
    unlockBody();
  } catch (e) {
    console.warn(e);
  }
}

export function toggleMenu() {
  isOpen ? closeMenu() : openMenu();
}

export function isMenuOpen() {
  return isOpen;
}

function compensateScrollbarWidth(width) {
  const scrollbarWidth = width ?? getCurrentScrollbarWidth();
  const containers = document.querySelectorAll('.container');

  if (containers.length) {
    containers.forEach(container => container.style.marginRight = scrollbarWidth + 'px');
  }
}

function lockBody() {
  document.body.classList.add(lockClassName);
}

function unlockBody() {
  document.body.classList.remove(lockClassName);
}


// import {checkClass, toggleClassInElements, getCurrentScrollbarWidth, isMobile} from '../utils.js';
//
// const isRequired = () => {
//   throw new Error('Param is required');
// }; //
//
//
// class BurgerBtn {
//   #btnSelector = null;
//   #btnEl = null;
//   #className = null;
//   #isActive = false;
//
//   constructor(btnSelector, {activeClassName = '_active', isActive = false}) {
//     this.#btnSelector = btnSelector;
//     this.#btnEl = document.querySelector(btnSelector);
//     this.#className = activeClassName;
//     this.#isActive = isActive;
//   }
//
//   get isActive() {
//     return this.#isActive;
//   }
//
//   activate() {
//     this.#btnEl.classList.add(this.#className);
//     this.#isActive = true;
//   }
//
//   deactivate() {
//     this.#isActive = false;
//     this.#btnEl.classList.remove(this.#className);
//   }
//
//   toggle() {
//     this.#isActive ? this.deactivate() : this.activate();
//   }
// }
//
// class MyMenu {
//   constructor({btnSelector, menuSelector, headerSelector}) {
//     this.#burgerBtnSelector = btnSelector;
//     this.#burgerBtn = document.querySelector(btnSelector);
//     this.#menu = document.querySelector(menuSelector);
//     this.#header = document.querySelector(headerSelector);
//     this.#isMenuOpen = false;
//     this.#isBodyLock = false;
//   }
//
//   get isOpen() {
//     return this.#isOpen;
//   }
//
//   init() {
//     this.#burgerBtn.addEventListener('click', this.#clickBtnHandler);
//   }
//
//   destroy() {
//     this.#burgerBtn.removeEventListener('click', this.#clickBtnHandler);
//   }
//
//   #clickBtnHandler(e) {
//     const target = e.target;
//
//     if (target.closest(this.#burgerBtnSelector)) {
//       if (this.isOpen) this.close();
//       else this.open();
//     }
//   }
//
//   open() {
//     this.#isOpen = true;
//   }
//
//   close() {
//     this.#isOpen = false;
//   }
//
//   toggle() {
//     this.#isOpen ? close() : open();
//   }
// }