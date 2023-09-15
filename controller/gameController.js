import { addBalls, addBallsTemp, addScore, getBallsTemp, getLastScore, getScore, saveBalls, setBalls, setBallsTemp, setLastScore, setScore } from "../model/gameModel.js"
import { showScore, drawBall, drawMap, drawBody, stopIntervalLifeBall, showSummary, showMoney, showGameOver, hideResumeGame, resetContLifeBall, xBall, ballRadius, yBall, drawHead, showNewGame } from "../view/gameView.js"
import { lienzo, Elementlienzo, pixelCoordinates } from "../contexts/context.js"

if (!localStorage.getItem('ballmd')) {
    localStorage.setItem('ballmd', 0);
}
if (!localStorage.getItem('ballsm')) {
    localStorage.setItem('ballsm', 0);
}
if (!localStorage.getItem('coins')) {
    localStorage.setItem('coins', 0);
}
if (!localStorage.getItem('lastscore')) {
    localStorage.setItem('lastscore', 0);
}

if (!localStorage.getItem('velocity')) {
    localStorage.setItem('velocity', 100);
}

// Controllers of game
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let eated = false;
let idIterval = 0;
let pausedGame = false;
let runingGame = false;
let ballsm = parseInt(localStorage.getItem('ballsm'));
let ballmd = parseInt(localStorage.getItem('ballmd'));
let ballgd = parseInt(localStorage.getItem('coins'));
setBalls(ballsm, ballmd, ballgd);

let lastPressed = 0;
let intervalControllers = 0;
let controllersVelocity = 30;
let ballsLevel = 5;

// Atributes snake
let cords = [];
let x = 100;
let y = 100;
let dx = 14;
let dy = 0;
let bodyRadius = 7;
let directionSnake = "";
let arrVelocity = [170, 160, 150, 140, 130, 120, 100, 90, 80, 70, 60, 50, 40];
let intervalVelocity = parseInt(localStorage.getItem('velocity'));
$('#inputVelocity').val(arrVelocity.indexOf(intervalVelocity));

let contBodies = 0;
let numBody = 0;

function controllerMovement() {
    if (rightPressed && !pausedGame) {
        dx = 14;
        dy = 0;
        directionSnake = "right";
    }
    if (leftPressed && !pausedGame) {
        dx = -14;
        dy = 0;
        directionSnake = "left"
    }
    if (upPressed && !pausedGame) {
        dy = -14;
        dx = 0;
        directionSnake = "up"
    }
    if (downPressed && !pausedGame) {
        dy = 14;
        dx = 0;
        directionSnake = "down"
    }
}

export function keydownHandler(e) {
    if (e.keyCode == 39 && lastPressed != 37) {
        rightPressed = true;
        lastPressed = 39;
    }
    else if (e.keyCode == 37 && lastPressed != 39) {
        leftPressed = true;
        lastPressed = 37;
    }
    else if (e.keyCode == 38 && lastPressed != 40) {
        upPressed = true
        lastPressed = 38;
    }
    else if (e.keyCode == 40 && lastPressed != 38) {
        downPressed = true;
        lastPressed = 40;
    }
    else if ((e.keyCode == 32 || e.keyCode == 27) && runingGame) {
        // key to pause the game
        if (pausedGame) {
            pausedGame = false;
            resumeGame();  // FALTA AGREGAR ESTA FUNCION !!!!!
        } else {
            pauseGame();
        }
    }

}

export function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
    else if (e.keyCode == 38) {
        upPressed = false;
    }
    else if (e.keyCode == 40) {
        downPressed = false;
    }
}

export function startGame() {
    console.debug("PLAYING!!");
    $('.play-game').css('display', 'none');
    $('#new-score-summ').css('display', 'none');
    directionSnake = "right";
    eyesRadius = 2;
    setTimeout(function () {
        drawBall();
    }, 700);
    intervalControllers = setInterval(() => {
        controllerMovement();
    }, controllersVelocity);
    idIterval = setInterval(main, intervalVelocity);
    runingGame = true;
    const score = 0;
    showScore(score);
}

export function pauseGame() {
    pausedGame = true;
    console.debug("IN PAUSE!");
    $('.pause-game').css('display', 'block');
    clearInterval(idIterval);
    stopIntervalLifeBall();
}

export function resumeGame() {
    pausedGame = false;
    clearInterval(intervalControllers);
    console.debug("RESUMED");
    intervalControllers = setInterval(() => {
        controllerMovement();
    }, controllersVelocity);
    idIterval = setInterval(main, intervalVelocity);
    hideResumeGame();
    runingGame = true;
}


