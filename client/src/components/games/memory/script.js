const cards = document.querySelectorAll(".card");
let disableDeck = false;
let matchedCard = 0;
let cardOne, cardTwo;
let maxTime = 40;
let timeLeft = maxTime;


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
            //console.log('img1, img2 :>> ', img1, img2);
        matchedCard++;
        if(matchedCard == cards.length && timeLeft > 0) {
            return clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

