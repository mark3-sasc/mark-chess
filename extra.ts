import { board } from "./basic";

export var extraVar = "extraVar";

var tdElements = document.getElementsByTagName("TD");

document.getElementById("resetButton").addEventListener("click", function() {
  for (var tdElement of tdElements) {
    tdElement.innerHTML = "";
    tdElement.classList.remove("O");
    tdElement.classList.remove("X");
  }

  board[0] = [null, null, null];
  board[1] = [null, null, null];
  board[2] = [null, null, null];
});

var test = 1;
