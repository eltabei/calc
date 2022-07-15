// TODO
// [x] Typing after getting an operation result should erase screen AND
//     equation instead of appending to it
// [x] Division by zero: emulate Windows Calculator behavior
// [x] Automatically add zero when typing (.1 + .2)
// [x] Prevent multi dots pressing
// [x] Delete .0 when typed into screen or equation or obtained as a result
// [x] Handle floating points mistakes e.g. (.1 + .2)
// [x] Fix bug with x.00000
// [x] Handle single operand then equal
// [x] Add shadow to give 3d-like effect
// [x] Fix bug with repeated equal presses
// [x] write some short info in footer: copyright & link to github profile
// [x] fix bug with division by zero
// [ ] Improve shadow
// [ ] Add history button: shows history in a popup dialog
// [ ] store history in local storage (last 10 operations)


const CALC_SCREEN_DEFAULT = "0";
const HISTORY_LENGTH = 10;
const CALC_OPERATORS = ["+", "-", "*", "/"];
const EQUAL = "=";

const calcScreen = document.querySelector("#calcScreen");
calcScreen.value = CALC_SCREEN_DEFAULT;
const eqn = document.querySelector(".eqn");
const eqBtn = document.querySelector(".eq");
const clrBtn = document.querySelector(".clr");
const delBtn = document.querySelector(".del");

const allBtns = document.querySelectorAll(".btn");
const digitBtns = document.querySelectorAll(".digit");
const opBtns = document.querySelectorAll(".op");

// array of operators
let operators = [];
// array of operands (numbers)
let operands = [];
// last calculator key pressed
let lastKeyDown = null;

// arrays to store previous operation
let lastOperators = [];
let lastOperands = [];

let history = [];

// add event listeners to all digit buttons
for (const btn of digitBtns) {
  btn.addEventListener("click", digitClicked);
}
// add event listeners to all op buttons
for (const btn of opBtns) {
  btn.addEventListener("click", operatorClicked);
}
// add event listeners to rest of buttons
eqBtn.addEventListener("click", equalClicked);
clrBtn.addEventListener("click", clearClicked);
delBtn.addEventListener("click", delClicked);
eqn.addEventListener('click', viewHistory);

// add current year to copyright
let copyrightYear = document.querySelector("#copyright-year");
copyrightYear.innerHTML = new Date().getFullYear();

// load history from local storage
if (localStorage.getItem("history")) {
  history = JSON.parse(localStorage.getItem("history"));
}

// prepare history dialog
let historyDlg = document.querySelector(".historyDlg");
let historyList = document.querySelector(".historyList");
let historyCloseBtn = document.querySelector(".close");
historyCloseBtn.addEventListener("click", closeHistoryDlg);

function closeHistoryDlg() {
  historyDlg.style.display = "none"
}

function digitClicked(e) {
  // fired when a digit or decimal point is pressed
  // if this is the very first key to be pressed
  // or if an operator was just pressed
  let btn = e.target;
  if (
    lastKeyDown === null ||
    lastKeyDown === EQUAL ||
    CALC_OPERATORS.includes(lastKeyDown)
  ) {
    if (btn.value === ".") {
      calcScreen.value = "0.";
    } else {
      calcScreen.value = btn.value;
    }
  } else {
    if (!(btn.value === "." && calcScreen.value.includes("."))) {
      calcScreen.value += btn.value;
    }
  }
  lastKeyDown = btn.value;
}

function operatorClicked(e) {
  // fired when an operator key is pressed
  let btn = e.target;
  // if 2 operators pressed in a row, ignore the first one
  if (CALC_OPERATORS.includes(lastKeyDown)) {
    operators = [btn.value];
  } else {
    calcScreenTrimPointZeros();
    operators.push(btn.value);
    operands.push(calcScreen.value);
    if (operators.length === 2) {
      solve();
      operands = [calcScreen.value];
      operators = [btn.value];
    }
  }
  lastKeyDown = btn.value;
  updateEquation(false);
}

function calcScreenTrimPointZeros() {
  // convert x.0 to x
  let v = calcScreen.value;
  if (v == 0) {
    return;
  }
  while (v.endsWith("0") || v.endsWith(".")) {
    v = v.slice(0, -1);
  }
  calcScreen.value = v;
}

function fixResult(n) {
  return Number(n.toFixed(15));
}

