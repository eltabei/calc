import * as ui from './ui.js';

const HISTORY_LENGTH = 10;
const historyList = document.querySelector(".historyList");
let history = [];

// prepare history dialog
export const dlg = document.querySelector(".historyDlg");
const historyCloseBtn = document.querySelector(".close");
historyCloseBtn.addEventListener("click", closeHistoryDlg);

export function closeHistoryDlg() {
  dlg.style.display = "none"
}

export function AddToHistory() {
  // Only keey last x items
  if (history.length === HISTORY_LENGTH) {
    history.pop();
  }
  // Newer comes first
  history.unshift(`${ui.eqn.textContent} ${ui.calcScreen.value}`);
}

export function viewHistory() {
  // remove all children of historyList
  while (historyList.firstChild) {
    historyList.removeChild(historyList.firstChild);
  }
  // re-add all items to historyList
  for (let entry of history) {
    let li = document.createElement('li');
    li.textContent = entry;
    historyList.appendChild(li);
  }
  dlg.style.display = "block";
}

export function saveHistory() {
  localStorage.setItem("history", JSON.stringify(history));
}

export function loadHistory() {
  // load history from local storage
  if (localStorage.getItem("history")) {
    history = JSON.parse(localStorage.getItem("history"));
  }
}