let Elementlienzo = document.getElementById('lienzo');
let lienzo = Elementlienzo.getContext('2d');

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

// Controllers of game
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let eated = false;
let idIterval = 0;
let pausedGame = false;
let runingGame = false;
let score = 0;
let ballsm = parseInt(localStorage.getItem('ballsm'));
let ballmd = parseInt(localStorage.getItem('ballmd'));
let coins = parseInt(localStorage.getItem('coins'));

// Atributes snake
let cords = [];
let x = 100;
let y = 100;
let dx = 14;
let dy = 0;
let bodyRadius = 7;

// Atributes ball
let cordsBall = [];
let xBall = 200;
let yBall = 200;
let ballRadius = 15;
let ballColor = "red";

function keydownHandler(e) {
    console.log("PRESSED: " + e.keyCode);
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
    else if (e.keyCode == 38) {
        upPressed = true
    }
    else if (e.keyCode == 40) {
        downPressed = true;
    }
    else if ((e.keyCode == 32 || e.keyCode == 27) && runingGame) {

        if (pausedGame) {
            pausedGame = false;
            resumeGame();
        } else {
            pausedGame = true;
            console.log("IN PAUSE!");
            $('.pause-game').css('display', 'block');
            clearInterval(idIterval);
        }
    }

}

function keyUpHandler(e) {
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

function controllerMovement() {
    if (rightPressed) {
        dx = 14;
        dy = 0;
    }
    if (leftPressed) {
        dx = -14;
        dy = 0;
    }
    if (upPressed) {
        dy = -14;
        dx = 0;
    }
    if (downPressed) {
        dy = 14;
        dx = 0;
    }
}

let bodies = 1;

function drawBody() {
    lienzo.beginPath();
    lienzo.arc(x, y, bodyRadius, 0, Math.PI * 2);
    lienzo.fillStyle = "#0095DD";
    lienzo.fill();
    lienzo.closePath();
    bodies += 1;
}

function createCoords(max) {
    let numRandom = 999;
    while (numRandom > max) {
        numRandom = Math.round(Math.random() * 1000);
        if (numRandom < 10) {
            numRandom = 999;
        }
    }
    return numRandom;
}

function randomBall() {
    let numRandom = 999;
    while (numRandom > 20) {
        numRandom = Math.round(Math.random() * 20);
        console.log(numRandom);
        if (numRandom >= 0 && numRandom <= 5) {
            return 0; //ball sm, posibility of 6
        }
        else if (numRandom > 5 && numRandom <= 17) {
            return 1; //ball md, posibility of 12
        }
        else if (numRandom => 18 && numRandom <= 20) {
            return 2; //ball lg, posibility of 3
        }
        else {
            numRandom = 999; //search other numRandom
        }
    }
}

function drawBall() {
    lienzo.clearRect(xBall - ballRadius, yBall - ballRadius, ballRadius * 2, ballRadius * 2);
    lienzo.beginPath();
    xBall = createCoords(810);
    yBall = createCoords(490);
    let typeBall = randomBall();
    if (typeBall == 0) {
        ballRadius = 10;
        ballColor = "blue";
    }
    else if (typeBall == 1) {
        ballRadius = 15;
        ballColor = "red";
    }
    else if (typeBall == 2) {
        ballRadius = 20;
        ballColor = "springgreen";
    }
    lienzo.arc(xBall, yBall, ballRadius, 0, Math.PI * 2);
    lienzo.fillStyle = ballColor;
    lienzo.fill();
    lienzo.closePath();
    console.log("BALL CREATED IN X: " + xBall + " , y: " + yBall);
}

function showScore(score) {
    $('#num-score').html(score);
}

function showMoney() {
    let ballsmsaved = parseInt(localStorage.getItem('ballsm'));
    let ballmdsaved = localStorage.getItem('ballmd');
    let ballcoins = localStorage.getItem('coins');
    
    let cont = 0;
    let cont1 = 0;
    let cont2 = 0;

    let intervalballsm = setInterval(() => {
        $('#text-ballsm').html(cont);
        if (cont >= ballsmsaved) {
            clearInterval(intervalballsm);
        }
        cont += 1;
    }, 50);
    let intervalballmd = setInterval(() => {
        $('#text-ballmd').html(cont1);
        if (cont1 >= ballmdsaved) {
            clearInterval(intervalballmd);
        }
        cont1 += 1;
    }, 50);
    let intervalballcoins = setInterval(() => {
        $('#text-ballcoins').html(cont2);
        if (cont2 >= ballcoins) {
            clearInterval(intervalballcoins);
        }
        cont2 += 1;
    }, 50);
}

showMoney();

let contBodies = 0;
let numBody = 0;

function draw() {

    controllerMovement();
    drawBody();

    // If the snake did not eat a ball then it starts to run.
    if (cords.length >= 3 && !eated) {
        lienzo.clearRect(cords[contBodies][0] - bodyRadius, cords[contBodies][1] - bodyRadius, bodyRadius * 2, bodyRadius * 2);
        contBodies += 1;
    } else {
        eated = false;
        numBody += 1;
        console.log("ONE BODY MORE!" + " TOTAL: " + numBody);
    }
    // If snake crashes into the wall
    if (x + dx > Elementlienzo.width || x + dx < 0) {
        gameOver();
    }
    if (y + dy > Elementlienzo.height || y + dy < 0) {
        gameOver();
    }


    let cordsitem = [x, y];

    // If Snake eat one ball
    if ((xBall - x) <= ballRadius && (xBall - x) >= -ballRadius && (yBall - y) <= ballRadius && (yBall - y) >= -ballRadius) {
        console.log("BALL EATED! IN X: " + x + ", Y: " + y);
        eated = true;
        score += 1;
        showScore(score);
        let lastScore = parseInt(localStorage.getItem('lastscore'));
        if (lastScore < score) {
            localStorage.setItem('lastscore', score);
        }
        if (ballRadius == 10) {
            ballsm += 1;
            localStorage.setItem('ballsm', ballsm);
        }
        else if (ballRadius == 15) {
            ballmd += 1;
            localStorage.setItem('ballmd', ballmd);
        }
        else if (ballRadius == 20) {
            coins += 1;
            localStorage.setItem('coins', coins);
        }

        drawBall();
    }

    cords.push(cordsitem);
    x += dx;
    y += dy;

    // If snake eats itself
    for (let i = 0; i < numBody; i++) {
        let corx = cords[(cords.length - 1) - i][0];
        let corY = cords[(cords.length - 1) - i][1];
        if (x == corx && y == corY) {
            gameOver();
        }
    }

}

document.addEventListener("keydown", keydownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function gameOver() {
    clearInterval(idIterval);
    $('.game-over').show('slow');
    runingGame = false;
    score = 0;
    showMoney();
}

function resetGame() {
    cords = [];
    x = 100;
    y = 100;
    dx = 14;
    dy = 0;
    bodyRadius = 7;
    bodies = 1;
    contBodies = 0;
    numBody = 0;
    score = 0;
    showScore(score);
    lienzo.clearRect(0, 0, Elementlienzo.width, Elementlienzo.height);
}


function newGame() {
    console.log("new game!!");
    $('.game-over').css('display', 'none');
    resetGame();
    setTimeout(drawBall, 500);
    idIterval = setInterval(draw, 60);
    runingGame = true;
}

function startGame() {
    console.log("PLAYING!!");
    $('.play-game').css('display', 'none');
    setTimeout(drawBall, 500);
    idIterval = setInterval(draw, 60);
    runingGame = true;
    score = 0;
    showScore(score);
}

function resumeGame() {
    console.log("RESUMED");
    $('.pause-game').css('display', 'none');
    idIterval = setInterval(draw, 60);
    runingGame = true;
}
