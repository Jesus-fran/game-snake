import { lienzo, Elementlienzo, pixelCoordinates, } from "../contexts/context.js"

let bodies = 1;
let lifeBall = 0;
let contLifeBall = 0;
export let xBall = 200;
export let yBall = 200;
export let ballRadius = 15;
export let ballColor = "red";
let mapCreated = false;

//Atributes head snake
let xhead = 0;
let yhead = 0;
let headRadius = 7;
let headColor = "green";
let eyesColor = "black";
let eyesRadius = 2;

export function showSummary(score, lastScore, ballsmTemp, ballmdTemp, coinsTemp) {
    if (lastScore < score) {
        $('#new-score-summ').css('display', 'block');
    }
    $('#summ-num-sm').html('+' + ballsmTemp);
    $('#summ-num-md').html('+' + ballmdTemp);
    $('#summ-num-coins').html('+' + coinsTemp);
}


export function showScore(score) {
    $('#num-score').html(score);
}


export function showLifeBall() {
    lifeBall = setInterval(() => {
        $('#life-ball').css('display', 'block');
        const width = 100 - contLifeBall;
        $('#bar-life-ball').css('width', width + "%");
        // 7 seconds
        if (contLifeBall >= 100) {
            contLifeBall = 0;
            clearInterval(lifeBall);
            drawBall();
            $('#life-ball').css('display', 'none');
        }
        contLifeBall += 1;
    }, 70); //7,000ms / 100 = 70ms
}

export function stopIntervalLifeBall() {
    clearInterval(lifeBall);
}


export function drawBall() {
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
        showLifeBall();
    }
    //If the ball is on the map
    pixelCoordinates.some(element => {
        if ((element['x'] - xBall) <= ballRadius && (element['x'] - xBall) >= -ballRadius && (element['y'] - yBall <= ballRadius) && (element['y'] - yBall >= -ballRadius)) {
            stopIntervalLifeBall();
            drawBall();
            return true;
        }
    });
    lienzo.arc(xBall, yBall, ballRadius, 0, Math.PI * 2);
    lienzo.fillStyle = ballColor;
    lienzo.fill();
    lienzo.closePath();
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
        if (numRandom >= 0 && numRandom <= 5) {
            return 0; //ball sm, posibility of 6
        }
        else if (numRandom > 5 && numRandom <= 17) {
            return 1; //ball md, posibility of 12
        }
        else if (numRandom >= 18 && numRandom <= 20) {
            return 2; //ball lg, posibility of 3
        }
        else {
            numRandom = 999; //search other numRandom
        }
    }
}

export function drawMap() {

    //Horizontal bar
    lienzo.beginPath();
    lienzo.moveTo(0, 250);
    lienzo.lineTo(350, 250);
    lienzo.lineWidth = 10;
    lienzo.lineCap = "round";
    lienzo.strokeStyle = "rgb(194, 131, 38)";
    lienzo.fill();
    lienzo.stroke();

    lienzo.beginPath();
    lienzo.moveTo(450, 250);
    lienzo.lineTo(820, 250);
    lienzo.stroke();

    //Vertical bar
    lienzo.beginPath();
    lienzo.moveTo(400, 0);
    lienzo.lineTo(400, 200);
    lienzo.stroke();

    lienzo.beginPath();
    lienzo.moveTo(400, 300);
    lienzo.lineTo(400, 500);
    lienzo.stroke();

    if (!mapCreated) {
        // Get data pixels of canvas
        let imageData = lienzo.getImageData(0, 0, Elementlienzo.width, Elementlienzo.height);
        let pixels = imageData.data;

        // Limits of canvas
        let minX = Elementlienzo.width;
        let maxX = 0;
        for (let y = 0; y < Elementlienzo.height; y++) {
            for (let x = 0; x < Elementlienzo.width; x++) {
                let pixelIndex = (y * Elementlienzo.width + x) * 4; // Formula applied to calculate the position of the colors of that pixel.
                if (pixels[pixelIndex + 3] > 0) {
                    if (x < minX) {
                        minX = x;
                    }
                    if (x > maxX) {
                        maxX = x;
                    }
                }
            }
        }

        // Store internal map coordinates
        for (let y = 0; y < Elementlienzo.height; y++) {
            for (let x = minX; x <= maxX; x++) {
                let pixelIndex = (y * Elementlienzo.width + x) * 4;
                if (pixels[pixelIndex + 3] > 0) {
                    pixelCoordinates.push({ x: x, y: y });
                }
            }
        }

        mapCreated = true;
    }
}

export function drawBody(x, y, bodyRadius) {
    lienzo.beginPath();
    lienzo.arc(x, y, bodyRadius, 0, Math.PI * 2);
    lienzo.fillStyle = "#0095DD";
    lienzo.fill();
    lienzo.closePath();
    bodies += 1;
}

export function showMoney() {
    const ballsmsaved = parseInt(localStorage.getItem('ballsm'));
    const ballmdsaved = localStorage.getItem('ballmd');
    const ballcoins = localStorage.getItem('coins');

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

export function showGameOver() {
    $('.game-over').show('slow');
    $('#life-ball').css('display', 'none');
}

export function hideResumeGame() {
    $('.pause-game').css('display', 'none');
    if (contLifeBall != 0) {
        showLifeBall();
    }
}

export function resetContLifeBall() {
    contLifeBall = 0;
}

function rightLeftEyes(x, y) {
    lienzo.beginPath();
    lienzo.arc(x, y - (headRadius / 2), eyesRadius, 0, Math.PI * 2);
    lienzo.fillStyle = eyesColor;
    lienzo.fill();
    lienzo.closePath();

    lienzo.beginPath();
    lienzo.arc(x, y + (headRadius / 2), eyesRadius, 0, Math.PI * 2);
    lienzo.fillStyle = eyesColor;
    lienzo.fill();
    lienzo.closePath();
}

function downUpEyes(x, y) {
    lienzo.beginPath();
    lienzo.arc(x - headRadius + (headRadius / 2), y, eyesRadius, 0, Math.PI * 2);
    lienzo.fillStyle = eyesColor;
    lienzo.fill();
    lienzo.closePath();

    lienzo.beginPath();
    lienzo.arc(x + (headRadius / 2), y, eyesRadius, 0, Math.PI * 2);
    lienzo.fillStyle = eyesColor;
    lienzo.fill();
    lienzo.closePath();
}

export function drawHead(x, y, directionSnake) {

    lienzo.beginPath();
    lienzo.arc(x, y, headRadius, 0, Math.PI * 2);
    lienzo.fillStyle = headColor;
    lienzo.fill();
    lienzo.closePath();

    // Draw eyes
    if (directionSnake == "right" || directionSnake == "left") {
        rightLeftEyes(x, y);
    }
    else if (directionSnake == "up" || directionSnake == "down") {
        downUpEyes(x, y);
    }
}

export function showNewGame() {
    bodies = 1;
    let width = 0;
    $('.game-over').css('display', 'none');
    $('#new-score-summ').css('display', 'none');
    $('#bar-progress').css('width', width + "%");
}

export function changeEyesRadius(radius){
    eyesRadius = radius;
}