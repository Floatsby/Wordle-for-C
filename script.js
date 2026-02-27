let words = [];
let targetWord = "";

const board = document.getElementById("game-board");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");

let currentRow = 0;
let currentTile = 0;
let gameOver = false;

// LOAD DICTIONARY
fetch("words.json")
  .then(response => response.json())
  .then(data => {
    words = data;
    startGame();
  })
  .catch(error => {
    console.error("Error loading words:", error);
  });

// DAILY WORD SYSTEM
function getDailyWord() {
  const today = new Date();
  const seed =
    today.getFullYear() * 1000 +
    today.getMonth() * 100 +
    today.getDate();

  return words[seed % words.length];
}

function startGame() {
  targetWord = getDailyWord();
  createBoard();
  createKeyboard();
}

function createBoard() {
  for (let r = 0; r < 6; r++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }

    board.appendChild(row);
  }
}

function createKeyboard() {
  const letters = "QWERTYUIOPASDFGHJKLZXCVBNM";

  for (let letter of letters) {
    const key = document.createElement("button");
    key.textContent = letter;
    key.classList.add("key");
    key.onclick = () => handleInput(letter);
    keyboard.appendChild(key);
  }

  const enter = document.createElement("button");
  enter.textContent = "ENTER";
  enter.classList.add("key");
  enter.onclick = checkRow;
  keyboard.appendChild(enter);

  const del = document.createElement("button");
  del.textContent = "DEL";
  del.classList.add("key");
  del.onclick = deleteLetter;
  keyboard.appendChild(del);
}

function handleInput(letter) {
  if (gameOver) return;

  if (currentTile < 5) {
    const row = board.children[currentRow];
    row.children[currentTile].textContent = letter;
    currentTile++;
  }
}

function deleteLetter() {
  if (currentTile > 0) {
    currentTile--;
    const row = board.children[currentRow];
    row.children[currentTile].textContent = "";
  }
}

function checkRow() {
  if (currentTile !== 5) return;

  const row = board.children[currentRow];
  let guess = "";

  for (let tile of row.children) {
    guess += tile.textContent.toLowerCase();
  }

  if (!words.includes(guess)) {
    message.textContent = "Not in word list";
    return;
  }

  for (let i = 0; i < 5; i++) {
    const tile = row.children[i];

    tile.classList.add("flip");

    setTimeout(() => {
      tile.classList.remove("flip");

      if (guess[i] === targetWord[i]) {
        tile.classList.add("correct");
      } else if (targetWord.includes(guess[i])) {
        tile.classList.add("present");
      } else {
        tile.classList.add("absent");
      }
    }, 250 * i);
  }

  if (guess === targetWord) {
    showWinMessage();
    launchConfetti();
    gameOver = true;
    return;
  }

  currentRow++;
  currentTile = 0;

  if (currentRow === 6) {
    message.textContent = "The word was " + targetWord;
    gameOver = true;
  }
}

function showWinMessage() {
  const messages = [
    "Genius!",
    "Magnificent!",
    "Impressive!",
    "Splendid!",
    "Great!",
    "Phew!"
  ];

  message.textContent = messages[currentRow];
}

// CONFETTI
function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 3 + 2
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of pieces) {
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y += p.speed;

      if (p.y > canvas.height) {
        p.y = 0;
      }
    }

    requestAnimationFrame(update);
  }

  update();
}