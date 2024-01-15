let rows = 8;
let cols = 8;
let board = [];
let currentPlayer = 1; // 1 for black, -1 for white
let width = 400;
let height = 400;
let w = width / cols;
let h = height / rows;
let player1Count = 2; // Starting count for player 1
let player2Count = 2; // Starting count for player 2
let n_passes = 0;

function setup() {
  createCanvas(width, height + h);
  background(255);
  initializeBoard();
}

function draw() {  
  drawBoard();
  displayPlayerTurn();
  displayStoneCount();

  // Check if no turn is possible, and pass the turn to the other player
  if (noTurnPossible()) {
    currentPlayer = -currentPlayer;
    n_passes++;
  } else {
    n_passes = 0;
  }

  // Check if the game is over
  if (player1Count + player2Count === rows * cols || n_passes === 2) {
    gameOver();
  }
}

function gameOver() {
  // Game over
  noLoop();
  let txt = "Draw!";
  if (player1Count !== player2Count) {
    let winner = player1Count > player2Count ? "Black" : "White";
    txt = winner + " wins!";
  }
  fill(0);
  textSize(40);
  text(txt, width / 2 - 80, height / 2);
}

function initializeBoard() {
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = 0;
    }
  }

  // Initial setup for Reversi
  col_mid = cols/2;
  row_mid = rows/2;
  board[row_mid-1][col_mid-1] = board[row_mid][col_mid] = 1;
  board[row_mid-1][col_mid] = board[row_mid][col_mid-1] = -1;
  
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * w;
      let y = i * h;
        fill(0, 150, 0); // Green color for empty squares
        rect(x, y, w, h);
    }
  }
}

function drawBoard() {

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * w;
      let y = i * h;

      if (board[i][j] === 1) {
        fill(0); // Black color for player 1

      } else {
        fill(255); // White color for player -1
      }

      if (board[i][j] !== 0) {
        ellipse(x + w / 2, y + h / 2, w * 0.8, h * 0.8);
      }
    }
  }
}

function mousePressed() {
  let i = floor(mouseY / (height / rows));
  let j = floor(mouseX / (width / cols));

  if (isValidMove(i, j)) {
    makeMove(i, j);
    currentPlayer *= -1;
    updateStoneCount();
  }
}

function isValidMove(row, col) {
  if (board[row][col] !== 0) {
    return false; // Square is not empty
  }

  // Check if there is at least one opponent piece in any direction
  let validMove = false;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the current position

      let r = row + i;
      let c = col + j;
      let flips = 0;

      while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === -currentPlayer) {
        r += i;
        c += j;
        flips++;
      }

      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer && flips > 0) {
        validMove = true;
        break; // Found at least one valid direction
      }
    }
    if (validMove) break; // Break from the outer loop if a valid move is found
  }

  return validMove;
}


function makeMove(row, col) {
  board[row][col] = currentPlayer;

  // Flip opponent pieces in all valid directions
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the current position

      let r = row + i;
      let c = col + j;
      let flip = [];

      while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === -currentPlayer) {
        flip.push({ row: r, col: c });
        r += i;
        c += j;
      }

      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
        // Flip opponent pieces
        for (let square of flip) {
          board[square.row][square.col] = currentPlayer;
        }
      }
    }
  }
}

function displayPlayerTurn() {
  textSize(20);
  fill(255);
  rect(0, height, width, h);

  let playerTurnText = currentPlayer === 1 ? "Black Turn" : "White Turn";
  fill(0);
  text(playerTurnText, 20, height + h/2);
}

function displayStoneCount() {
  textSize(16);
  fill(0);

  let player1Text = "Black Count: " + player1Count;
  let player2Text = "White Count: " + player2Count;

  text(player1Text, width / 2, height + h - 30);
  text(player2Text, width / 2, height + h - 10);
}

function updateStoneCount() {
  player1Count = 0;
  player2Count = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === 1) {
        player1Count++;
      } else if (board[i][j] === -1) {
        player2Count++;
      }
    }
  }
}

// check if not turn is possible
function noTurnPossible() {
  let turnPossible = false;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++){
      if (isValidMove(i, j)) {
        turnPossible = true;
        break;
      }
    }
    if (turnPossible) break;
  }
  return !turnPossible;
}