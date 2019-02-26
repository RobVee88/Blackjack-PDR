// Deal one up card to each player, followed by a down card to the dealer. 
// Then deal a second up card to each player, followed by the dealer's up card


//link to dom elements (these will change when merging with Daniels beautiful webpages)
var btnDeal = document.querySelector('.deal');
var btnStand = document.querySelector('.stand');
var btnSplit = document.querySelector('.split');
var btnDouble = document.querySelector('.double');
var pPlayerCard = document.querySelector('.player-card');
var pDealerCard = document.querySelector('.dealer-card');
var pMessages = document.querySelector('.messages');


//player, array of cards (objects), score ($), name
var player = {
    cards: [],
    money: 0,
    name: ""
}
//house, array of cards (objects)
var dealer = [];

//Create the deck of cards
var createDeck = () => {
    var deck = [];

    //create a single card
    var createCard = (suit,value,score) => {
        return {
            suit: suit,
            value: value,
            score: score,
            imgUrl: `../IMG/${suit}${value}.jpg`
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

//draw card function
var dealCard = () => {
    var dealtCard = deck.splice(deck.indexOf(deck[Math.floor(Math.random()* deck.length)]),1);
    return dealtCard[0]
};

var deck = createDeck();

//deal starting hands
var dealStartingHands = () => {
    var pCard1 = dealCard();
    var dCard1 = dealCard();
    var pCard2 = dealCard();
    var dCard2 = dealCard();

    //add animations of the dealing of the card here
    player.cards.push(pCard1);
    dealer.push(dCard1);
    player.cards.push(pCard2);
    dealer.push(dCard2);
    pPlayerCard.textContent = pPlayerCard.textContent +  pCard1.suit;
    pPlayerCard.textContent = pPlayerCard.textContent +  pCard1.value;
    pPlayerCard.textContent = pPlayerCard.textContent +  pCard2.suit;
    pPlayerCard.textContent = pPlayerCard.textContent +  pCard2.value;
    pDealerCard.textContent = pDealerCard.textContent +  dCard1.suit;
    pDealerCard.textContent = pDealerCard.textContent +  dCard1.value;
    pDealerCard.textContent = pDealerCard.textContent +  dCard2.suit;
    pDealerCard.textContent = pDealerCard.textContent +  dCard2.value;
    checkBlackJack();
}

//eventhandlers
var btnDealHandler = () => {
    var card = dealCard();
    player.cards.push(card);

    //show cards in player's spot, this will have to go after merge with Daniels stuff
    pPlayerCard.textContent = pPlayerCard.textContent +  card.suit;
    pPlayerCard.textContent = pPlayerCard.textContent +  card.value;

    checkBlackJack();
}

var btnStandHandler = () => {
    while(checkBustStand21() === false) {
        dealerMove();
    }
}

//dealer move
var dealerMove = () => {
    var card = dealCard();
    dealer.push(card);

    //show cards in dealer's spot, this will have to go after merge with Daniels stuff
    pDealerCard.textContent = pDealerCard.textContent +  card.suit;
    pDealerCard.textContent = pDealerCard.textContent +  card.value;
}


var getScores = () => {
    playerScoreHigh = 0; 
    playerScoreLow = 0;
    dealerScoreHigh = 0;
    dealerScoreLow = 0;

    player.cards.forEach((card) => {
        if(card.value === "A") {
            playerScoreHigh += card.score[1];
            playerScoreLow += card.score[0];
        } else {
            playerScoreHigh += card.score[0];
            playerScoreLow += card.score[0];
        }
    });
    dealer.forEach((card) => {
        if(card.value === "A") {
            dealerScoreHigh += card.score[1];
            dealerScoreLow += card.score[0];
        } else {
            dealerScoreHigh += card.score[0];
            dealerScoreLow += card.score[0];
        }
    });
    return [playerScoreHigh,playerScoreLow,dealerScoreHigh,dealerScoreLow];
}

//check for 21 or bust
var checkBlackJack = () => {
    //make array due to aces being 1/11, this makes it so a player can have 2 different scores
    scores = getScores();
    playerScoreHigh = scores[0]; 
    playerScoreLow = scores[1];
    dealerScoreHigh = scores[2];
    dealerScoreLow = scores[3];

    //check for player blackjack
    if(playerScoreHigh === 21 && player.cards.length === 2) {
        pMessages.textContent = "PLAYER HAS BLACKJACK!!";
        return true;
    } 
    //check for dealer blackjack
    if(dealerScoreHigh === 21 && dealer.length === 2) {
        pMessages.textContent = "DEALER HAS BLACKJACK!!";
        return true;
    } 
    return false;
}

var checkBustStand21 = () => {
    scores = getScores();
    playerScoreHigh = scores[0]; 
    playerScoreLow = scores[1];
    dealerScoreHigh = scores[2];
    dealerScoreLow = scores[3];

    if(playerScoreHigh === 21 || playerScoreLow === 21) {
        pMessages.textContent = "PLAYER HAS 21!!";
        return true;
    }
    //check for player bust
    if(playerScoreLow > 21) {
        pMessages.textContent = "PLAYER BUSTS!!";
        return true;
    }
    if(dealerScoreHigh === 21 || dealerScoreLow ===21) {
        pMessages.textContent = "DEALER HAS 21!!";
        return true;
    }
    //check for dealer bust
    if(dealerScoreLow > 21) {
        pMessages.textContent = "DEALER BUSTS!!";
        return true;
    }
    //check if dealer stands, we will have to make it so it doesnt stand when player has higher score
    if(dealerScoreHigh >= 17 || dealerScoreLow >= 17) {
        pMessages.textContent = "DEALER STANDS!";
        return true;
    }
    return false;
}


dealStartingHands();

//event listeners for buttons (these will change when daniels shit is ready)
btnDeal.addEventListener('click', btnDealHandler);
btnStand.addEventListener('click', btnStandHandler);
// btnSplit.addEventListener('click', btnSplitHandler);
// btnDouble.addEventListener('click', btnDoubleHandler);
console.log(deck);
