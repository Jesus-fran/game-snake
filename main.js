import { startGame, keyUpHandler, keydownHandler, resumeGame, newGame } from "./controller/gameController.js";
import { showMoney } from "./view/gameView.js";

document.getElementById('btn-play').addEventListener('click', startGame);
document.getElementById('btn-resume').addEventListener('click', resumeGame);
document.addEventListener("keydown", keydownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.getElementById('btn-new').addEventListener('click', newGame);

$(document).ready(function () {
    showMoney();
});