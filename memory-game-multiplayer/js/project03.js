const gameGrid = document.getElementById("gameGrid");
const moveCounter = document.getElementById("moveCounter");
const timer = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const startGameBtn = document.getElementById("startGameBtn");
const gridRowsInput = document.getElementById("gridRows");
const gridColsInput = document.getElementById("gridCols");
const welcomeContainer = document.querySelector(".welcome-container");
const gameContainer = document.querySelector(".game-container");

// Multiplayer Elements
const playerTurnDisplay = document.createElement("h2");
const playerScoreDisplay = document.createElement("p");
playerTurnDisplay.id = "playerTurn";
playerScoreDisplay.id = "playerScore";

gameContainer.insertBefore(playerTurnDisplay, gameGrid);
gameContainer.insertBefore(playerScoreDisplay, restartBtn);

let cards = [];
let flippedCards = [];
let moves = 0;
let timerInterval = null;
let timeElapsed = 0;
let gridRows = 4;
let gridCols = 4;

// Multiplayer Variables
let currentPlayer = 1; // Player 1 starts
let playerScores = { 1: 0, 2: 0 }; // Tracks both players' scores

// List of animal image filenames
const animalImages = [
  "cat.png", "dog.png", "elephant.png", "fox.png", "lion.png",
  "monkey.png", "panda.png", "rabbit.png", "tiger.png", "zebra.png"
];

// 🟢 Start Game Button Clicked
startGameBtn.addEventListener("click", () => {
  gridRows = parseInt(gridRowsInput.value);
  gridCols = parseInt(gridColsInput.value);
  const totalCards = gridRows * gridCols;

  if (
    gridRows >= 2 && gridRows <= 10 &&
    gridCols >= 2 && gridCols <= 10 &&
    totalCards % 2 === 0
  ) {
    welcomeContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    initializeGame();
  } else {
    alert("Invalid grid size! Ensure total number of cards is even and values are between 2 and 10.");
  }
});

// 🟢 Initializes Game
function initializeGame() {
  const totalCards = gridRows * gridCols;
  const uniquePairs = totalCards / 2;

  // Select unique images
  const selectedImages = [];
  for (let i = 0; i < uniquePairs; i++) {
    selectedImages.push(animalImages[i % animalImages.length]);
  }

  const cardPairs = [...selectedImages, ...selectedImages];
  cards = shuffleArray(cardPairs);
  createGrid();
  resetGameInfo();
  startTimer();
  updatePlayerTurn();
}

// 🟢 Shuffles Cards (Fisher-Yates Algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 🟢 Creates Grid
function createGrid() {
  gameGrid.innerHTML = "";
  gameGrid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

  cards.forEach((image) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = image; // Store image filename for matching
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back"><img src="images/${image}" alt="Animal"></div>
      </div>
    `;
    card.addEventListener("click", handleCardClick);
    gameGrid.appendChild(card);
  });
}

// 🟢 Handles Card Clicks
function handleCardClick(e) {
  const clickedCard = e.currentTarget;

  if (
    clickedCard.classList.contains("flipped") ||
    clickedCard.classList.contains("matched") ||
    flippedCards.length === 2
  ) {
    return;
  }

  flippedCards.push(clickedCard);
  clickedCard.classList.add("flipped");

  if (flippedCards.length === 2) {
    moves++;
    moveCounter.textContent = moves;
    checkForMatch();
  }
}

// 🟢 Checks for a Match
function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    // Match found 🎯
    card1.classList.add("matched");
    card2.classList.add("matched");
    playerScores[currentPlayer]++; // Increase score
    flippedCards = [];

    // Check if the game is over
    if (document.querySelectorAll(".card.matched").length === cards.length) {
      clearInterval(timerInterval);
      announceWinner();
    }
  } else {
    // No match, switch turn ❌
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      switchPlayer();
    }, 1000);
  }
  updatePlayerTurn();
}

// 🟢 Switches Player Turn
function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// 🟢 Updates Player Turn & Scores
function updatePlayerTurn() {
  playerTurnDisplay.textContent = `Player ${currentPlayer}'s Turn`;
  playerScoreDisplay.textContent = `Scores: Player 1: ${playerScores[1]} | Player 2: ${playerScores[2]}`;
}

// 🟢 Announces the Winner at the End
function announceWinner() {
  let winnerMessage;
  if (playerScores[1] > playerScores[2]) {
    winnerMessage = "🎉 Player 1 Wins! 🎉";
  } else if (playerScores[2] > playerScores[1]) {
    winnerMessage = "🎉 Player 2 Wins! 🎉";
  } else {
    winnerMessage = "It's a tie! 🤝";
  }
  setTimeout(() => {
    alert(`${winnerMessage}\nFinal Score:\nPlayer 1 - ${playerScores[1]}\nPlayer 2 - ${playerScores[2]}`);
  }, 500);
}

// 🟢 Starts the Timer
function startTimer() {
  timeElapsed = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeElapsed++;
    timer.textContent = formatTime(timeElapsed);
  }, 1000);
}

// 🟢 Formats Time (MM:SS)
function formatTime(seconds) {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
}

// 🟢 Resets Game Information
function resetGameInfo() {
  moves = 0;
  playerScores = { 1: 0, 2: 0 };
  currentPlayer = 1;
  moveCounter.textContent = moves;
  clearInterval(timerInterval);
  timer.textContent = "00:00";
  updatePlayerTurn();
}

// 🟢 Restarts the Game
restartBtn.addEventListener("click", () => {
  gameContainer.classList.add("hidden");
  welcomeContainer.classList.remove("hidden");
  clearInterval(timerInterval);
  resetGameInfo();
});
