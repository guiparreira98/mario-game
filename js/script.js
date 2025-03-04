const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const gameOver = document.querySelector('.game-over');
const counter = document.querySelector('.counter');
const lastScoreElement = document.getElementById('lastScore');

let isGameOver = false;
let loop;
let score = 0;
let hasPassedPipe = false;
let pipeSpeed = 1.5; 
let isGameStarted = false;

const jump = () => {
    if (!isGameOver) {
        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
}

const resetGame = () => {
    isGameOver = false;
    gameOver.style.display = 'none';
    mario.src = './images/mario.gif';
    mario.style.width = '150px';
    mario.style.bottom = '0';
    pipeSpeed = 1.5; 
    pipe.style.animation = `pipe-animation ${pipeSpeed}s infinite linear`;
    pipe.style.left = '';
    clouds.style.animation = 'clouds-animation 20s infinite linear';
    score = 0;
    counter.textContent = score;
    hasPassedPipe = false;

    startGameLoop();
}

const adjustPipeSpeed = () => {
    if (score % 5 === 0) {
        pipeSpeed -= 0.02; 
        pipe.style.animation = `pipe-animation ${pipeSpeed}s infinite linear`;
    }
}

const saveScore = () => {
    const lastScore = localStorage.getItem('lastScore');
    if (lastScore === null || score > lastScore) {
        localStorage.setItem('lastScore', score);
    }
}

const loadLastScore = () => {
    const lastScore = localStorage.getItem('lastScore');
    if (lastScore !== null) {
        lastScoreElement.textContent = lastScore;
    }
}

const startGameLoop = () => {
    loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;

            mario.src = "./images/game-over.png";
            mario.style.width = '75px';

            clouds.style.animation = 'none';
            clouds.style.right = `${clouds.offsetLeft}px`;

            gameOver.style.display = 'block';
            isGameOver = true;

            saveScore(); // Salva a pontuação quando o jogo termina
            loadLastScore(); // Atualiza a última pontuação exibida
            clearInterval(loop);
        } else if (pipePosition < 0 && !hasPassedPipe) {
            score++;
            counter.textContent = score;
            hasPassedPipe = true;
            adjustPipeSpeed(); 
        } else if (pipePosition >= 120) {
            hasPassedPipe = false;
        }
    }, 10);
}

document.addEventListener('keydown', (event) => {
    if (!isGameStarted) {
        isGameStarted = true;
        pipe.style.animation = `pipe-animation ${pipeSpeed}s infinite linear`;
        clouds.style.animation = 'clouds-animation 20s infinite linear';
        loadLastScore(); // Carrega a última pontuação quando o jogo começa
        startGameLoop();
    } else if (isGameOver) {
        resetGame();
    } else {
        jump();
    }
});

pipe.style.animation = 'none';
clouds.style.animation = 'none';