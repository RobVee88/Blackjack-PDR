//get dom elements
var btnDeal = document.querySelector('.deal');
var btnHit = document.querySelector('.hit');
var btnStand = document.querySelector('.stand');
var btnDouble = document.querySelector('.double');
var btnSplit = document.querySelector('.split');

var pMessages = document.querySelector('.messages');

var divPlayerPiles = document.querySelector('.player-piles');

//player {
//  name: "",
//  money: 0,
//  piles: [] 
//}
// pile {
//  classname: "",
//  cards: []
//}
// card {
//  suit: suit,
//  value: value,
//  score: [],
//  imgUrl: `../IMG/card_${suit}-${value}.svg`
//}
//player
var player = {
    name: "Player",
    money: 0,
    piles: [] 
}
//dealer = {
//  classname: "",
//  cards: []
//} (dealer is a single pile)
//dealer
var dealer = {
    classname: "dealer",
    cards: []
}


//deck
//Create the deck of cards
var createDeck = () => {
    var deck = [];

    //create a single card
    var createCard = (suit,value,score) => {
        return {
            suit: suit,
            value: value,
            score: score,
            imgUrl: `../img/card_${suit}-${value}.svg`
        }
    }
    //create all cards for a specific suit
    var createSuit = (suit) => {
        for(i = 2;i <= 10; i++) {
            deck.push(createCard(suit,i,[i]));
        }
        deck.push(createCard(suit, "J", [10]));
        deck.push(createCard(suit, "Q", [10]));
        deck.push(createCard(suit, "K", [10]));
        deck.push(createCard(suit, "A", [1,11]));
    }
    createSuit("S");
    createSuit("H");
    createSuit("C");
    createSuit("D");
    return deck;
}


//create pile(classname,playerclass)
// classname: classnane,
// cards: []
// create div with classname
// create p for class score with classname
// create buttons for pile with classname 
// attach to either dealer container or player container
var createPile = (classname) => {
    pile = {
        classname: classname,
        cards: []
    }
    player.piles.push(pile);
    div = document.createElement('div');
    div.className = `${pile.classname}-container`;
    div.innerHTML = `
    <div><p class="${pile.classname} score"></p></div>
    <div class="${pile.classname} images"></div>`;
    divPlayerPiles.appendChild(div);
}

//dealcard = (pile)
// add card to pile
// create a div to contain the img
// create image and attach to img div with pile classname
// attach image div to pile div
// updateScore(pile)
//draw card function
var dealCard = (pile) => {
    var dealtCard = deck.splice(deck.indexOf(deck[Math.floor(Math.random()* deck.length)]),1);
    pile.cards.push(dealtCard[0]);
    imgDiv = document.createElement('div');
    imgDiv.className = `${pile.classname}-img`;
    img = document.createElement('img');
    img.src = dealtCard[0].imgUrl;

    img.style.width = '50px';

    imgDiv.appendChild(img);
    div = document.getElementsByClassName(`${pile.classname} images`);
    div[0].appendChild(imgDiv);
    updateScore(pile);
};

//updateScore(pile)
//  getScore(pile)
//  update score p with pile classname
//  
var updateScore = (pile) => {
    scores = getScores(pile);
    p = document.getElementsByClassName(`${pile.classname} score`);
    if (scores[0] === scores[1]) {
        p[0].textContent = scores[0];
    } else {
        p[0].textContent = scores[0] + " / " + scores[1];
    }
} 

//getScore(pile)
// reduce values from cards array
// return scores (hi and lo)
var getScores = (pile) => {
    playerScoreHigh = 0; 
    playerScoreLow = 0;
    pile.cards.forEach((card) => {
        if(card.value === "A") {
            playerScoreHigh += card.score[1];
            playerScoreLow += card.score[0];
        } else {
            playerScoreHigh += card.score[0];
            playerScoreLow += card.score[0];
        }
    });
    return [playerScoreHigh,playerScoreLow];
}

