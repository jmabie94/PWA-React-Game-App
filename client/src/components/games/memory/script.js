const cards = document.querySelectorAll(".card");

let cardOne, cardTwo;

function flipCard(e) {    
    let clickedCard = e.target;
    if(clickedCard !== cardOne){
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;

        let cardOneImg = cardOne.querySelector(".back-view img").src;
        let cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
            console.log('img1, img2 :>> ', img1, img2);
    }
}

cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

