const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status');
const scoreboardElement = document.getElementById('scoreboard');
const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');

const xBox = document.getElementById('x-box');
const oBox = document.getElementById('o-box');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = false;
let mode = null;
let difficulty = "easy";
let userSymbol = "X";
let scores = { X: 0, O: 0, Draw: 0 };

function renderBoard() {
  boardElement.innerHTML = '';
  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.textContent = cell;
    cellElement.addEventListener('click', () => handleCellClick(index));
    boardElement.appendChild(cellElement);
  });
  updateTurnBox();
}

function handleCellClick(index) {
  if (!gameActive || board[index]) return;
  clickSound.play();
  board[index] = currentPlayer;
  renderBoard();

  if (checkWinner()) {
    statusElement.textContent = `${currentPlayer} Wins 🎉`;
    scores[currentPlayer]++;
    winSound.play();
    gameActive = false;
    animateWin();
    updateScoreboard();
  } else if (board.every(cell => cell)) {
    statusElement.textContent = `It's a Draw 🤝`;
    scores.Draw++;
    gameActive = false;
    animateDraw();
    updateScoreboard();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `Player ${currentPlayer}'s Turn`;
    updateTurnBox();

    if (mode === 'computer' && currentPlayer !== userSymbol) {
      computerMove();
    }
  }
}

function computerMove() {
  let move;
  if (difficulty === "easy") {
    let available = board.map((val, idx) => val ? null : idx).filter(v => v !== null);
    move = available[Math.floor(Math.random() * available.length)];
  } else {
    // Hard mode = try to win or block
    move = bestMove();
  }
  setTimeout(() => handleCellClick(move), 500);
}

function bestMove() {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = currentPlayer;
      if (checkWinner()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = currentPlayer === "X" ? "O" : "X";
      if (checkWinner()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  let available = board.map((val, idx) => val ? null : idx).filter(v => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function checkWinner() {
  const winningCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winningCombos.some(combo => {
    const [a, b, c] = combo;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function animateWin() {
  document.querySelectorAll('.cell').forEach(c => {
    if (c.textContent === currentPlayer) {
      c.classList.add("win-animation");
    }
  });
}

function animateDraw() {
  document.querySelectorAll('.cell').forEach(c => {
    c.textContent += " 😐";
  });
}

function startNewGame(selectedMode) {
  mode = selectedMode;
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  statusElement.textContent = `Player ${currentPlayer}'s Turn`;
  renderBoard();
}

function resetScore() {
  scores = { X: 0, O: 0, Draw: 0 };
  updateScoreboard();
}

function updateScoreboard() {
  scoreboardElement.textContent = `X: ${scores.X} | O: ${scores.O} | Draws: ${scores.Draw}`;
}

function setDifficulty(level) {
  difficulty = level;
}

function chooseSymbol(symbol) {
  userSymbol = symbol;
  statusElement.textContent = `You chose ${symbol}`;
}

function updateTurnBox() {
  if (currentPlayer === "X") {
    xBox.classList.add("active");
    oBox.classList.remove("active");
  } else {
    oBox.classList.add("active");
    xBox.classList.remove("active");
  }
}

renderBoard();
