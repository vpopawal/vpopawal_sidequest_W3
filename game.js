// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawGame() → what the game screen looks like
// 2) input handlers → what happens when the player clicks or presses keys
// 3) helper functions specific to this screen

// ------------------------------
// Button data
// ------------------------------
// This object stores all the information needed to draw
// and interact with the button on the game screen.
// Keeping this in one object makes it easier to move,
// resize, or restyle the button later.
let ballX;
let ballY;
let ballSize = 30;
let ballSpeed = 4;

let goalWidth = 200;
let goalHeight = 30;

let obstacles = [];
let obstacleSize = 20;
let obstacleSpeed = 10;
let obstacleSpawnRate = 20;

let gameState = "playing";

const playAgainBtn = {
  x: 0,
  y: 0,
  w: 260,
  h: 80,
  label: "PLAY AGAIN",
};

const homeBtn = {
  x: 0,
  y: 0,
  w: 260,
  h: 80,
  label: "RETURN HOME",
};

function initGame() {
  ballX = width / 2;
  ballY = height - 120;
}

function spawnObstacle() {
  obstacles.push({
    x: random(40, width - 40),
    y: -20,
  });
}

const gameBtn = {
  x: 400, // x position (centre of the button)
  y: 550, // y position (centre of the button)
  w: 260, // width
  h: 90, // height
  label: "PRESS HERE", // text shown on the button
};

// ------------------------------
// Main draw function for this screen
// ------------------------------
// drawGame() is called from main.js *only*
// when currentScreen === "game"

function drawGame() {
  // --- Soccer field background ---
  background(60, 160, 75);

  // --- Goal ---
  fill(255);
  rectMode(CENTER);
  rect(width / 2, goalHeight / 2, goalWidth, goalHeight);

  // --- Field lines ---
  stroke(255);
  strokeWeight(6);
  line(-10, height / 2, width + 10, height / 2);
  line(width / 2, -10, width / 2, height + 10);
  noStroke();

  // ===============================
  // STOP GAME IF WON OR LOST
  // ===============================
  if (gameState !== "playing") {
    drawEndScreen();
    return;
  }

  // --- Ball movement ---
  if (keyIsDown(LEFT_ARROW)) ballX -= ballSpeed;
  if (keyIsDown(RIGHT_ARROW)) ballX += ballSpeed;
  if (keyIsDown(UP_ARROW)) ballY -= ballSpeed;
  if (keyIsDown(DOWN_ARROW)) ballY += ballSpeed;

  ballX = constrain(ballX, ballSize / 2, width - ballSize / 2);
  ballY = constrain(ballY, ballSize / 2, height - ballSize / 2);

  // --- Draw ball ---
  fill(255);
  ellipse(ballX, ballY, ballSize);
  fill(0);
  ellipse(ballX, ballY, ballSize / 5);

  // --- Obstacles ---
  if (frameCount % obstacleSpawnRate === 0) {
    spawnObstacle();
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].y += obstacleSpeed;

    fill(255);
    ellipse(obstacles[i].x, obstacles[i].y, obstacleSize);
    fill(0);
    ellipse(obstacles[i].x, obstacles[i].y, obstacleSize / 5);

    // LOSE condition
    let d = dist(ballX, ballY, obstacles[i].x, obstacles[i].y);
    if (d < ballSize / 2 + obstacleSize / 2) {
      gameState = "lose";
    }

    if (obstacles[i].y > height + 20) {
      obstacles.splice(i, 1);
    }
  }

  // ===============================
  // WIN CONDITION (MUST BE LAST)
  // ===============================
  if (
    ballY - ballSize / 2 <= goalHeight &&
    ballX > width / 2 - goalWidth / 2 &&
    ballX < width / 2 + goalWidth / 2
  ) {
    gameState = "win";
  }
}
function drawEndScreen() {
  // Dark overlay
  fill(0, 180);
  rectMode(CORNER);
  rect(0, 0, width, height);

  // Message
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(255);

  if (gameState === "win") {
    text("YOU WON ⚽️", width / 2, height / 2 - 140);
  } else {
    text("YOU LOSE 💥", width / 2, height / 2 - 140);
  }

  // Button positions
  playAgainBtn.x = width / 2;
  playAgainBtn.y = height / 2;

  homeBtn.x = width / 2;
  homeBtn.y = height / 2 + 110;

  drawButton(playAgainBtn);
  drawButton(homeBtn);
}

// ------------------------------
// Button drawing helper
// ------------------------------
// This function is responsible *only* for drawing the button.
// It does NOT handle clicks or game logic.
function drawGameButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  // Check if the mouse is hovering over the button
  // isHover() is defined in main.js so it can be shared
  const hover = isHover({ x, y, w, h });

  noStroke();

  // Change button colour when hovered
  // This gives visual feedback to the player
  fill(
    hover
      ? color(180, 220, 255, 220) // lighter blue on hover
      : color(200, 220, 255, 190), // normal state
  );

  // Draw the button rectangle
  rect(x, y, w, h, 14); // last value = rounded corners

  // Draw the button text
  fill(0);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(label, x, y);

  const playAgainBtn = {
    x: width / 2,
    y: height / 2,
    w: 260,
    h: 80,
    label: "PLAY AGAIN",
  };

  const homeBtn = {
    x: width / 2,
    y: height / 2 + 110,
    w: 260,
    h: 80,
    label: "RETURN HOME",
  };
}

// ------------------------------
// Mouse input for this screen
// ------------------------------
// This function is called from main.js
// only when currentScreen === "game"
function gameMousePressed() {
  if (gameState === "playing") return;

  if (isHover(playAgainBtn)) {
    restartGame();
    gameState = "playing";
  }

  if (isHover(homeBtn)) {
    restartGame();
    gameState = "playing";
    currentScreen = "start";
  }
}

function restartGame() {
  ballX = width / 2;
  ballY = height - 120;
  obstacles = [];
}

// ------------------------------
// Keyboard input for this screen
// ------------------------------
// Allows keyboard-only interaction (accessibility + design)
function gameKeyPressed() {}

// ------------------------------
// Game logic: win or lose
// ------------------------------
// This function decides what happens next in the game.
// It does NOT draw anything.
function triggerRandomOutcome() {
  // random() returns a value between 0 and 1
  // Here we use a 50/50 chance:
  // - less than 0.5 → win
  // - 0.5 or greater → lose
  //
  // You can bias this later, for example:
  // random() < 0.7 → 70% chance to win
  if (random() < 0.5) {
    currentScreen = "win";
  } else {
    currentScreen = "lose";
  }
}
