const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
   

}


// Obtener referencias a los botones
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const shootButton = document.getElementById('shootButton');


// Asignar eventos táctiles a los botones
leftButton.addEventListener('touchstart', moveLeft);
leftButton.addEventListener('touchend', stopMovement);
rightButton.addEventListener('touchstart', moveRight);
rightButton.addEventListener('touchend', stopMovement);
shootButton.addEventListener('touchstart', shoot);

// Funciones para manejar eventos táctiles
function moveLeft() {
  player.dx = -player.speed;
}

function moveRight() {
  player.dx = player.speed;
}

function stopMovement() {
  player.dx = 0;
}




function shoot() {
  const bullet = {
    x: player.x + player.width / 2 - bulletWidth / 2,
    y: player.y,
    width: bulletWidth,
    height: bulletHeight
  };
  bullets.push(bullet);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const playerImage = new Image();
playerImage.src = 'images/player.png';

const invaderImages = [
    'images/invader1.png',
    'images/invader2.png',
    'images/invader3.png'
];

const invaderImageElements = invaderImages.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

const bulletImage = new Image();
bulletImage.src = 'images/bullet.png';

const gameOverImage = new Image();
gameOverImage.src = 'images/game-over.png';

const gameWinImage = new Image();
gameWinImage.src = 'images/total.png';

const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 300,
    width: 100,
    height: 270,
    speed: 5,
    dx: 0
};

const invaders = [];
const rows = 5;
const cols = 8;
// Ajustes para invaders
const invaderWidth = 40; // Reducido de 60 a 40
const invaderHeight = 40; // Reducido de 60 a 40
const invaderMargin = 10; // Reducido de 20 a 10
const invaderSpeed = 1.5; // Reducido de 3 a 1.5
const invaderDescendAmount = invaderHeight / 2; // Moverse la mitad de su altura

const bullets = [];
const bulletWidth = 15;
const bulletHeight = 30;
const bulletSpeed = 7;

let scoreP1 = 0;
const scoreDisplayP1 = document.getElementById('scoreP1');
const gameOverDisplay = document.getElementById('gameOver');
const gameOverText = document.getElementById('gameOverText');
const gameWinDisplay = document.getElementById('gameWin');
const startScreen = document.getElementById('startScreen');
const startButton = document.querySelector('.startButton');

let gameInterval;
let gameTimer;
let timeLimit = 30; // Tiempo límite de 30 segundos

function createInvaders() {
    // Calcular el ancho total que ocuparán los invaders en una fila
    const totalInvadersWidth = cols * invaderWidth + (cols - 1) * invaderMargin;
  
    // Calcular la posición inicial del primer invader para centrarlos
    let startX = (canvas.width - totalInvadersWidth) / 2;
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const invader = {
          x: startX + col * (invaderWidth + invaderMargin),
          y: row * (invaderHeight + invaderMargin),
          width: invaderWidth,
          height: invaderHeight,
          dx: invaderSpeed,
          image: invaderImageElements[Math.floor(Math.random() * invaderImageElements.length)]
        };
        invaders.push(invader);
      }
    }
  }

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawInvader(invader) {
    let drawWidth = invader.width;
    let drawHeight = invader.height;

    if (invader.image.src.includes('invader3.png')) {
        drawWidth = invader.width * 0.5;
        drawHeight = invader.height * 0.5;
    }

    ctx.drawImage(invader.image, invader.x, invader.y, drawWidth, drawHeight);
}

function drawBullet(bullet) {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updatePositions() {
    player.x += player.dx;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    let changeDirection = false;
    invaders.forEach(invader => {
        invader.x += invader.dx;
        if (invader.x + invader.width > canvas.width || invader.x < 0) {
            changeDirection = true;
        }
    });

    if (changeDirection) {
        invaders.forEach(invader => {
            invader.dx *= -1;
            invader.y += invaderDescendAmount;
        });
    }

    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
        }
    });
}

function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        invaders.forEach((invader, invaderIndex) => {
            if (
                bullet.x < invader.x + invader.width &&
                bullet.x + bullet.width > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + bullet.height > invader.y
            ) {
                invaders.splice(invaderIndex, 1);
                bullets.splice(bulletIndex, 1);
                scoreP1 += 100;
            }
        });
    });
}

function draw() {
    clear();
    drawPlayer();
    invaders.forEach(drawInvader);
    bullets.forEach(drawBullet);
    scoreDisplayP1.textContent = `P1 Score: ${scoreP1}`;
}

function checkGameOver() {
    if (invaders.some(invader => invader.y + invader.height > canvas.height)) {
        clearInterval(gameInterval);
        clearInterval(gameTimer);
        gameOverDisplay.style.display = 'block';
        // Ocultar el canvas, los botones y el fondo del body
        canvas.style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
        document.body.style.backgroundColor = 'transparent'; // Cambiar el fondo a transparente
    } else if (invaders.length === 0) {
        clearInterval(gameInterval);
        clearInterval(gameTimer);
        gameWinDisplay.style.display = 'block';
        // Ocultar el canvas, los botones y el fondo del body
        canvas.style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
        document.body.style.backgroundColor = 'transparent'; // Cambiar el fondo a transparente
    }
}

function startGame() {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
    document.getElementById('score').style.display = 'block';
    gameInterval = setInterval(() => {
        updatePositions();
        detectCollisions();
        draw();
        checkGameOver();
    }, 1000 / 60);

    gameTimer = setTimeout(() => {
        clearInterval(gameInterval);
        gameOverDisplay.style.display = 'block';
    }, timeLimit * 1000);
}

startButton.addEventListener('click', startGame);

function moveRight() {
    player.dx = player.speed;
}

function moveLeft() {
    player.dx = -player.speed;
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        moveRight();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        moveLeft();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        const bullet = {
            x: player.x + player.width / 2 - bulletWidth / 2,
            y: player.y,
            width: bulletWidth,
            height: bulletHeight
        };
        bullets.push(bullet);
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left'
    ) {
        player.dx = 0;
    }
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

createInvaders();
