let selectedCards = [];
const gridContainer = document.getElementById('grid-container');
const newGameButton = document.getElementById('new-game');
const shuffleButton = document.getElementById('shuffle-cards');
const deselectAllCardsButton = document.getElementById('deselect-cards');

newGameButton.addEventListener('click', startNewGame);
shuffleButton.addEventListener('click', shuffleExistingCards);
deselectAllCardsButton.addEventListener('click', deselectAllCards);

const difficultyDisplayEl = document.querySelector('.difficulty-level-display');
const correctAnswersContainer = document.getElementById('correct-answers');
const splashScreen = document.getElementById('splash-screen');
splashScreen.addEventListener("click", () => {
  hideSplashScreen();
  startNewGame();
});
const confettiContainer = document.getElementById('confetti-container');


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
    card.classList.add('selected');
    selectedCards.push(card);
  }
}

function handleTouchEnd(event) {
  if (!touchStartX || !touchEndX) { // Don't even count this as an event since the touch hasn't moved. Let the click event handler run instead!
    return;
  }
  
  if (selectedCards.length === 4) {
    submitFourSelectedCards();
  }
  touchStartX = null;
  touchStartY = null;
}

function startNewGame() {
  let filteredGames = window.games;

  const difficultySelect = document.getElementById('difficulty-select');
  difficultySelect.addEventListener('change', startNewGame);
  const selectedDifficultyInt = parseInt(difficultySelect.options[difficultySelect.selectedIndex].value);
  if (!Number.isNaN(selectedDifficultyInt)) {
    filteredGames = window.games.filter(game => game.difficulty === selectedDifficultyInt);
  }

  const game = filteredGames[Math.floor(Math.random() * filteredGames.length)];
  difficultyDisplayEl.textContent = `${difficultyKeyToText(game.difficulty)}`;
  difficultyDisplayEl.style.transition = 'transform 0.2s';
  difficultyDisplayEl.style.transform = 'scale(1.1)';
  setTimeout(() => {
    difficultyDisplayEl.style.transform = 'scale(1)';
  }, 300);
  

  const words = Object.entries(game.themes).flatMap(([group, words]) => words.map(word => ({ word, group })));
  shuffle(words);
  gridContainer.innerHTML = '';
  correctAnswersContainer.innerHTML = '';
  hideSplashScreen();

  document.querySelector(".failed-guesses").classList.add("hidden");
  document.querySelector(".failed-guesses-text").innerHTML = "";

  words.forEach(({ word, group }) => {
    const card = document.createElement('div');
    card.classList.add('card', escapeGroup(group));
    card.textContent = word;
    card.dataset.group = escapeGroup(group);
    
    card.addEventListener('click', () => handleCardClick(card));

    scaleFontSizeToCard(card); // Adjust font size based on character count
    gridContainer.appendChild(card);
  });

  selectedCards = [];

  // Add shuffle animation to cards
  const cards = Array.from(gridContainer.children);
  cards.forEach(card => {
    const randomNum = Math.random();
    let animationClass;
    if (randomNum < 0.33) {
      animationClass = 'appear-animation-1';
    } else if (randomNum < 0.66) {
      animationClass = 'appear-animation-2';
    } else {
      animationClass = 'appear-animation-3';
    }
    card.classList.add(animationClass);
  });
  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('appear-animation-1', 'appear-animation-2', 'appear-animation-3');
    });
  }, 300);
}

function handleCardClick(card) {
  // if (card.classList.contains('resolved') || touchStartX || touchStartY) { // Prevent running click event if we already ran a touchEnd-event
  //   return;
  // }

  if (card.classList.contains('selected')) {
    selectedCards = selectedCards.filter(c => c !== card);
    card.classList.remove('selected');
  } else {
    if (selectedCards.length >= 4) {
      showToastFromTop("Max 4 kort kan markeras 🫵 ");
      return;
    }
    
    selectedCards.push(card);
    card.classList.add('selected');
  }

  if (selectedCards.length === 0) {
    deselectAllCardsButton.disabled = true;
  } else {
    deselectAllCardsButton.disabled = false;
  }

  if (selectedCards.length === 4) {
    submitFourSelectedCards();
  }
}

function deselectAllCards() {
  selectedCards.forEach(x => x.classList.remove('selected'));
  selectedCards = [];
}

function submitFourSelectedCards() {
  const group = selectedCards[0].dataset.group;
  const isCorrect = selectedCards.every(card => card.dataset.group === group);

  if (isCorrect) {
    const themeName = document.createElement('div');
    themeName.classList.add('theme');
    const groupText = unescapeGroup(group);
    themeName.textContent = groupText.charAt(0).toUpperCase() + groupText.slice(1);


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
    selectedCards = [];

  } else {
    selectedCards.forEach(card => {
      card.classList.add('warn');
    });

    const incorrectCards = [...selectedCards];
    const incorrectText = selectedCards.map(card => card.textContent).join(', ');
    document.querySelector(".failed-guesses").classList.remove("hidden");
    document.querySelector(".failed-guesses-text").innerHTML += `<li>${incorrectText}</li>`;

    setTimeout(() => {
      incorrectCards.forEach(card => card.classList.remove('warn'));
    }, 550);
    showToastFromTop("Fel! 🐝 Prova igen");
  }

}

function escapeGroup(group) {
  return group.replace(/\s+/g, '~');
}

function unescapeGroup(group) {
  return group.replace(/~/g, ' ');
}

function difficultyKeyToText(key) {

  const difficulties = [
    { key: "x", text: "Slumpat" },
    { key: "1", text: "Görlätt" },
    { key: "2", text: "Enkel" },
    { key: "3", text: "Medel" },
    { key: "4", text: "Klurig" },
  ];
  
  const keyString = key.toString();
  const difficulty = difficulties.find(x => x.key === keyString);
  return difficulty ? difficulty.text : '';
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
  const maxFontSize = window.innerWidth < 700 ? 16 : 22; // Maximum font size in pixels
  const minFontSize = 8; // Minimum font size in pixels
  const charCount = card.textContent.length;
  const newFontSize = Math.max(minFontSize, maxFontSize - charCount / 2);
  card.style.fontSize = `${newFontSize}px`;
}

// Start the first game
function startUp() {
  let abTestGroup = "a";
  if (Math.random() < 0.5) {
    abTestGroup = "b";
  }
  startNewGame();
}

startUp();
