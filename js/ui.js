import * as consts from './constants.js';

// UI elements
export const calcScreen = document.querySelector("#calcScreen");
calcScreen.value = consts.CALC_SCREEN_DEFAULT;
export const eqn = document.querySelector(".eqn");
export const eqBtn = document.querySelector(".eq");
export const clrBtn = document.querySelector(".clr");
export const delBtn = document.querySelector(".del");
// groups of buttons
export const allBtns = document.querySelectorAll(".btn");
export const digitBtns = document.querySelectorAll(".digit");
export const opBtns = document.querySelectorAll(".op");

// add current year to copyright
let copyrightYear = document.querySelector("#copyright-year");
copyrightYear.textContent = new Date().getFullYear();