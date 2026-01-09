// Selection of DOM elements
const playArea = document.querySelector(".play-area");
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const startModal = document.querySelector(".start-game");
const restartModal = document.querySelector(".restart-game");

// Game Info Elements
const highScoreElement = document.querySelector("#high-score");
const currentScoreElement = document.querySelector("#current-score");
const timeElement = document.querySelector("#time");

// Game Specifications
const cellHeight = 50;
const cellWidth = 50;

// Storing High Score in Local Storage
// Initialize Game Variables
let highScore = localStorage.getItem("highScore") || 0;
let currentScore = 0;
let time = `00:00`;

highScoreElement.innerHTML = highScore;

// Calculate number of rows and columns
const rows = Math.floor(playArea.clientHeight / cellHeight);
const cols = Math.floor(playArea.clientWidth / cellWidth);

// Initialize Snake and Food
let snake = [{ row: 5, col: 10 }];
let food = {
  row: Math.floor(Math.random() * rows),
  col: Math.floor(Math.random() * cols),
};

// Initial Direction
let direction = "left";

// Timers
let timerId = null;
let intervalId = null;

// Create the game board
const board = [];

// Generate cells and store references in the board array
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    playArea.appendChild(cell);
    board[`${row}-${col}`] = cell;
  }
}

function render() {
    // Calculate new head position based on direction
  let head = null;

  if (direction === "right") {
    head = { row: snake[0].row, col: snake[0].col + 1 };
  } else if (direction === "left") {
    head = { row: snake[0].row, col: snake[0].col - 1 };
  } else if (direction === "up") {
    head = { row: snake[0].row - 1, col: snake[0].col };
  } else if (direction === "down") {
    head = { row: snake[0].row + 1, col: snake[0].col };
  }

//   Clear previous snake position
  snake.forEach((segment) => {
    board[`${segment.row}-${segment.col}`].classList.remove("snake");
  });

//   Update snake position
  snake.unshift(head);
  snake.pop();

    // Check for food collision
  if (head.row === food.row && head.col === food.col) {
    currentScore += 10;
    currentScoreElement.innerHTML = currentScore;
    board[`${food.row}-${food.col}`].classList.remove("food");
    food = {
      row: Math.floor(Math.random() * rows),
      col: Math.floor(Math.random() * cols),
    };
    board[`${food.row}-${food.col}`].classList.add("food");
    snake.unshift(head);
    // Update high score if needed
    if (currentScore > highScore) {
      highScore = currentScore;
      localStorage.setItem("highScore", highScore.toString());
    }
  }

//   Check for wall collisions
  if (head.row < 0 || head.row >= rows || head.col < 0 || head.col >= cols) {
    clearInterval(intervalId);
    modal.style.display = "flex";
    restartModal.style.display = "flex";
    startModal.style.display = "none";
    return;
  }

//   Render food and snake
  board[`${food.row}-${food.col}`].classList.add("food");

  snake.forEach((segment) => {
    board[`${segment.row}-${segment.col}`].classList.add("snake");
  });
}

// Start Game Event Listener
startButton.addEventListener("click", () => {
  clearInterval(intervalId);
  modal.style.display = "none";
//   Initial render
  intervalId = setInterval(() => {
    render();
  }, 300);
//   Start timer
  timerId = setInterval(() => {
    let [mins, secs] = time.split(":").map(Number);
    secs++;
    if (secs === 60) {
      mins++;
      secs = 0;
    }
    time = `${mins}:${secs}`;
    timeElement.innerHTML = time;
  }, 1000);
});

restartButton.addEventListener("click", restartGame);

// Restart Game Function
function restartGame() {
  clearInterval(intervalId);
  modal.style.display = "none";
//   Clear previous snake and food positions
  board[`${food.row}-${food.col}`].classList.remove("food");
  snake = [{ row: 5, col: 10 }];
  food = {
    row: Math.floor(Math.random() * rows),
    col: Math.floor(Math.random() * cols),
  };
//   Reset game variables
  direction = "down";
  currentScore = 0;
  time = `00:00`;
  currentScoreElement.innerHTML = currentScore;
  timeElement.innerHTML = time;
  highScoreElement.innerHTML = highScore;
  currentScoreElement.innerHTML = currentScore;
  intervalId = setInterval(() => {
    render();
  }, 300);
}

// Keyboard Event Listener for Direction Control
addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    direction = "right";
  } else if (event.key === "ArrowLeft") {
    direction = "left";
  } else if (event.key === "ArrowUp") {
    direction = "up";
  } else if (event.key === "ArrowDown") {
    direction = "down";
  }
});
