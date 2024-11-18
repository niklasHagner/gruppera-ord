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