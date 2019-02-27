//get dom elements
var btnDeal = document.querySelector('.deal');
var btnHit = document.querySelector('.hit');
var btnStand = document.querySelector('.stand');
var btnDouble = document.querySelector('.double');
var btnSplit = document.querySelector('.split');

var pMessages = document.querySelector('.game-message');

var divPlayerPiles = document.querySelector('.player-piles');
var divDealerImages = document.querySelector('.dealer-pile > .images');


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
    money: 5000,
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
        cards: [],
        bet: 0,
        active: true
    }
    player.piles.push(pile);
    div = document.createElement('div');
    div.className = `${pile.classname}-container player-card-pile`;
    div.innerHTML = `
    <div class="score-container"><p class="${pile.classname} score"></p></div>
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
    //if its not the first card 
    //add class card-relative and increase the offset by a set amount for each card before it
    imgDiv.className = `${pile.classname}-img card`;
    if(pile.cards.length > 1) {
        imgDiv.className += ' card-relative';
        imgDiv.right = `${(pile.cards.length - 1) * 20}px`;
    }
    img = document.createElement('img');
    img.src = dealtCard[0].imgUrl;

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
        if(scores[0] < 21) {
            p[0].textContent = scores[0] + " / " + scores[1];
        } else {
            p[0].textContent = scores[1];
        }
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
    debugger
    scores = getScores(pile);
    scoreHigh = scores[0]; 
    scoreLow = scores[1];
    //check for bust
    if(scoreLow > 21) {
        return true;
    } else {
        return false;
    }
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
    resetGame();
    createPile('pile-1');
    currentPile = player.piles[0];
    dealCard(currentPile);
    dealCard(dealer);
    dealCard(currentPile);
    dealCard(dealer);
    if(checkForBlackJack(dealer)) {
        //we wont check this until player has finished
        pMessages.textContent = "DEALER has blackjack!"
        //reset game
    }
    if(checkForBlackJack(currentPile)) {
        pMessages.textContent = "Player has blackjack!"
        currentPile.active = false;
        displayRightButtons();
        //reset game
    }
    displayRightButtons();
}

//
var btnHitHandler = () => {
    dealCard(currentPile);
    if(checkFor21(currentPile)) {
        pMessages.textContent = "Player has 21!!!"
        currentPile.active = false;
        activePiles = player.piles.filter((pile) => { return pile.active});
        if(activePiles.length === 0) {
            displayRightButtons();
            dealerMove();
        } else {
            nextPile();
        }
    }
    if(checkForBust(currentPile)) {
        pMessages.textContent = "Player has BUSTED!!!"
        currentPile.active = false;
        activePiles = player.piles.filter((pile) => {return pile.active});
        if(activePiles.length === 0) {
            displayRightButtons();
            dealerMove();
        } else {
            nextPile();
        }
    }
    displayRightButtons();
}

//dealer move
var dealerMove = () => {
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

//
var btnStandHandler = () => {
    currentPile.active = false;
    activePiles = player.piles.filter((pile) => {return pile.active});
    if(activePiles.length === 0) {
        displayRightButtons();
        dealerMove();
    } else {
        nextPile();
    }
}



//I need to create a extra piles of playing cards
//the extra pile needs to take one card from the original pile
//I need to be able to keep track of the scores of each individual pile of cards
var btnSplitHandler = () => {
    //check how many piles there are
    var numberOfPiles = player.piles.length;
    //add classname player-pile
    var classname = `pile-${numberOfPiles + 1}`
    createPile(classname);
    var card = currentPile.cards.splice(1,1);
    //get rid of image from first pile
    var images = document.getElementsByClassName(`${currentPile.classname} images`);
    images[0].removeChild(images[0].childNodes[1]);
    var previousPile = currentPile;

    nextPile();
    currentPile.cards.push(card[0]);
    var imgDiv = document.createElement('div');
    imgDiv.className = `${currentPile.classname}-img`;
    var img = document.createElement('img');
    img.src = card[0].imgUrl;

    img.style.width = '50px';

    imgDiv.appendChild(img);
    div = document.getElementsByClassName(`${currentPile.classname} images`);
    div[0].appendChild(imgDiv);
    
    updateScore(currentPile);
    updateScore(previousPile);
    previousPileF();
    displayRightButtons();
}
//when splitting, we need to move between piles
var nextPile = () => {
    if(player.piles.length > 1) {
            currentIndex = player.piles.findIndex((pile) => {
                return pile.classname == currentPile.classname;
            });
            currentPile = player.piles[currentIndex + 1];
    }
    displayRightButtons();
}
var previousPileF = () => {
    if(player.piles.length > 1) {
        currentIndex = player.piles.findIndex((pile) => {
            return pile.classname == currentPile.classname;
        });
        currentPile = player.piles[currentIndex - 1];
    }   
    displayRightButtons();
}

//reset game
var resetGame = () => {
    //destroy/empty all piles
    while(dealer.cards.length > 0) {
        dealer.cards.pop();
    };
    while(player.piles.length > 0) {
        pile = player.piles.pop();
    };
    //destroy all card images
    while(divDealerImages.firstChild) {
        divDealerImages.removeChild(divDealerImages.firstChild);
    }
    while(divPlayerPiles.firstChild) {
        divPlayerPiles.removeChild(divPlayerPiles.firstChild);
    }
    pMessages.textContent = "";
}

//check which buttons to display
var displayRightButtons = () => {
    //if no active piles, only display deal
    //if active piles
        //if display hit & stand
            //if currentpile.cards.length = 2 and have same value 
                //display split
            //if currentpile value = 9,10 or 11
                //display double
    activePiles = player.piles.filter((pile) => {return pile.active});
    if(activePiles.length === 0) {
        showButtons(btnDeal);
        hideButtons(btnStand,btnHit,btnSplit,btnDouble);
    } else {
        showButtons(btnHit,btnStand);
        hideButtons(btnDeal,btnSplit,btnDouble);
        if(currentPile.cards.length === 2 && (currentPile.cards[0].score[0] === currentPile.cards[1].score[0])) {
            showButtons(btnSplit);
        }
        var scores = getScores(currentPile);
        if((scores[0] > 8 && scores[0] < 12)|| (scores[1] > 8 && scores[1] < 12)) {
            showButtons(btnDouble);
        }
    }
}
//to hide buttons
var hideButtons = (...buttons) => {
	buttons.forEach((button) => {
        button.style.visibility = 'hidden';
    });
}
var showButtons = (...buttons) => {
	buttons.forEach((button) => {
        button.style.visibility = 'visible';
    });
}

//add eventlisteners to buttons
btnDeal.addEventListener('click', btnDealHandler);
btnHit.addEventListener('click', btnHitHandler);
btnStand.addEventListener('click', btnStandHandler);
btnSplit.addEventListener('click', btnSplitHandler);
// btnDouble.addEventListener('click', btnDoubleHandler);

var deck = createDeck();
var currentPile;

displayRightButtons();
