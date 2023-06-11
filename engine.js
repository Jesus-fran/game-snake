let Elementlienzo = document.getElementById('lienzo');
let lienzo = Elementlienzo.getContext('2d');

// Controllers of game
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let eated = false;

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
    else if (e.keyCode == 32) {
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
        }
        console.log(numRandom);
        return numRandom;
}

function drawBall() {
    lienzo.clearRect(xBall - ballRadius, yBall - ballRadius, ballRadius * 2, ballRadius * 2);
    lienzo.beginPath();
    xBall = createCoords(820);
    yBall = createCoords(500);
    lienzo.arc(xBall, yBall, ballRadius, 0, Math.PI * 2);
    lienzo.fillStyle = "red";
    lienzo.fill();
    lienzo.closePath();
}

let contBodies = 0;
let numBody = 0;

function draw() {

    controllerMovement();
    drawBody();

    if (cords.length >= 5 && !eated) {
        lienzo.clearRect(cords[contBodies][0] - bodyRadius, cords[contBodies][1] - bodyRadius, bodyRadius * 2, bodyRadius * 2);
        contBodies += 1;
    } else {
        eated = false;
        numBody += 1;
        console.log("ONE BODY MORE!" + " TOTAL: " + numBody);
    }
    if (x + dx > Elementlienzo.width || x + dx < 0) {
        clearInterval(idIterval);
    }
    if (y + dy > Elementlienzo.height || y + dy < 0) {
        clearInterval(idIterval);
        
    }

    let cordsitem = [x, y];
    console.log("coordenadas: "+x+" - "+y +" ball: "+xBall+" - "+yBall);
    
    if ((xBall - x) <= ballRadius &&  (xBall - x) >= -ballRadius && (yBall - y) <= ballRadius && (yBall - y) >= -ballRadius ) {
        console.log("EATED!");
        drawBall();
        eated = true;
    }

    cords.push(cordsitem);
    x += dx;
    y += dy;

}

document.addEventListener("keydown", keydownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setTimeout(drawBall, 500);
let idIterval = setInterval(draw, 60);
