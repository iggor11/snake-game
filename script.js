const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20; // Tamanho do quadrado da grade
const gridSize = Math.floor(canvas.width / tileSize); // Tamanho do grid da grade

let snake = [{ x: 10, y: 10 }]; // Cobra inicial com uma parte
let food = { x: 15, y: 15 }; // Posição inicial da comida
let dx = 1; // Velocidade de movimento da cobra no eixo x
let dy = 0; // Velocidade de movimento da cobra no eixo y

// Ajusta o tamanho do canvas para um campo maior
canvas.width = 600;
canvas.height = 600;

// Função principal para inicializar o jogo
function startGame() {
    // Limpa o canvas
    clearCanvas();

    // Reinicia a cobra e a comida
    snake = [{ x: 10, y: 10 }];
    food = generateFood(); // Gera a posição inicial da comida

    // Inicia o loop do jogo
    setInterval(update, 100); // Atualiza o jogo a cada 100 milissegundos
}

// Função principal para atualizar o jogo
function update() {
    clearCanvas(); // Limpa o canvas
    moveSnake(); // Move a cobra
    drawSnake(); // Desenha a cobra

    // Desenha a comida (quadrado verde)
    ctx.fillStyle = 'green';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Verifica se houve colisão
    if (checkCollision(snake[0])) {
        gameOver(); // Chama a função de fim de jogo se houver colisão
    }
}

// Limpa o canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Desenha a cobra
function drawSnake() {
    ctx.fillStyle = 'black';
    snake.forEach(part => {
        ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    });
}

// Move a cobra na direção atual
function moveSnake() {
    // Cria uma nova cabeça baseada na direção atual
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Adiciona a nova cabeça no início da cobra
    snake.unshift(head);

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        food = generateFood(); // Gera uma nova posição para a comida
    } else {
        snake.pop(); // Remove a cauda da cobra se não comeu a comida
    }
}

// Gera uma nova posição aleatória para a comida
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.some(part => part.x === newFood.x && part.y === newFood.y));

    return newFood;
}

// Verifica colisões da cobra com as bordas ou com o próprio corpo
function checkCollision(head) {
    // Verifica se a cabeça da cobra colidiu com as bordas do campo
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        return true; // Retorna verdadeiro se houver colisão com as bordas
    }

    // Verifica se a cabeça da cobra colidiu com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Retorna verdadeiro se houver colisão com o próprio corpo
        }
    }

    return false; // Retorna falso se não houver colisão
}

// Define a nova direção da cobra baseada no teclado
document.addEventListener('keydown', event => {
    const keyPressed = event.key;

    switch (keyPressed) {
        case 'ArrowUp':
            if (dy === 0) { // Impede que a cobra vá na direção oposta
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// Inicia o jogo pela primeira vez
startGame();
