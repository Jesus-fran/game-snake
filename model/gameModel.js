let score = 0;
let ballsm = 0;
let ballmd = 0;
let ballgd = 0;

let ballsmTemp = 0;
let ballmdTemp = 0;
let ballgdTemp = 0;

export function addScore(scoring) {
    score += scoring;
}

export function setScore(scoreGeted) {
    score = scoreGeted;
}

export function getScore() {
    return score;
}

export function addLastScore(scoring) {
    localStorage.setItem('lastscore', (getLastScore() + scoring));
}

export function setLastScore(scoreGeted) {
    localStorage.setItem('lastscore', scoreGeted);
}

export function getLastScore() {
    return parseInt(localStorage.getItem('lastscore'));
}

export function addBalls(getballsm, getballmd, getballgd) {
    ballsm += getballsm;
    ballmd += getballmd;
    ballgd += getballgd;
}

export function setBalls(getballsm, getballmd, getballgd) {
    ballsm = getballsm;
    ballmd = getballmd;
    ballgd = getballgd;
}

export function saveBalls() {
    localStorage.setItem('ballsm', ballsm);
    localStorage.setItem('ballmd', ballmd);
    localStorage.setItem('coins', ballgd);
}

export function addBallsTemp(getballsmTemp, getballmdTemp, getballgdTemp) {
    ballsmTemp += getballsmTemp;
    ballmdTemp += getballmdTemp;
    ballgdTemp += getballgdTemp;
}

export function setBallsTemp(getballsmTemp, getballmdTemp, getballgdTemp) {
    ballsmTemp = getballsmTemp;
    ballmdTemp = getballmdTemp;
    ballgdTemp = getballgdTemp;
}

export function getBallsTemp() {
    return [
        ballsmTemp,
        ballmdTemp,
        ballgdTemp,
    ];
}
