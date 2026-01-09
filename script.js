const playArea = document.querySelector('.play-area');
const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');
const modal = document.querySelector('.modal');
const startModal = document.querySelector('.start-game');
const restartModal = document.querySelector('.restart-game');


const cellHeight = 50;
const cellWidth = 50;

const rows = Math.floor(playArea.clientHeight / cellHeight);
const cols = Math.floor(playArea.clientWidth / cellWidth);

let snake = [
    {row : 5, col : 10},
];
let food = {
    row : Math.floor(Math.random() * rows),
    col : Math.floor(Math.random() * cols)
}

let direction = 'left';

let intervalId = null;

const board = [];

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        playArea.appendChild(cell);
        board[`${row}-${col}`] = cell;
    }
}

function render() {

    let head = null;

    if (direction === 'right') {
        head = {row : snake[0].row, col : snake[0].col + 1};
    } else if (direction === 'left') {
        head = {row : snake[0].row, col : snake[0].col - 1};
    } else if (direction === 'up') {
        head = {row : snake[0].row - 1, col : snake[0].col};
    } else if (direction === 'down') {
        head = {row : snake[0].row + 1, col : snake[0].col};
    }

    snake.forEach(segment => {
        board[`${segment.row}-${segment.col}`].classList.remove('snake');
    })

    snake.unshift(head);
    snake.pop();

    if (head.row === food.row && head.col === food.col) {
        board[`${food.row}-${food.col}`].classList.remove('food');
        food = {
                    row : Math.floor(Math.random() * rows),
                    col : Math.floor(Math.random() * cols)
                };
        board[`${food.row}-${food.col}`].classList.add('food');
        snake.unshift(head);
    }

    if (head.row < 0 || head.row >= rows || head.col < 0 || head.col >= cols) {
        clearInterval(intervalId);
        modal.style.display = 'flex';
        restartModal.style.display = 'flex';
        startModal.style.display = 'none';
        return;
    }

    board[`${food.row}-${food.col}`].classList.add('food');

    snake.forEach(segment => {
        board[`${segment.row}-${segment.col}`].classList.add('snake');
    })
}

startButton.addEventListener('click', () => {
    clearInterval(intervalId);
    modal.style.display = 'none';
    intervalId = setInterval(() => {
        render();
    }, 300);
})

restartButton.addEventListener('click', restartGame);

function restartGame() {
    clearInterval(intervalId);
    modal.style.display = 'none';
    board[`${food.row}-${food.col}`].classList.remove('food');
    snake = [{row : 5, col : 10}];
    food = {
                row : Math.floor(Math.random() * rows),
                col : Math.floor(Math.random() * cols)
            };
    direction = 'down';
    intervalId = setInterval(() => {
        render();
    }, 300);
}

addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') {
        direction = 'right';
    } else if (event.key === 'ArrowLeft') {
        direction = 'left';
    } else if (event.key === 'ArrowUp') {
        direction = 'up';
    } else if (event.key === 'ArrowDown') {
        direction = 'down';
    }
})