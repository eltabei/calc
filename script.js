// TODO
// fix bug that happens sometimes when mixing using keyboard and mouse in
// one operation
// add multi operator pressing support

const CalcScreenDefault = "0.";
const Operators = ["+", "-", "*", "/"];
const tb = document.getElementById("calcScreen");
const allBtns = document.querySelectorAll("div.btnsContainer > button");
const eqBtn = document.querySelector("div.btnsContainer > button[value='=']");
let op = null;
let lastKeyDown = null;
// contains parts of equation: operands and operators
let operands = [];


function digitPressed(btn) {
  if (lastKeyDown === null || Operators.includes(lastKeyDown)) {
    tb.value = btn.value;
  } else {
    tb.value += btn.value;
  }
  lastKeyDown = btn.value;
  //console.log(lastKeyDown);
}

function opPressed(btn) {
  //console.log("opPressed: " + btn.value);
  if (operands.length == 2) {
    eqPressed();
  }
  op = btn.value;
  operands.push(tb.value);
  lastKeyDown = btn.value;
}

function eqPressed() {
  console.log("eqPressed", operands, op);
  operands.push(tb.value);
  switch (op) {
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
  operands = [];
  lastKeyDown = null;
  op = null;
}

function clearPressed() {
  tb.value = CalcScreenDefault;
  op = null;
  operands = [];
  lastKeyDown = null;
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
  console.log("Keydown: " + e.key);
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
      let eqBtn = document.querySelector("div.btnsContainer > button[value='=']");
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
