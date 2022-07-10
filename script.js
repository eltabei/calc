// TODO

const CalcScreenDefault = "0";
const CalcOperators = ["+", "-", "*", "/"];
const Equal = "=";
const tb = document.getElementById("calcScreen");
tb.value = CalcScreenDefault;
const eqn = document.getElementsByClassName("eqn")[0];
const allBtns = document.getElementsByClassName("btn");
const digitBtns = document.getElementsByClassName("digit");
const opBtns = document.getElementsByClassName("op");
// const eqBtn = document.querySelector("div.btnsContainer > button[value='=']");
const eqBtn = document.getElementsByClassName("eq")[0];
const clrBtn = document.getElementsByClassName("clr")[0];
const delBtn = document.getElementsByClassName("del")[0];

// array of operators
let operators = [];
// last calculator key pressed
let lastKeyDown = null;
// array of operands (numbers)
let operands = [];

// arrays to store previous operation
let prevOperators = [];
let prevOprands = [];

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

function digitClicked(e) {
  // fired when a digit or decimal point is pressed
  // if this is the very first key to be pressed
  // or if an operator was just pressed
  let btn = e.target;
  if (lastKeyDown === null || CalcOperators.includes(lastKeyDown)) {
    tb.value = btn.value;
  } else {
    tb.value += btn.value;
  }
  lastKeyDown = btn.value;
}

function operatorClicked(e) {
  // fired when an operator key is pressed
  let btn = e.target;
  // if 2 operators pressed in a row, ignore the first one
  if (CalcOperators.includes(lastKeyDown)) {
    operators = [btn.value];
  } else {
    operators.push(btn.value);
    operands.push(tb.value);
    if (operators.length === 2) {
      solve();
      operands = [tb.value];
      operators = [btn.value];
    }
  }
  lastKeyDown = btn.value;
  updateEquation(false);
}

function equalClicked() {
  if (lastKeyDown === Equal) {
    // console.log(operands, operators);
    // give result of eqn: number on screen, last operation operator,last operation 2nd operand
    operands = [tb.value, lastOperands[lastOperands.length - 1]];
    operators = lastOperators;
  } else {
    operands.push(tb.value);
  }
  console.log("eqPressed", operands, operators);
  updateEquation();
  solve();
  lastOperands = operands;
  operands = [];
  lastOperators = operators.slice();
  operators.shift();
  lastKeyDown = Equal;
  //console.log(operands, operators);
}

function solve() {
  // solves entered equation (so far)
  switch (operators[0]) {
    case "+":
      tb.value = parseFloat(operands[0]) + parseFloat(operands[1]);
      break;
    case "-":
      tb.value = parseFloat(operands[0]) - parseFloat(operands[1]);
      break;
    case "*":
      tb.value = parseFloat(operands[0]) * parseFloat(operands[1]);
      break;
    case "/":
      tb.value = parseFloat(operands[0]) / parseFloat(operands[1]);
      break;
    default:
      //alert("Error: unknown operator");
      tb.value = CalcScreenDefault;
  }
}

function updateEquation(byEqualKey = true) {
  // updates text representation of the equation, above calculator screen
  if (operands.length === 0) {
    eqn.textContent = "";
    return;
  } else if (operands.length === 1) {
    eqn.textContent = `${operands[0]} ${operators[0]}`;
  } else {
    if (byEqualKey) {
      eqn.textContent = `${operands[0]} ${operators[0]} ${operands[1]} = `;
    } else {
      eqn.textContent = `${tb.value} ${operators[operators.length - 1]}`;
    }
  }
  eqn.textContent = eqn.textContent.replace("*", "×").replace("/", "÷");
}

function clearClicked() {
  tb.value = CalcScreenDefault;
  operators = [];
  operands = [];
  lastKeyDown = null;
  updateEquation();
}

function delClicked() {
  if (tb.value === CalcScreenDefault) {
    return;
  }
  tb.value = tb.value.slice(0, -1);
  if (tb.value === "") {
    tb.value = CalcScreenDefault;
  }
}

document.onkeydown = function (e) {
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
      clrBtn.click();
      break;
    default:
      break;
  }
};
