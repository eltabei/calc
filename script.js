// TODO
// fix bug that happens sometimes when mixing using keyboard and mouse in
// one operation
// handle repeated pressing of equal (emulate Windows calc behavior)

const CalcScreenDefault = "0";
const CalcOperators = ["+", "-", "*", "/"];
const Equal = "=";
const tb = document.getElementById("calcScreen");
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

// add event listeners to all digit buttons
for (const btn of digitBtns) {
  btn.addEventListener("click", () => digitPressed(btn));
}
// add event listeners to all op buttons
for (const btn of opBtns) {
  btn.addEventListener("click", () => operatorPressed(btn));
}
// add event listeners to rest of buttons
eqBtn.addEventListener("click", equalPressed);
clrBtn.addEventListener("click", clearPressed);
delBtn.addEventListener("click", delPressed);


function digitPressed(btn) {
  // if this is the very first key to be pressed
  // or if an operator was just pressed
  if (lastKeyDown === null || CalcOperators.includes(lastKeyDown)) {
    tb.value = btn.value;
  } else {
    tb.value += btn.value;
  }
  lastKeyDown = btn.value;
}


function operatorPressed(btn) {
  // if 2 operators pressed in a row, ignore last one
  if (CalcOperators.includes(lastKeyDown)) {
    operators.pop();
  }
  operators.push(btn.value);
  operands.push(tb.value);
  if (operators.length == 2) {
    solve();
    operands = [tb.value];
    operators = [btn.value];
    //operators.shift();
  }
  lastKeyDown = btn.value;
  updateEquation(false);
}


function equalPressed() {
  operands.push(tb.value);
  console.log("eqPressed", operands, operators);
  updateEquation();
  solve();
  operands = [];
  operators.shift();
  lastKeyDown = null;
  console.log(operands, operators);
}


function solve() {
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


function updateEquation(byEqualKey=true) {
  if (operands.length == 0) {
    eqn.textContent = "";
  } else if (operands.length == 1) {
    eqn.textContent = `${operands[0]} ${operators[0]}`;
  } else {
    if (byEqualKey) {
      eqn.textContent = `${operands[0]} ${operators[0]} ${operands[1]} = `;
    } else {
      eqn.textContent = `${tb.value} ${operators[operators.length - 1]}`;
    }
  }
}


function clearPressed() {
  tb.value = CalcScreenDefault;
  operators = [];
  operands = [];
  lastKeyDown = null;
  updateEquation();
}


function delPressed() {
  if (tb.value == CalcScreenDefault) {
    return;
  }
  tb.value = tb.value.slice(0, -1);
  if (tb.value == "") {
    tb.value = CalcScreenDefault;
  }
}


document.onkeydown = function(e) {
  let btn = document.querySelector("div.btnsContainer > button[value='" + e.key + "']");
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
      delPressed();
      break;
    case "Escape":
      clearPressed();
      break;
    default:
      break;
  }
}
