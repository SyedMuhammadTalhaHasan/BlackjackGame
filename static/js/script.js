let blackjackgame = {
    'you' : {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer' : {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'card' : ['2','3','4','5','6','7','8','9','10','K','Q','J','A'],
    'cardMap' : {'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'K': 10,'Q': 10,'J': 10,'A': [1,11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'turnsover' : false,
};

const YOU = blackjackgame['you']
const DEALER = blackjackgame['dealer']

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if(blackjackgame['isStand']===false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
}
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackgame['card'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <=21) {
    let cardImage = document.createElement('img');
    cardImage.src = `static/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
}
}

function blackjackDeal(){
    if (blackjackgame['turnsover'] === true) {
    
        blackjackgame['isStand'] = false;
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    
    for (i=0; i<yourImages.length; i++){
        yourImages[i].remove();
    }

    for (i=0; i<dealerImages.length; i++){
        dealerImages[i].remove();
    }

    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').textContent = 0;

    document.querySelector('#your-blackjack-result').style.color = 'white';
    document.querySelector('#dealer-blackjack-result').style.color = 'white';

    document.querySelector('#blackjack-result').textContent = "Let's Play!";
    document.querySelector('#blackjack-result').style.color = 'black';

    blackjackgame['turnsover'] = true;
}
}

function updateScore(card, activePlayer) {
    if (card==='A'){
    if(activePlayer['score'] + blackjackgame['cardMap'][card][1] <=21){
      activePlayer['score'] += blackjackgame['cardMap'][card][1];
    } 
    else {
        activePlayer['score'] += blackjackgame['cardMap'][card][0];
    }
 } 
 else {
    activePlayer['score'] += blackjackgame['cardMap'][card];
}
}


function showScore(activePlayer) {
    if (activePlayer['score'] >21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red'; 
    }
     else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjackgame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackgame['isStand']===true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
    }
    
    blackjackgame['turnsover'] = true;
        let winner = computeWinner();
        showResult(winner);
        }

function computeWinner() {
    let winner;

    if (YOU['score'] <=21) {
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackgame['wins']++;
            winner = YOU;
        }
        else if(YOU['score'] < DEALER['score']) {
            blackjackgame['losses']++;
             winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']) {
            blackjackgame['draws']++;
        }
    }
    else if (YOU['score'] > 21 && DEALER['score']<=21) {
        blackjackgame['losses']++;
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score']>21) {
        blackjackgame['draws']++;
    }
    console.log(blackjackgame);
return winner;
}

function showResult(winner) {
    let message , messagecolor;

    if (blackjackgame['turnsover'] === true) {

    if (winner===YOU) {
        document.querySelector('#wins').textContent = blackjackgame['wins'];
        message = 'You Won!';
        messagecolor = 'green';
        winSound.play();
    }

    else if (winner===DEALER) {
        document.querySelector('#losses').textContent = blackjackgame['losses'];
        message = 'You Lost!';
        messagecolor = 'red';
        lossSound.play();
    }

    else {
        document.querySelector('#draws').textContent = blackjackgame['draws'];
        message = 'You Draw!';
        messagecolor = 'black';
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messagecolor;
}
}