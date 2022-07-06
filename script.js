let op = null;
let left = null;
let right = null;
let tb = null;
let opJustPressed = false;

function digitPressed(btn) {
  tb = document.getElementById("calcScreen");
  if (tb.value == "0." || opJustPressed) {
    tb.value = btn.value;
    opJustPressed = false;
  } else {
    tb.value += btn.value;
  }
  // console.log(btn.innerHTML);
}

function opPressed(btn) {
  op = btn.value;
  left = tb.value;
  opJustPressed = true;
}

function eqPressed(btn) {
  right = tb.value;
  switch (op) {
    case "+":
      tb.value = parseFloat(left) + parseFloat(right);
      break;
    case "-":
      tb.value = parseFloat(left) - parseFloat(right);
      break;
    case "*":
      tb.value = parseFloat(left) * parseFloat(right);
      break;
    case "/":
      tb.value = parseFloat(left) / parseFloat(right);
      break;
    default:
      tb.value = "0.";
  }
}

function clearPressed() {
  tb.value = "0.";
  op = null;
  left = null;
  right = null;
  opJustPressed = false;
}

function delPressed() {
  tb.value = tb.value.slice(0, -1);
}
