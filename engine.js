let velocity = 100;


function createBall(){
    
    $('#box').append("<div class=\"ball\" id=\"ball\"></div>");

    setTimeout(()=>{
        $('#ball').remove();
        setTimeout(()=>{
            createBall();
        }, 1000)
    }, 1000)
}

createBall();

function getDataSnake() {
    let position = $('#headSnake').position();
    console.log(position);
}

let positionX = 0;
let positionY = 0;

function moveSnake(orientation) {

    if (orientation === "X") {
        positionX += 10;
    }
    else if (orientation === "Y") {
        positionY += 10;
    }
    else if (orientation === "-X") {
        positionX -= 10;
    }
    else {
        positionY -= 10;
    }

    $('#headSnake').css('transform', 'translate(' + positionX + 'px,' + positionY + 'px)');
    console.log("X: " + positionX + " Y: " + positionY);
    getDataSnake();
}

let idIntervalLast = 0;

function controllerSnake(orientation) {
    clearInterval(idIntervalLast);
    let idInterval = setInterval(() => {
        moveSnake(orientation);
    }, velocity, 3000);
    idIntervalLast = idInterval;
}

function moveUp() {
    controllerSnake('-Y');
}

function moveDown() {
    controllerSnake('Y');
}

function moveRight() {
    controllerSnake('X');
}

function moveLeft() {
    controllerSnake('-X');
}

$('*').keydown(function (e) {

    let keyPress = e.originalEvent['key'];

    if (keyPress === "ArrowUp") {
        moveUp();
    }
    else if (keyPress === "ArrowDown") {
        moveDown();
    }
    else if (keyPress === "ArrowRight") {
        moveRight();
    }
    else if (keyPress === "ArrowLeft") {
        moveLeft();
    }
    else if (keyPress === " ") {
        alert("Paused");
    }
});