function gameOver() {
    clearInterval(intervalControllers);
    clearInterval(idIterval);
    showGameOver();
    runingGame = false;
    lastPressed = 0;
    const ballsTempGeted = getBallsTemp();
    const lastScore = getLastScore();
    showSummary(getScore(), lastScore, ballsTempGeted[0], ballsTempGeted[1], ballsTempGeted[2]);
    setScore(0);
    setBallsTemp(0, 0, 0);
    stopIntervalLifeBall();
    showMoney();
}

function snakeEated() {
    //If the coords of the head snake are equals with coords of ball.
    if ((xBall - x) <= ballRadius && (xBall - x) >= -ballRadius && (yBall - y) <= ballRadius && (yBall - y) >= -ballRadius) {
        eated = true;
        addScore(1);
        const score = getScore()
        showScore(score);
        let width = (score * (100 / ballsLevel));
        $('#bar-progress').css('width', width + "%");
        const lastScore = getLastScore();
        if (lastScore < score) {
            setLastScore(score);
        }
        if (ballRadius == 10) {
            addBalls(1, 0, 0);
            addBallsTemp(1, 0, 0);
        }
        else if (ballRadius == 15) {
            addBalls(0, 1, 0);
            addBallsTemp(0, 1, 0)
        }
        else if (ballRadius == 20) {
            addBalls(0, 0, 1);
            addBallsTemp(0, 0, 1);
        }
        saveBalls();
        stopIntervalLifeBall();
        resetContLifeBall();
        $('#life-ball').css('display', 'none');
        drawBall();
    }
}

function levelCompleted() {
    console.debug("LEVEL COMPLETED!");
    clearInterval(intervalControllers);
    clearInterval(idIterval);
    $('.level-completed').show('slow');
    runingGame = false;
    lastPressed = 0;
    setScore(0);
    setBallsTemp(0, 0, 0);
    showMoney();
}

function resetGame() {
    cords = [];
    x = 100;
    y = 100;
    dx = 14;
    dy = 0;
    bodyRadius = 7;
    contBodies = 0;
    numBody = 0;
    setScore(0);
    leftPressed = 0;
    directionSnake = "right";
    eyesRadius = 2;
    clearInterval(intervalControllers);
    lienzo.clearRect(0, 0, Elementlienzo.width, Elementlienzo.height);
}

export function newGame() {
    console.debug("new game!!");
    resetGame();
    const score = getScore();
    showScore(score);
    setTimeout(drawBall, 500);
    intervalControllers = setInterval(() => {
        controllerMovement();
    }, controllersVelocity);
    runingGame = true;
    showNewGame();
    idIterval = setInterval(main, intervalVelocity);
}

function main() {
    drawMap();

    drawBody(x, y, bodyRadius);

    // if the snake did not eat a ball then it starts to run.
    //access the first body that stayed as a tail and eliminates it.
    if (cords.length >= 3 && !eated) {
        lienzo.clearRect(cords[contBodies][0] - bodyRadius, cords[contBodies][1] - bodyRadius, bodyRadius * 2, bodyRadius * 2);
        contBodies += 1;
    } else {
        eated = false;
        numBody += 1;
    }

    //If the snake collides with  wall that divides
    pixelCoordinates.some(element => {
        if ((element['x'] - x) <= 2 && (element['x'] - x) >= -2 && (element['y'] - y <= 2) && (element['y'] - y >= -2)) {
            gameOver();
            return true;
        }
    });

    //If snake into the empty then back in other position inverse
    //For the X axis
    if (x > Elementlienzo.width + (bodyRadius * 2)) {
        x = 0;
    } else if (x < 0 - (bodyRadius * 2)) {
        x = Elementlienzo.width;
    }
    //For the Y axis
    if (y > Elementlienzo.height + (bodyRadius * 2)) {
        y = 0;
    } else if (y < 0 - (bodyRadius * 2)) {
        y = Elementlienzo.height;
    }

    //Save coord of bodies the snake
    let cordsitem = [x, y];
    cords.push(cordsitem);

    // if snake eat one ball
    snakeEated();

    //To run the snake
    x += dx;
    y += dy;

    // if snake eats itself
    for (let i = 0; i < numBody; i++) {
        let corx = cords[(cords.length - 1) - i][0];
        let cory = cords[(cords.length - 1) - i][1];
        if (x == corx && y == cory) {
            eyesRadius = 3;
            gameOver();
        }
    }

    drawHead(x, y, directionSnake);

    //If level completed
    const score = getScore();
    if (score >= ballsLevel) {
        levelCompleted();
    }
}