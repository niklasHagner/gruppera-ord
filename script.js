const games = [
  {
      emotions: ["Glad", "Ledsen", "Arg", "Irriterad"],
      colors: ["Röd", "Blå", "Grön", "Gul"],
      animals: ["Hund", "Katt", "Fågel", "Fisk"],
      fruits: ["Äpple", "Banan", "Apelsin", "Druva"]
  },
  {
      emotions: ["Lycklig", "Arg", "Lugn", "Frustrerad"],
      colors: ["Lila", "Cyan", "Magenta", "Lime"],
      animals: ["Häst", "Ko", "Får", "Get"],
      fruits: ["Mango", "Persika", "Ananas", "Jordgubbe"]
  },
  {
    buildings: ["Hus", "Skyskrapa", "Stuga", "Slott"],
    media: ["Bok", "Film", "Tidning", "Podcast"],
    jobs: ["Läkare", "Ingenjör", "Lärare", "Brandman"],
    sports: ["Fotboll", "Basket", "Tennis", "Simning"]
  },
  {
    vehicles: ["Bil", "Cykel", "Buss", "Tåg"],
    instruments: ["Gitarr", "Piano", "Trummor", "Fiol"],
    furniture: ["Soffa", "Stol", "Bord", "Säng"],
    clothing: ["Tröja", "Byxor", "Jacka", "Skor"],
  },
  {
    materials: ["Sten", "Järn", "Stål", "Glas" ],
    spices: ["Dill", "Persilja", "Gräslök", "Koriander" ],
    vegetables: ["Potatis", "Kålrot", "Morot", "Palsternacka"],
    beverages: ["Kaffe", "Te", "Juice", "Vatten"]
  }
];

let selectedCards = [];
const gridContainer = document.getElementById('grid-container');
const message = document.getElementById('message');
const newGameButton = document.getElementById('new-game');
const shuffleButton = document.getElementById('shuffle-cards');
const correctAnswersContainer = document.getElementById('correct-answers');

newGameButton.addEventListener('click', startNewGame);
shuffleButton.addEventListener('click', shuffleExistingCards);

function startNewGame() {
  const game = games[Math.floor(Math.random() * games.length)];
  const words = Object.entries(game).flatMap(([group, words]) => words.map(word => ({ word, group })));
  shuffle(words);
  gridContainer.innerHTML = '';
  correctAnswersContainer.innerHTML = '';
  message.textContent = '';

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

      message.textContent = 'Correct! You found a group!';
      reshuffleRemainingCards();
  } else {
      selectedCards.forEach(card => card.classList.remove('selected'));
      message.textContent = 'Incorrect 🙁. Try again';
      setTimeout(() => {
          message.textContent = '';
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

// Start the first game
startNewGame();