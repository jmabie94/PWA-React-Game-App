const cards = document.querySelectorAll(".card");
const timeTag = document.querySelector(".time b");
const flipsTag = document.querySelector(".flips b");
const refreshBtn = document.querySelector(".details button");

let confettiPlayers = [];
let disableDeck = false;
let matchedCard = 0;
let cardOne, cardTwo;
let maxTime = 40;
let timer;
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
        let cardOneImg = cardOne.querySelector(".back-view img").src;
        let cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        //console.log('img1, img2 :>> ', img1, img2);
        matchedCard++;
        if(matchedCard === 6 && timeLeft > 0) {
            makeItConfetti();     
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

function shuffleCard() {
    timeLeft = maxTime;
    flips = matchedCard = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    disableDeck = isPlaying = false;
    
    let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        setTimeout(() => {
            imgTag.src = `images/img-${arr[index]}.png`;
        }, 500);
        card.addEventListener("click", flipCard);
    });
}

shuffleCard();

cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

refreshBtn.addEventListener("click", refresh);

function refresh(){
    window.location.reload();
    shuffleCard();
}

function makeItConfetti() {
    var confetti = document.querySelectorAll('.confetti');

    if (!confetti[0].animate) {
        return false;
    }

    for (var i = 0, len = confetti.length; i < len; ++i) {
        var candycorn = confetti[i];
        candycorn.innerHTML = '<div class="rotate"><div class="askew"></div></div>';
        var scale = Math.random() * .7 + .3;
        var player = candycorn.animate([
        { transform: `translate3d(${(i/len*100)}vw,-5vh,0) scale(${scale}) rotate(0turn)`, opacity: scale },
        { transform: `translate3d(${(i/len*100 + 10)}vw,105vh,0) scale(${scale}) rotate(${ Math.random() > .5 ? '' : '-'}2turn)`, opacity: 1 }
        ], {
        duration: Math.random() * 3000 + 5000,
        iterations: Infinity,
        delay: -(Math.random() * 7000)
        });
        
        confettiPlayers.push(player);
        
    }
}
