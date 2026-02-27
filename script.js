// ===== WORD LIST =====
const WORDS = [
    "MANGO","ROBOT","PLANE","BRICK",
    "SHINE","CLOUD","LIGHT","STONE"
];

// ===== DAILY WORD =====
function getDailyWord() {
    const today = new Date();
    const start = new Date(2024, 0, 1);
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return WORDS[diff % WORDS.length];
}

let secretWord = getDailyWord();
let currentRow = 0;
let currentGuess = "";
let maxRows = 6;
let gameOver = false;

// ===== CREATE BOARD =====
function createBoard() {
    const board = document.getElementById("board");

    for (let i = 0; i < maxRows; i++) {
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

createBoard();

// ===== CREATE KEYBOARD =====
const keyboardLayout = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ENTERZXCVBNMBACK"
];

function createKeyboard() {
    const keyboard = document.getElementById("keyboard");

    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("key-row");

        if (row === "ENTERZXCVBNMBACK") {
            const enter = createKey("ENTER", true);
            rowDiv.appendChild(enter);

            "ZXCVBNM".split("").forEach(letter => {
                rowDiv.appendChild(createKey(letter));
            });

            const back = createKey("⌫", true);
            back.dataset.key = "BACKSPACE";
            rowDiv.appendChild(back);

        } else {
            row.split("").forEach(letter => {
                rowDiv.appendChild(createKey(letter));
            });
        }

        keyboard.appendChild(rowDiv);
    });
}

function createKey(letter, large=false) {
    const key = document.createElement("div");
    key.textContent = letter;
    key.classList.add("key");
    if (large) key.classList.add("large");

    key.dataset.key = letter;

    key.addEventListener("click", () => handleKey(letter));
    return key;
}

createKeyboard();

// ===== HANDLE KEY INPUT =====
function handleKey(key) {
    if (gameOver) return;

    if (key === "ENTER") {
        submitGuess();
        return;
    }

    if (key === "⌫" || key === "BACKSPACE") {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
        return;
    }

    if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
        currentGuess += key;
        updateBoard();
    }
}

// Physical keyboard support
document.addEventListener("keydown", e => {
    if (e.key === "Enter") handleKey("ENTER");
    else if (e.key === "Backspace") handleKey("BACKSPACE");
    else handleKey(e.key.toUpperCase());
});

// ===== UPDATE BOARD WHILE TYPING =====
function updateBoard() {
    const row = document.getElementsByClassName("row")[currentRow];
    const tiles = row.children;

    for (let i = 0; i < 5; i++) {
        tiles[i].textContent = currentGuess[i] || "";
    }
}

// ===== SUBMIT GUESS =====
function submitGuess() {
    if (currentGuess.length !== 5) {
        showPopup("Not enough letters");
        return;
    }

    if (!WORDS.includes(currentGuess)) {
        showPopup("Not in word list");
        return;
    }

    const row = document.getElementsByClassName("row")[currentRow];
    const tiles = row.children;

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            tiles[i].classList.add("flip");

            const letter = currentGuess[i];
            const key = document.querySelector(`[data-key="${letter}"]`);

            if (letter === secretWord[i]) {
                tiles[i].classList.add("correct");
                key.classList.add("correct");
            } else if (secretWord.includes(letter)) {
                tiles[i].classList.add("present");
                key.classList.add("present");
            } else {
                tiles[i].classList.add("absent");
                key.classList.add("absent");
            }
        }, i * 300);
    }

    if (currentGuess === secretWord) {
        setTimeout(() => {
            showPopup(getWinMessage(currentRow));
            launchConfetti();
            gameOver = true;
        }, 1600);
    }

    currentRow++;
    currentGuess = "";

    if (currentRow === maxRows && !gameOver) {
        setTimeout(() => {
            showPopup("Word was " + secretWord);
            gameOver = true;
        }, 1600);
    }
}

// ===== POPUP =====
function showPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 100);
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 500);
    }, 2000);
}

function getWinMessage(rowNumber) {
    return [
        "Genius",
        "Magnificent",
        "Impressive",
        "Splendid",
        "Great",
        "Phew"
    ][rowNumber];
}

// ===== CONFETTI =====
function launchConfetti() {
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor =
            ["#538d4e","#b59f3b","#ffffff"]
            [Math.floor(Math.random()*3)];
        confetti.style.animationDuration =
            (Math.random()*3+2)+"s";
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}
