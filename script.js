document.addEventListener("DOMContentLoaded", function () {

  const board = document.getElementById("game-board");
  const keyboard = document.getElementById("keyboard");
  const message = document.getElementById("message");

  let words = [];
  let targetWord = "";
  let currentRow = 0;
  let currentTile = 0;
  let isGameOver = false;

  fetch("words.json")
    .then(res => res.json())
    .then(data => {
      words = data.words;
      startGame();
    })
    .catch(err => console.error("Error loading words:", err));

  function startGame() {
    targetWord = getDailyWord();
    createBoard();
    createKeyboard();
  }

  function getDailyWord() {
    const today = new Date();
    const dateNumber =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();
    const index = dateNumber % words.length;
    return words[index].trim().toLowerCase();
  }

  function createBoard() {
    board.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      for (let j = 0; j < 5; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        row.appendChild(tile);
      }
      board.appendChild(row);
    }
  }

  function createKeyboard() {
    keyboard.innerHTML = "";
    const letters = "QWERTYUIOPASDFGHJKLZXCVBNM";

    for (let letter of letters) {
      const key = document.createElement("button");
      key.textContent = letter;
      key.addEventListener("click", () => handleKey(letter));
      keyboard.appendChild(key);
    }

    const enter = document.createElement("button");
    enter.textContent = "Enter";
    enter.addEventListener("click", checkRow);
    keyboard.appendChild(enter);

    const del = document.createElement("button");
    del.textContent = "Del";
    del.addEventListener("click", deleteLetter);
    keyboard.appendChild(del);
  }

  function handleKey(letter) {
    if (isGameOver) return;
    if (currentTile < 5) {
      const row = board.children[currentRow];
      const tile = row.children[currentTile];
      tile.textContent = letter.toUpperCase();
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
    if (isGameOver) return;
    if (currentTile !== 5) return;

    const row = board.children[currentRow];
    let guess = "";
    for (let tile of row.children) {
      guess += tile.textContent.toLowerCase();
    }

    flipTiles(row, guess);
  }

  function flipTiles(row, guess) {
    for (let i = 0; i < 5; i++) {
      const tile = row.children[i];
      setTimeout(() => {
        tile.classList.add("flip");

        setTimeout(() => {
          if (guess[i] === targetWord[i]) tile.classList.add("correct");
          else if (targetWord.includes(guess[i])) tile.classList.add("present");
          else tile.classList.add("absent");

          tile.classList.remove("flip");
        }, 300);

      }, i * 500);
    }

    setTimeout(() => {
      if (guess === targetWord) {
        const praises = ["You're the best baby", "Wow that was hot", "The smartest tiny baby", "Winner Winner", "I love you anyway", "You earn one kiss"];
        message.textContent = praises[currentRow];
        isGameOver = true;
      } else {
        currentRow++;
        currentTile = 0;
        if (currentRow === 6) {
          message.textContent = "The word was " + targetWord;
          isGameOver = true;
        }
      }
    }, 3000);
  }

});
