const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const speedSelector = document.getElementById("speed-selector");
const difficultySelector = document.getElementById("difficulty-selector");

const canvasSize = 600;
const segmentSize = 30;
const canvasLimit = canvasSize - segmentSize;
const initialSnake = [
  { x: 270, y: 240 },
  { x: 300, y: 240 },
  { x: 330, y: 240 }
];

let snake = [...initialSnake];
let direction, loopId;
let gameOverState = false;
let food = { x: -30, y: -30, color: "" }; // Inicializa a comida fora da tela
let specialFood = { x: -30, y: -30, colors: [], timer: 0, segmentsToChange: 0 }; // Inicializa a comida especial fora da tela

const speedLevels = [500, 400, 300, 150, 75];
let currentSpeedLevel = 2;

const difficultyLevels = ["easy", "normal", "hard"];
let currentDifficultyLevel = "normal";

const changeScore = (points) => {
  const currentScore = parseInt(score.innerText, 10);
  const newScore = Math.max(0, currentScore + points);

  score.innerText = newScore;

  const highestScore = localStorage.getItem("highestSnakeScore") || 0;
  if (newScore > highestScore) {
    localStorage.setItem("highestSnakeScore", newScore);
  }

  localStorage.setItem("snakeScore", newScore);
  document.querySelector(".highest-score-value").innerText = localStorage.getItem("highestSnakeScore") || 0;
};

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - segmentSize);
  return Math.round(number / segmentSize) * segmentSize;
};

const randomColor = () => {
  const rgbColors = Array.from({ length: 3 }, () => randomNumber(0, 255));
  return `rgb(${rgbColors.join(", ")})`;
};

const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, segmentSize, segmentSize);
  ctx.shadowBlur = 0;
};

const drawSpecialFood = () => {
  const { x, y, colors } = specialFood;
  ctx.shadowColor = colors[0];
  ctx.fillStyle = colors[0];
  ctx.fillRect(x, y, segmentSize, segmentSize);
};

const drawSnake = () => {
  ctx.fillStyle = "#888";
  snake.forEach((position, index) => {
    if (index === snake.length - 1) {
      ctx.fillStyle = "#ddd";
    }

    ctx.fillRect(position.x, position.y, segmentSize, segmentSize);
  });
};

const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];

  switch (direction) {
    case "right":
      snake.push({ x: head.x + segmentSize, y: head.y });
      break;
    case "left":
      snake.push({ x: head.x - segmentSize, y: head.y });
      break;
    case "up":
      snake.push({ x: head.x, y: head.y - segmentSize });
      break;
    case "down":
      snake.push({ x: head.x, y: head.y + segmentSize });
      break;
  }
  snake.shift();
};

const drawGrid = () => {
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "#191919";
  for (let i = 30; i < canvas.height; i += segmentSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
};

const checkEat = () => {
  const head = snake[snake.length - 1];
  if (head.x === food.x && head.y === food.y) {
    changeScore(10);
    snake.unshift(snake[0]);

    let x = randomPosition();
    let y = randomPosition();

    while (snake.some((position) => position.x === x && position.y === y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

const checkSpecialEat = () => {
  const head = snake[snake.length - 1];
  if (head.x === specialFood.x && head.y === specialFood.y) {
    applySpecialEffect();
    specialFood.x = -30;
    specialFood.y = -30;
  }
};

const applySpecialEffect = () => {
  changeScore(20); // Exemplo de efeito especial: aumenta a pontuação
};

const resetSpecialFood = () => {
  specialFood.x = randomPosition();
  specialFood.y = randomPosition();
  specialFood.colors = [randomColor()];
  specialFood.timer = 5000;
};

const updateSpecialFoodTimer = () => {
  if (specialFood.timer > 0) {
    specialFood.timer -= 175;
  } else {
    resetSpecialFood();
  }
};

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x === head.x && position.y === head.y;
  });

  if (wallCollision || selfCollision) {
    if (!gameOverState) {
      gameOverState = true;
      gameOver();
    }
  } else {
    gameOverState = false;
  }
};

const gameOver = () => {
  direction = undefined;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
};

const restartGame = () => {
  menu.style.display = "none";
  snake = [...initialSnake];
  direction = undefined;
  score.innerText = 0;
  gameOverState = false;
  food = { x: randomPosition(), y: randomPosition(), color: randomColor() };
  specialFood = { x: -30, y: -30, colors: [], timer: 5000, segmentsToChange: 0 };
  loop();
};

const loop = () => {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  drawGrid();
  drawFood();
  drawSpecialFood();
  drawSnake();

  moveSnake();
  checkEat();
  checkSpecialEat();
  updateSpecialFoodTimer();
  checkCollision();

  if (!gameOverState) {
    loopId = setTimeout(loop, speedLevels[currentSpeedLevel]);
  }
};

buttonPlay.addEventListener("click", restartGame);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  } else if (event.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (event.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (event.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  }
});

speedSelector.addEventListener("change", (event) => {
  currentSpeedLevel = parseInt(event.target.value, 10) - 1;
});

difficultySelector.addEventListener("change", (event) => {
  currentDifficultyLevel = event.target.value;
});

document.querySelector(".highest-score-value").innerText =
  localStorage.getItem("highestSnakeScore") || 0;
score.innerText = localStorage.getItem("snakeScore") || 0;

resetSpecialFood(); // Inicializa a comida especial ao iniciar o jogo
loop(); // Inicia o loop do jogo
