let selectedCards = [];
const gridContainer = document.getElementById('grid-container');
const message = document.getElementById('message');
const newGameButton = document.getElementById('new-game');
const shuffleButton = document.getElementById('shuffle-cards');
const correctAnswersContainer = document.getElementById('correct-answers');
const splashScreen = document.getElementById('splash-screen');
splashScreen.addEventListener("click", hideSplashScreen);
const confettiContainer = document.getElementById('confetti-container');

newGameButton.addEventListener('click', startNewGame);
shuffleButton.addEventListener('click', shuffleExistingCards);

function startNewGame() {
  const game = window.games[Math.floor(Math.random() * window.games.length)];
  const words = Object.entries(game).flatMap(([group, words]) => words.map(word => ({ word, group })));
  shuffle(words);
  gridContainer.innerHTML = '';
  correctAnswersContainer.innerHTML = '';
  message.textContent = '';
  hideSplashScreen();

  words.forEach(({ word, group }) => {
      const card = document.createElement('div');
      card.classList.add('card', group);
      card.textContent = word;
      card.dataset.group = group;
      card.addEventListener('click', () => handleCardClick(card));
      gridContainer.appendChild(card);
  });

  selectedCards = [];
}

function handleCardClick(card) {
  if (card.classList.contains('resolved')) return;

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
  const allSameGroup = selectedCards.every(card => card.dataset.group === group);

  if (allSameGroup) {
      const themeName = document.createElement('div');
      themeName.classList.add('theme');
      themeName.textContent = group.charAt(0).toUpperCase() + group.slice(1);

      const itemsList = selectedCards.map(card => card.textContent).join(', ');

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

      message.textContent = 'Rätt! Du hittade en gruppering av 4 ord!';
      message.classList.add('message-show');
      setTimeout(() => {
          message.classList.remove('message-show');
      }, 3000);

      if (gridContainer.children.length === 0) {
          showSplashScreen();
      } else {
          reshuffleRemainingCards();
      }
  } else {
      selectedCards.forEach(card => card.classList.remove('selected'));
      message.textContent = 'Fel 🙁. Prova igen';
      message.classList.add('message-show');
      setTimeout(() => {
          message.classList.remove('message-show');
      }, 3000);
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

function generateConfetti() {
  for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confettiContainer.appendChild(confetti);
  }
}

// Start the first game
startNewGame();