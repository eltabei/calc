import * as consts from './constants.js';
import * as ui from './ui.js';
import * as hist from './history.js'

// array of operators
let operators = [];
// array of operands (numbers)
let operands = [];
// last calculator key pressed
let lastKeyDown = null;

// arrays to store previous operation
let lastOperators = [];
let lastOperands = [];

function addEventListeners() {
  // add event listeners to all digit buttons
  for (const btn of ui.digitBtns) {
    btn.addEventListener("click", digitClicked);
  }
  
  // add event listeners to all op buttons
  for (const btn of ui.opBtns) {
    btn.addEventListener("click", operatorClicked);
  }
  
  // add event listeners to rest of buttons
  ui.eqBtn.addEventListener("click", equalClicked);
  ui.clrBtn.addEventListener("click", clearClicked);
  ui.delBtn.addEventListener("click", delClicked);
  ui.eqn.addEventListener('click', hist.viewHistory);
  
  document.addEventListener("keydown", onKeyDown);

  // save history to local storage on exit
  window.addEventListener("beforeunload", hist.saveHistory);
}

function digitClicked(e) {
  // fired when a digit or decimal point is pressed
  // if this is the very first key to be pressed
  // or if an operator was just pressed
  let btn = e.target;
  if (lastKeyDown === null || lastKeyDown === consts.EQUAL || consts.CALC_OPERATORS.includes(lastKeyDown)) {
    if (btn.value === ".") {
      ui.calcScreen.value = "0.";
    } else {
      ui.calcScreen.value = btn.value;
    }
  } else {
    if (!(btn.value === "." && ui.calcScreen.value.includes("."))) {
      ui.calcScreen.value += btn.value;
    }
  }
  lastKeyDown = btn.value;
}

function operatorClicked(e) {
  // fired when an operator key is pressed
  let btn = e.target;
  // if 2 operators pressed in a row, ignore the first one
  if (consts.CALC_OPERATORS.includes(lastKeyDown)) {
    operators = [btn.value];
  } else {
    calcScreenTrimPointZeros();
    operators.push(btn.value);
    operands.push(ui.calcScreen.value);
    if (operators.length === 2) {
      solve();
      operands = [ui.calcScreen.value];
      operators = [btn.value];
    }
  }
  lastKeyDown = btn.value;
  updateEquation(false);
}

function calcScreenTrimPointZeros() {
  // convert x.0 to x
  let v = ui.calcScreen.value;
  if (v == 0) {
    return;
  }
  while (v.endsWith("0") || v.endsWith(".")) {
    v = v.slice(0, -1);
  }
  ui.calcScreen.value = v;
}

function equalClicked() {
  if (lastKeyDown === consts.EQUAL) {
    // console.log(operands, operators);
    // give result of eqn: number on screen, last operation operator,last operation 2nd operand
    operands = [ui.calcScreen.value, lastOperands[lastOperands.length - 1]];
    operators = lastOperators;
  } else {
    calcScreenTrimPointZeros();
    operands.push(ui.calcScreen.value);
  }
  console.log("eqPressed", operands, operators);
  updateEquation();
  solve();
  hist.AddToHistory();

  lastOperands = operands;
  operands = [];
  lastOperators = operators.slice();
  operators.shift();
  lastKeyDown = consts.EQUAL;
  //console.log(operands, operators);
}

function clearClicked() {
  ui.calcScreen.value = consts.CALC_SCREEN_DEFAULT;
  operators = [];
  operands = [];
  lastKeyDown = null;
  updateEquation();
}

function delClicked() {
  if (ui.calcScreen.value === consts.CALC_SCREEN_DEFAULT) {
    return;
  }
  ui.calcScreen.value = ui.calcScreen.value.slice(0, -1);
  if (ui.calcScreen.value === "") {
    ui.calcScreen.value = consts.CALC_SCREEN_DEFAULT;
  }
}

function onKeyDown(e) {
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
      ui.eqBtn.click();
      break;
    case "Backspace":
      ui.delBtn.click();
      break;
    case "Escape":
      // hide historyDlg if shown
      if (hist.dlg.style.display !== "none") {
        hist.closeHistoryDlg();
      } else {
        ui.clrBtn.click();
      }
      break;
    case "h":
    case "H":
      hist.viewHistory();
      break;
    default:
      break;
  }
};

function updateEquation(byEqualKey = true) {
  // updates text representation of the equation, above calculator screen
  if (operands.length === 0) {
    ui.eqn.textContent = "";
    return;
  }

  if (operators.length === 0) {
    ui.eqn.textContent = `${operands[0]} = `;
    return;
  }

  if (operands.length === 1) {
    if (operators.length !== 0) {
      ui.eqn.textContent = `${operands[0]} ${operators[0]}`;
    }
  } else {
    if (byEqualKey) {
      if (operands[1] == 0) {
        // emulate Windows Calculator behavior
        ui.eqn.textContent = `${operands[0]} ${operators[0]} `;
      } else {
        ui.eqn.textContent = `${operands[0]} ${operators[0]} ${operands[1]} = `;
      }
    } else {
      ui.eqn.textContent = `${ui.calcScreen.value} ${operators[operators.length - 1]}`;
    }
  }
  ui.eqn.textContent = ui.eqn.textContent.replace("*", "×").replace("/", "÷");
}

function solve() {
  // solves entered equation (so far)
  let v;
  if (operators.length === 0) {
    ui.calcScreen.value = parseFloat(operands[0]);
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
        ui.calcScreen.value = "Cannot divide by zero";
        return;
      }
      v = parseFloat(operands[0]) / parseFloat(operands[1]);
      break;
    default:
      //alert("Error: unknown operator");
      ui.calcScreen.value = consts.CALC_SCREEN_DEFAULT;
      return;
  }
  //tb.value = v;
  ui.calcScreen.value = fixResult(v);
}

function fixResult(n) {
  return Number(n.toFixed(15));
}

//
// main
//
addEventListeners();
// load history
hist.loadHistory();