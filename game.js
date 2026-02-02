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

function initGame() {
  ballX = width / 2;
  ballY = height - 120;
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

  // Midfield lines
  stroke(255);
  strokeWeight(6);
  line(-10, height / 2, width + 10, height / 2); // horizontal
  line(width / 2, -10, width / 2, height + 10); // vertical
  noStroke();

  // --- Ball movement (player control) ---
  if (keyIsDown(LEFT_ARROW)) ballX -= ballSpeed;
  if (keyIsDown(RIGHT_ARROW)) ballX += ballSpeed;
  if (keyIsDown(UP_ARROW)) ballY -= ballSpeed;
  if (keyIsDown(DOWN_ARROW)) ballY += ballSpeed;

  // Keep the ball on the field
  ballX = constrain(ballX, ballSize / 2, width - ballSize / 2);
  ballY = constrain(ballY, ballSize / 2, height - ballSize / 2);

  // --- Draw the soccer ball (this is where you put it) ---
  fill(255);
  ellipse(ballX, ballY, ballSize);

  // little center dot
  fill(0);
  ellipse(ballX, ballY, ballSize / 5);

  // --- Optional: instructions for testing ---
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text("Use arrow keys to move the ball", width / 2, 30);
}

// ---- Draw the button ----
// We pass the button object to a helper function
drawGameButton(gameBtn);

// ---- Cursor feedback ----
// If the mouse is over the button, show a hand cursor
// Otherwise, show the normal arrow cursor
cursor(isHover(gameBtn) ? HAND : ARROW);

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
}

// ------------------------------
// Mouse input for this screen
// ------------------------------
// This function is called from main.js
// only when currentScreen === "game"
function gameMousePressed() {
  // Only trigger the outcome if the button is clicked
  if (isHover(gameBtn)) {
    triggerRandomOutcome();
  }
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