function equalClicked() {
  if (lastKeyDown === EQUAL) {
    // console.log(operands, operators);
    // give result of eqn: number on screen, last operation operator,last operation 2nd operand
    operands = [calcScreen.value, lastOperands[lastOperands.length - 1]];
    operators = lastOperators;
  } else {
    calcScreenTrimPointZeros();
    operands.push(calcScreen.value);
  }
  console.log("eqPressed", operands, operators);
  updateEquation();
  solve();
  AddToHistory();

  lastOperands = operands;
  operands = [];
  lastOperators = operators.slice();
  operators.shift();
  lastKeyDown = EQUAL;
  //console.log(operands, operators);
}

function solve() {
  // solves entered equation (so far)
  let v;
  if (operators.length === 0) {
    calcScreen.value = parseFloat(operands[0]);
    return;
  }
  switch (operators[0]) {
    case "+":
      v = parseFloat(operands[0]) + parseFloat(operands[1]);
      break;
    case "-":
      v = parseFloat(operands[0]) - parseFloat(operands[1]);
      break;
    case "*":
      v = parseFloat(operands[0]) * parseFloat(operands[1]);
      break;
    case "/":
      if (parseFloat(operands[1]) === 0) {
        // emulate Windows Calculator behavior
        calcScreen.value = "Cannot divide by zero";
        return;
      }
      v = parseFloat(operands[0]) / parseFloat(operands[1]);
      break;
    default:
      //alert("Error: unknown operator");
      calcScreen.value = CALC_SCREEN_DEFAULT;
      return;
  }
  //tb.value = v;
  calcScreen.value = fixResult(v);
}

function updateEquation(byEqualKey = true) {
  // updates text representation of the equation, above calculator screen
  if (operands.length === 0) {
    eqn.textContent = "";
    return;
  }

  if (operators.length === 0) {
    eqn.textContent = `${operands[0]} = `;
    return;
  }

  if (operands.length === 1) {
    if (operators.length === 0) {
    } else {
      eqn.textContent = `${operands[0]} ${operators[0]}`;
    }
  } else {
    if (byEqualKey) {
      if (operands[1] == 0) {
        // emulate Windows Calculator behavior
        eqn.textContent = `${operands[0]} ${operators[0]} `;
      } else {
        eqn.textContent = `${operands[0]} ${operators[0]} ${operands[1]} = `;
      }
    } else {
      eqn.textContent = `${calcScreen.value} ${operators[operators.length - 1]}`;
    }
  }
  eqn.textContent = eqn.textContent.replace("*", "×").replace("/", "÷");
}

function clearClicked() {
  calcScreen.value = CALC_SCREEN_DEFAULT;
  operators = [];
  operands = [];
  lastKeyDown = null;
  updateEquation();
}

function delClicked() {
  if (calcScreen.value === CALC_SCREEN_DEFAULT) {
    return;
  }
  calcScreen.value = calcScreen.value.slice(0, -1);
  if (calcScreen.value === "") {
    calcScreen.value = CALC_SCREEN_DEFAULT;
  }
}

function AddToHistory() {
  // Only keey last x items
  if (history.length === HISTORY_LENGTH) {
    history.pop();
  }
  // Newer comes first
  history.unshift(`${eqn.textContent} ${calcScreen.value}`);
  //history.unshift(`${operands[0]} ${operators[0]} ${operands[1]} = ${calcScreen.value}`);
}

function viewHistory() {
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
  historyDlg.style.display = "block";
}

document.onkeydown = function(e) {
  const btn = document.querySelector(
    "div.btnsContainer > button[value='" + e.key + "']"
  );
  //console.log("Keydown: " + e.key);
  switch (e.key) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case ".":
      btn.click();
      break;
    case "+":
    case "-":
    case "*":
    case "/":
      btn.click();
      break;
    case "Enter":
    case "=":
      eqBtn.click();
      break;
    case "Backspace":
      delBtn.click();
      break;
    case "Escape":
      // hide historyDlg if shown
      if (historyDlg.style.display !== "none") {
        closeHistoryDlg();
      } else {
        clrBtn.click();
      }
      break;
    case "h":
    case "H":
      viewHistory();
      break;
    default:
      break;
  }
};

// save history to local storage on exit
window.onbeforeunload = function() {
  localStorage.setItem("history", JSON.stringify(history));
}