//checkForBlackJack(pile) returns true or false
//  getScore(pile)
//  check if high score is 21
var checkForBlackJack = (pile) => {
    var scores = getScores(pile);
    scoreHigh = scores[0]; 

    //check blackjack
    if(scoreHigh === 21) {
        return true;
    } 
    return false;
}

//checkFor21OrBust(pile)returns true or false
// check if score is 21
// check if score is over 21
var checkFor21 = (pile) => {
    scores = getScores(pile);
    scoreHigh = scores[0]; 
    scoreLow = scores[1];
    //check for 21
    if(scoreHigh === 21 || scoreLow === 21) {
        return true;
    }
    return false;
}

var checkForBust = (pile) => {
    scores = getScores(pile);
    scoreHigh = scores[0]; 
    scoreLow = scores[1];
    //check for bust
    if(scoreLow > 21) {
        return true;
    }
    return false;
}

//checIfDealerStands() returns true or false
//  check if score is 17 or higher 
//      check if score is lower than all of the player piles
var checkIfDealerStands = () => {
    scores = getScores(dealer);
    scoreHigh = scores[0]; 
    scoreLow = scores[1];
    //check if dealer stands, we will have to make it so it doesnt stand when player has higher score
    if(scoreHigh >= 17 && scoreLow >= 17) {
        return true;
    }
    return false;
}

//
var btnDealHandler = () => {
    createPile('pile-1');
    currentPile = player.piles[0];
    dealCard(currentPile);
    dealCard(dealer);
    dealCard(currentPile);
    dealCard(dealer);
    if(checkForBlackJack(dealer)) {
        pMessages.textContent = "DEALER has blackjack!"
        //reset game
    }
    if(checkForBlackJack(currentPile)) {
        pMessages.textContent = "Player has blackjack!"
        //reset game
    }
}

//
var btnHitHandler = () => {
    dealCard(currentPile);
    if(checkFor21(currentPile)) {
        pMessages.textContent = "Player has 21!!!"
        //reset game
    }
    if(checkForBust(currentPile)) {
        pMessages.textContent = "Player has BUSTED!!!"
        //reset game
    }
}

//
var btnStandHandler = () => {
    while(!checkFor21(dealer) && !checkForBust(dealer) && !checkIfDealerStands()) {
        dealCard(dealer);
    }
    if(checkFor21(dealer)) {
        pMessages.textContent = "Dealer has 21!!!"
        //reset game
    } else if(checkForBust(dealer)) {
        pMessages.textContent = "Dealer has BUSTED!!!"
        //reset game
    } else if(checkIfDealerStands()) {
        pMessages.textContent = "Dealer stands!!!"
        //reset game
    }
}

//I need to create a extra piles of playing cards
//the extra pile needs to take one card from the original pile
//I need to be able to keep track of the scores of each individual pile of cards
var btnSplitHandler = () => {
    //check how many piles there are
    debugger
    var numberOfPiles = player.piles.length;
    var classname = `pile-${numberOfPiles + 1}`
    createPile(classname);
    var card = currentPile.cards.splice(1,1);
    var previousPile = currentPile;
    nextPile();
    currentPile.cards.push(card[0]);
    imgDiv = document.createElement('div');
    imgDiv.className = `${currentPile.classname}-img`;
    img = document.createElement('img');
    img.src = card[0].imgUrl;

    img.style.width = '50px';

    imgDiv.appendChild(img);
    div = document.getElementsByClassName(`${currentPile.classname} images`);
    div[0].appendChild(imgDiv);
    updateScore(currentPile);
    updateScore(previousPile);
}
//when splitting, we need to move between piles
var nextPile = () => {
    //still doesnt work properley
    currentIndex = player.piles.findIndex((pile) => {
        pile.classname == currentPile.classname;
    });
    currentPile = player.piles[currentIndex + 1];
}

//add eventlisteners to buttons
btnDeal.addEventListener('click', btnDealHandler);
btnHit.addEventListener('click', btnHitHandler);
btnStand.addEventListener('click', btnStandHandler);
btnSplit.addEventListener('click', btnSplitHandler);
// btnDouble.addEventListener('click', btnDoubleHandler);

var deck = createDeck();
var currentPile;

