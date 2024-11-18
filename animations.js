function flyCardIntoCompletedZone(card) {
  const rect = card.getBoundingClientRect();
  const clone = card.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.left = `${rect.left + rect.width / 2 - clone.offsetWidth / 2}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.transition = 'all 0.5s ease-in-out';
  document.body.appendChild(clone);

  setTimeout(() => {
    const centerX = window.innerWidth / 2 - clone.offsetWidth / 2;
    clone.style.left = `${centerX}px`;
    clone.style.top = `${correctAnswersContainer.getBoundingClientRect().top}px`;
    clone.style.opacity = '0';
  }, 0);

  setTimeout(() => {
    clone.remove();
  }, 500);
}

function generateConfetti() {
  const confettiCount = 100;
  const colors = ['#ff0', '#f00', '#0f0', '#00f', '#ff00ff', '#00ffff'];

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDelay = `${Math.random() * 3}s`;
    confettiContainer.appendChild(confetti);
  }
}