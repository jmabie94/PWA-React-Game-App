const cards = document.querySelectorAll(".card");

function flipCard(e) {
    let clickedCard = e.target;
    clickedCard.classList.add("flip");
}

cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

