// TODO
// [x] Typing after getting an operation result should erase screen AND
//     equation instead of appending to it
// [x] Division by zero: emulate Windows Calculator behavior
// [x] Automatically add zero when typing (.1 + .2)
// [x] Prevent multi dots pressing
// [x] Delete .0 when typed into screen or equation or obtained as a result
// [x] Handle floating points mistakes e.g. (.1 + .2)
// [ ] Add shadow to give 3d-like effect
// [ ] write some short info in footer: copyright & link to github profile


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
const floatError = .0000000000000001;

// array of operators
let operators = [];
// array of operands (numbers)
let operands = [];
// last calculator key pressed
let lastKeyDown = null;

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
  if (lastKeyDown === null || lastKeyDown === Equal || CalcOperators.includes(lastKeyDown)) {
    if (btn.value === ".") {
      tb.value = "0.";
    } else {
      tb.value = btn.value;
    }
  } else {
    if (!(btn.value === "." && tb.value.includes("."))) {
      tb.value += btn.value;
    }
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
    calcScreenTrimPointZero();
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

function calcScreenTrimPointZero() {
  // convert x.0 to x
  if (tb.value.endsWith(".0")) {
    tb.value = tb.value.slice(0, -2);
  }
}

function fixResult(n) {
  return Number(n.toFixed(15));
}

function equalClicked() {
  if (lastKeyDown === Equal) {
    // console.log(operands, operators);
    // give result of eqn: number on screen, last operation operator,last operation 2nd operand
    operands = [tb.value, lastOperands[lastOperands.length - 1]];
    operators = lastOperators;
  } else {
    calcScreenTrimPointZero();
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
  let v;
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
        tb.value = "Cannot divide by zero";
        return;
      }
      v = parseFloat(operands[0]) / parseFloat(operands[1]);
      break;
    default:
      //alert("Error: unknown operator");
      tb.value = CalcScreenDefault;
      return;
  }
  //tb.value = v;
  tb.value = fixResult(v);
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
      if (operands[1] == 0) {
        // emulate Windows Calculator behavior
        eqn.textContent = `${operands[0]} ${operators[0]} `;
      } else {
        eqn.textContent = `${operands[0]} ${operators[0]} ${operands[1]} = `;
      }
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
