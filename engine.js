let Elementlienzo = document.getElementById('lienzo');
let lienzo = Elementlienzo.getContext('2d');

// Controllers of game
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let eated = false;
let idIterval = 0;

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
    else if (e.keyCode == 32 || e.keyCode == 27) {
        console.log("IN PAUSE!");
        alert("In pause");
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

function drawBall() {
    lienzo.clearRect(xBall - ballRadius, yBall - ballRadius, ballRadius * 2, ballRadius * 2);
    lienzo.beginPath();
    xBall = createCoords(810);
    yBall = createCoords(490);
    lienzo.arc(xBall, yBall, ballRadius, 0, Math.PI * 2);
    lienzo.fillStyle = "red";
    lienzo.fill();
    lienzo.closePath();
    console.log("BALL CREATED IN X: " + xBall +" , y: "+yBall);
}

let contBodies = 0;
let numBody = 0;

function draw() {

    controllerMovement();
    drawBody();

    if (cords.length >= 20 && !eated) {
        lienzo.clearRect(cords[contBodies][0] - bodyRadius, cords[contBodies][1] - bodyRadius, bodyRadius * 2, bodyRadius * 2);
        contBodies += 1;
    } else {
        eated = false;
        numBody += 1;
        console.log("ONE BODY MORE!" + " TOTAL: " + numBody);
    }
    // If snake crashes into the wall
    if (x + dx > Elementlienzo.width || x + dx < 0) {
        clearInterval(idIterval);
        $('.game-over').show('slow');
    }
    if (y + dy > Elementlienzo.height || y + dy < 0) {
        clearInterval(idIterval);
        $('.game-over').show('slow');
    }


    let cordsitem = [x, y];

    if ((xBall - x) <= ballRadius && (xBall - x) >= -ballRadius && (yBall - y) <= ballRadius && (yBall - y) >= -ballRadius) {
        console.log("BALL EATED! IN X: "+x+", Y: "+y);
        drawBall();
        eated = true;
    }

    cords.push(cordsitem);
    x += dx;
    y += dy;

    for (let i = 0; i < numBody; i++) {
        let corx = cords[(cords.length - 1) - i][0];
        let corY = cords[(cords.length - 1) - i][1];
        if (x == corx && y == corY) {
            clearInterval(idIterval);
            $('.game-over').show('slow');
        }
    }

}

document.addEventListener("keydown", keydownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


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
    lienzo.clearRect(0, 0, Elementlienzo.width, Elementlienzo.height);
}


function newGame() {
    console.log("new game!!");
    $('.game-over').css('display', 'none');
    resetGame();
    setTimeout(drawBall, 500);
    idIterval = setInterval(draw, 60);
}

function startGame() {
    console.log("PLAYING!!");
    $('.play-game').css('display', 'none');
    setTimeout(drawBall, 500);
    idIterval = setInterval(draw, 60);
}