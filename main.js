let selectedCards = [];
const gridContainer = document.getElementById('grid-container');
const message = document.getElementById('message');
const newGameButton = document.getElementById('new-game');
const shuffleButton = document.getElementById('shuffle-cards');
const correctAnswersContainer = document.getElementById('correct-answers');
const splashScreen = document.getElementById('splash-screen');
splashScreen.addEventListener("click", () => {
  hideSplashScreen();
  startNewGame();
});
const confettiContainer = document.getElementById('confetti-container');

newGameButton.addEventListener('click', startNewGame);
shuffleButton.addEventListener('click', shuffleExistingCards);

/* TOUCH */
let touchStartX = null
let touchStartY = null;
let touchEndX = 0;
let touchEndY = 0;

gridContainer.addEventListener('touchstart', handleTouchStart, false);
gridContainer.addEventListener('touchmove', handleTouchMove, false);
gridContainer.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchMove(event) {
  const touch = event.touches[0];
  touchEndX = touch.clientX;
  touchEndY = touch.clientY;

  if (selectedCards.length >= 4) return; // Prevent selecting more than 4 cards

  const card = document.elementFromPoint(touchEndX, touchEndY);
  if (card && card.classList.contains('card') && !card.classList.contains('resolved') && !card.classList.contains('selected')) {
  console.log("move to select");

    card.classList.add('selected');
    selectedCards.push(card);
  }
}

function handleTouchEnd() {
  if (selectedCards.length === 4) {
    checkSelection();
  }
  touchStartX = null;
  touchStartY = null;
}

function startNewGame() {
  let filteredGames = window.games;
  
  const selectedDifficulty = parseInt(document.getElementById('difficulty-select').value);
  if (!Number.isNaN(selectedDifficulty)) {
    filteredGames = window.games.filter(game => game.difficulty === selectedDifficulty);
  }
  
  const game = filteredGames[Math.floor(Math.random() * filteredGames.length)];
  const words = Object.entries(game.themes).flatMap(([group, words]) => words.map(word => ({ word, group })));
  shuffle(words);
  gridContainer.innerHTML = '';
  correctAnswersContainer.innerHTML = '';
  message.textContent = '';
  hideSplashScreen();

  document.querySelector(".failed-guesses").classList.add("hidden");
  document.querySelector(".failed-guesses-text").innerHTML = "";

  words.forEach(({ word, group }) => {
    const card = document.createElement('div');
    card.classList.add('card', group);
    card.textContent = word;
    card.dataset.group = group;
    card.addEventListener('click', () => handleCardClick(card));
    scaleFontSizeToCard(card); // Adjust font size based on character count
    gridContainer.appendChild(card);
  });

  selectedCards = [];
}

function handleCardClick(card) {
  if (card.classList.contains('resolved') || touchStartX || touchStartY) {
    return;
  }

  console.log("click", card)

  card.classList.toggle('selected');
  if (card.classList.contains('selected')) {
    selectedCards.push(card);
  } else {
    selectedCards = selectedCards.filter(c => c !== card);
  }

  if (selectedCards.length === 4) {
    checkSelection();
  }
}

function checkSelection() {
  const group = selectedCards[0].dataset.group;
  const isCorrect = selectedCards.every(card => card.dataset.group === group);

  if (isCorrect) {
      const themeName = document.createElement('div');
      themeName.classList.add('theme');
      themeName.textContent = group.charAt(0).toUpperCase() + group.slice(1);

      const itemsList = selectedCards.map(card => card.textContent).join(', ');
      selectedCards.forEach(card => flyCardIntoCompletedZone(card));

      const itemsText = document.createElement('div');
      itemsText.classList.add('items-list');
      itemsText.textContent = itemsList;

      correctAnswersContainer.appendChild(themeName);
      correctAnswersContainer.appendChild(itemsText);

      selectedCards.forEach(card => {
          card.classList.add('resolved');
          card.classList.remove('selected');
          card.remove();
      });

      if (gridContainer.children.length === 0) {
        showSplashScreen();
      } else {
        reshuffleRemainingCards();
      }
  } else {
      selectedCards.forEach(card => {
          card.classList.remove('selected');
          card.classList.add('warn');
      });

      const incorrectCards = [...selectedCards];
      const incorrectText = selectedCards.map(card => card.textContent).join(', ');
      document.querySelector(".failed-guesses").classList.remove("hidden");
      document.querySelector(".failed-guesses-text").innerHTML += `<li>${incorrectText}</li>`;

      setTimeout(() => {
        incorrectCards.forEach(card => card.classList.remove('warn'));
      }, 550);
      showToastFromTop("Fel! 🐝 Prova igen")
  }

  selectedCards = [];
}

function reshuffleRemainingCards() {
  const remainingCards = Array.from(gridContainer.children);
  shuffle(remainingCards);
  gridContainer.innerHTML = '';
  remainingCards.forEach(card => gridContainer.appendChild(card));
  remainingCards.forEach(card => {
      card.style.transition = 'transform 0.2s';
      card.style.transform = 'scale(1.05)';
      setTimeout(() => {
          card.style.transform = 'scale(1)';
      }, 200);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function shuffleExistingCards() {
  const cards = Array.from(gridContainer.children);
  shuffle(cards);
  gridContainer.innerHTML = '';
  cards.forEach(card => gridContainer.appendChild(card));
  cards.forEach(card => {
      card.style.transition = 'transform 0.2s';
      card.style.transform = 'scale(1.05)';
      setTimeout(() => {
          card.style.transform = 'scale(1)';
      }, 200);
  });
}

function showSplashScreen() {
  splashScreen.classList.add('show');
  generateConfetti();
}

function hideSplashScreen() {
  splashScreen.classList.remove('show');
  confettiContainer.innerHTML = '';
}

function scaleFontSizeToCard(card) {
  const maxFontSize = 16; // Maximum font size in pixels
  const minFontSize = 8; // Minimum font size in pixels
  const charCount = card.textContent.length;
  const newFontSize = Math.max(minFontSize, maxFontSize - charCount / 2);
  card.style.fontSize = `${newFontSize}px`;
}

// Start the first game
startNewGame();