const games = [
  {
      känslor: ["Glad", "Ledsen", "Arg", "Irriterad"],
      färger: ["Röd", "Blå", "Grön", "Gul"],
      djur: ["Hund", "Katt", "Fågel", "Fisk"],
      frukter: ["Äpple", "Banan", "Apelsin", "Druva"]
  },
  {
      känslor: ["Lycklig", "Arg", "Lugn", "Frustrerad"],
      färger: ["Lila", "Cyan", "Magenta", "Lime"],
      djur: ["Häst", "Ko", "Får", "Get"],
      frukter: ["Mango", "Persika", "Ananas", "Jordgubbe"]
  },
  {
    byggnader: ["Hus", "Skyskrapa", "Stuga", "Slott"],
    media: ["Bok", "Film", "Tidning", "Podcast"],
    jobb: ["Läkare", "Ingenjör", "Lärare", "Brandman"],
    sporter: ["Fotboll", "Basket", "Tennis", "Simning"]
  },
  {
    fordon: ["Bil", "Cykel", "Buss", "Tåg"],
    instrument: ["Gitarr", "Piano", "Trummor", "Fiol"],
    möbler: ["Soffa", "Stol", "Bord", "Säng"],
    kläder: ["Tröja", "Byxor", "Jacka", "Skor"],
  },
  {
    material: ["Sten", "Järn", "Stål", "Glas" ],
    kryddor: ["Dill", "Persilja", "Gräslök", "Koriander" ],
    grönsaker: ["Potatis", "Kålrot", "Morot", "Palsternacka"],
    drycker: ["Kaffe", "Te", "Juice", "Vatten"]
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

      message.textContent = 'Snyggt! 👍 Du hittade en gruppering av 4 ord!';
      message.classList.add('message-show');
      setTimeout(() => {
          message.classList.remove('message-show');
      }, 3000);

      reshuffleRemainingCards();
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

// Start the first game
startNewGame();