const cards = document.querySelectorAll(".card");
const timeTag = document.querySelector(".time b");
const flipsTag = document.querySelector(".flips b");

let disableDeck = false;
let matchedCard = 0;
let cardOne, cardTwo;
let maxTime = 40;
let timer = 0;
let timeLeft = maxTime;
let isPlaying = false;
let flips = 0;

function flipCard({target: clickedCard}) {
    if(!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000);
    }
    if(clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
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
        cardOne = cardTwo = "";  //seting both cards back to question mark
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

function initTimer() {
    if(timeLeft <= 0) {
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerText = timeLeft;
}


cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

