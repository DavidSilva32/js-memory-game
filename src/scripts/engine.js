document.addEventListener("DOMContentLoaded", function () {
  const emojis = [
    "😺", "😺", "🐵", "🐵", "🐯", "🐯", "🦝", "🦝", "🐼", "🐼", "🐴", "🐴", "🐮", "🐮", "🦁", "🦁"
  ];

  const turnCard = 300;
  const maxAttempts = 10; // Set your desired maximum attempts
  const initialTime = 60; // Set your desired initial time in seconds

  const state = {
    openCards: [],
    remainingAttempts: maxAttempts,
    remainingTime: initialTime,
    countdownTimer: null,
    isPlayingSoundtrack: false,
    soundtrack: null,
  };

  function playSound(sound, volume = 1) {
    let audio = new Audio(`src/sounds/${sound}.mp3`);
    audio.play();
    audio.volume = volume;

    if (sound === "soundtrack") {
      audio.loop = true;
      state.isPlayingSoundtrack = true;
      state.soundtrack = audio;
    }
  }

  function startGame() {
    state.remainingAttempts = maxAttempts;
    state.remainingTime = initialTime;
    state.openCards = [];
    resetCards();
    clearInterval(state.countdownTimer);
    state.countdownTimer = setInterval(updateTimer, 1000);

    // Check if the soundtrack is playing
    console.log("Is playing soundtrack?", state.isPlayingSoundtrack);

    // Play the soundtrack if not playing
    if (!state.isPlayingSoundtrack) {
      playSound("soundtrack", 0.18);
    }
  }

  function updateTimer() {
    console.log("Time left:", state.remainingTime); // Log to console, replace with UI update
    state.remainingTime--;

    if (state.remainingTime <= 0) {
      endGame();
    }
  }

  function handleClick() {
    playSound("flipcard");
    if (state.openCards.length < 2) {
      this.classList.add("boxOpen");
      state.openCards.push(this);
    } else if (state.openCards.length === 2) {
      setTimeout(checkMatch, turnCard);
    }
  }

  function checkMatch() {
    if (state.openCards[0].innerHTML === state.openCards[1].innerHTML) {
      state.openCards[0].classList.add("boxMatch");
      state.openCards[1].classList.add("boxMatch");
    } else {
      state.openCards[0].classList.remove("boxOpen");
      state.openCards[1].classList.remove("boxOpen");
      state.remainingAttempts--;

      if (state.remainingAttempts <= 0) {
        endGame();
        return;
      }
    }

    state.openCards = [];

    if (document.querySelectorAll(".boxMatch").length === emojis.length) {
      endGame();
    }
  }

  function endGame() {
    clearInterval(state.countdownTimer);
    if (state.remainingAttempts <= 0) {
      alert("Game Over! You're out of attempts.");
    } else {
      alert("You've Won!");
    }

    // Stop the soundtrack if playing
    if (state.isPlayingSoundtrack) {
      state.soundtrack.pause();
      state.isPlayingSoundtrack = false;
    }
  }

  function resetCards() {
    document.querySelectorAll(".item").forEach(card => {
      card.classList.remove("boxOpen", "boxMatch");
    });
  }

  // Create all Emoji Cards
  for (let i = 0; i < emojis.length; i++) {
    let box = document.createElement("div");
    box.className = "item";
    box.innerHTML = emojis[i];
    box.onclick = handleClick;
    document.querySelector(".game").appendChild(box);
  }

  startGame(); // Automatically start the game when the page loads
});
