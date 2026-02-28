function flipTiles(row, guess) {
  for (let i = 0; i < 5; i++) {
    const tile = row.children[i];

    // Step 1: Flip halfway
    setTimeout(() => {
      tile.classList.add("flip");
    }, i * 400);

    // Step 2: After flip, set color
    setTimeout(() => {
      if (guess[i] === targetWord[i]) tile.classList.add("correct");
      else if (targetWord.includes(guess[i])) tile.classList.add("present");
      else tile.classList.add("absent");

      tile.classList.remove("flip");
    }, i * 400 + 600); // 600ms after starting flip
  }

  // Step 3: After all tiles flip
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
  }, 5 * 400 + 600); // wait for last tile flip
}