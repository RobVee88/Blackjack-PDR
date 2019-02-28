//get dom elements
var btnDeal = document.querySelector('.deal');
var btnHit = document.querySelector('.hit');
var btnStand = document.querySelector('.stand');
var btnDouble = document.querySelector('.double');
var btnSplit = document.querySelector('.split');
var btnAllIn = document.querySelector('.btn-allin');
var btnBet5 = document.querySelector('.btn-5');
var btnBet25 = document.querySelector('.btn-25');
var btnBet50 = document.querySelector('.btn-50');
var btnBet100 = document.querySelector('.btn-100');
var btnBet500 = document.querySelector('.btn-500');

var pMessages = document.querySelector('.game-message');
var pBetAmount = document.querySelector('.current-bet-amount');
var pPlayerScore = document.querySelector('.player-score > p');

var pScores = document.querySelectorAll('.score');

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
    busted: false,
    cards: []
}


//deck
//Create the deck of cards
var createDeck = () => {
    var deck = [];

    //create a single card
    var createCard = (suit, value, score) => {
        return {
            suit: suit,
            value: value,
            score: score,
            imgUrl: `../img/card_${suit}-${value}.svg`
        }
    }
    //create all cards for a specific suit
    var createSuit = (suit) => {
        for (i = 2; i <= 10; i++) {
            deck.push(createCard(suit, i, [i]));
        }
        deck.push(createCard(suit, "J", [10]));
        deck.push(createCard(suit, "Q", [10]));
        deck.push(createCard(suit, "K", [10]));
        deck.push(createCard(suit, "A", [1, 11]));
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
        active: true,
        busted: false,
        winner: false
    }
    pile.bet = bet;
    player.piles.push(pile);
    div = document.createElement('div');
    div.className = `${pile.classname}-container player-card-pile`;
    div.innerHTML = `
    <div class="${pile.classname} images"></div>
    <div class="score-container"><p class="${pile.classname} score"></p></div>`;
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
    if(pile.active || pile.classname === 'dealer') {
        var dealtCard = deck.splice(deck.indexOf(deck[Math.floor(Math.random() * deck.length)]), 1);
        pile.cards.push(dealtCard[0]);
        if (deck.length === 0) {
            deck = createDeck();
            console.log("New deck!");
        }
        imgDiv = document.createElement('div');
        //if its not the first card 
        //add class card-relative and increase the offset by a set amount for each card before it
        //not working yet
        imgDiv.className = `${pile.classname}-img card`;
        if (pile.cards.length > 1) {
            imgDiv.style.left = `${(pile.cards.length - 1) * 20}px`;
        }
        img = document.createElement('img');
        if((pile.classname === 'dealer') && pile.cards.length === 2) {
            img.src = "/img/card-reverse-1.svg";
            img.className += ' reverse-card';
        } else {
            img.src = dealtCard[0].imgUrl;
        }
        imgDiv.appendChild(img);
        div = document.getElementsByClassName(`${pile.classname} images`);
        div[0].appendChild(imgDiv);
        updateScore(pile);
    }
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
        if (scores[0] < 21) {
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
    var reverse = document.querySelector('.reverse-card');
    if(pile.classname === 'dealer' && reverse != null ) {
        if(pile.cards[0].value ==="A") {
            playerScoreHigh += pile.cards[0].score[1];
            playerScoreLow += pile.cards[0].score[0];
        } else {
            playerScoreHigh += pile.cards[0].score[0];
            playerScoreLow += pile.cards[0].score[0];
        }
    }
    else {
        pile.cards.forEach((card) => {
            if (card.value === "A") {
                playerScoreHigh += card.score[1];
                playerScoreLow += card.score[0];
            } else {
                playerScoreHigh += card.score[0];
                playerScoreLow += card.score[0];
            }
        });
    }
    return [playerScoreHigh, playerScoreLow];
}

//checkForBlackJack(pile) returns true or false
//  getScore(pile)
//  check if high score is 21
var checkForBlackJack = (pile) => {
    var scores = getScores(pile);
    scoreHigh = scores[0];

    //check blackjack
    if (scoreHigh === 21) {
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
    if (scoreHigh === 21 || scoreLow === 21) {
        return true;
    }
    return false;
}

var checkForBust = (pile) => {
    scores = getScores(pile);
    scoreHigh = scores[0];
    scoreLow = scores[1];
    //check for bust
    if (scoreLow > 21) {
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
    if (scoreHigh >= 17 && scoreLow >= 17) {
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
    if (checkForBlackJack(currentPile)) {
        pMessages.textContent = "Player has blackjack! Player wins!"
        currentPile.active = false;
        player.money += (pile.bet * 2.5);
        pPlayerScore.textContent = player.money;
        bet = 0;
        savePoints();
        hideAllButtons();
        setTimeout(resetGame, 3000);
        //reset game
    } else if (checkForBlackJack(dealer)) {
        //we wont check this until player has finished
        pMessages.textContent = "Dealer has blackjack! Better luck next time.."
        //reset game
        bet = 0;
        hideAllButtons();
        savePoints();
        setTimeout(resetGame, 3000);
    }
    displayRightButtons();
}

//
var btnHitHandler = () => {
    dealCard(currentPile);
    currentPile.bet = bet;
    if (checkFor21(currentPile)) {
        pMessages.textContent = "Player has 21!!!"
        currentPile.active = false;
        activePiles = player.piles.filter((pile) => { return pile.active });
        if (activePiles.length === 0) {
            hideAllButtons();
            setTimeout(dealerMove, 2000);
        } else {
            currentPile.winner = true;
            settleBet(pile);
            nextPile();
        }
    }
    if (checkForBust(currentPile)) {
        pMessages.textContent = "Player busts! Dealer wins."
        currentPile.active = false;
        currentPile.busted = true;
        activePiles = player.piles.filter((pile) => { return pile.active });
        if (activePiles.length === 0) {
            hideAllButtons();
            setTimeout(dealerMove, 2000);
        } else {
            savePoints();
            nextPile();
        }
    }
    displayRightButtons();
}

//settle bet
var settleBet = (pile) => {
    if (pile.winner === true) {
        player.money += (pile.bet * 2);
        pPlayerScore.textContent = player.money;
        currentPile.active = false;
        bet = 0;
        savePoints();
    } else if (pile.winner === false) {
        currentPile.active = false;
        bet = 0;
        savePoints();
    }
}

//choose which score plays
var playingScore = (score1, score2) => {
    if (score1 < 22) {
        return score1;
    } else {
        return score2;
    }
}

//dealer move
var dealerMove = () => {
    //???
    var reversedCard = document.querySelector('.reverse-card');
    if(reversedCard != null) {
        reversedCard.src = dealer.cards[1].imgUrl;
        reversedCard.classList.remove('reverse-card');
    }
    nonBustedPiles = player.piles.filter((pile) => {
        return pile.busted === false;
    });
    if (nonBustedPiles.length > 0) {
        while (!checkFor21(dealer) && !checkForBust(dealer) && !checkIfDealerStands()) {
            dealCard(dealer);
        }

        if (checkFor21(dealer)) {
            pMessages.textContent = "Dealer has 21!!!"
            player.piles.forEach((pile) => {
                var playerScores = getScores(pile);
                if (!pile.busted) {
                    if (playerScores[0] === 21 || playerScores[1] === 21) {
                        //pile.winner = false;
                        //push??
                        //settleBet(pile);
                        pMessages.textContent = "Push!";
                        player.money += pile.bet;
                        pPlayerScore.textContent = player.money;
                        bet = 0;
                        savePoints();
                    }
                } else {
                    pile.winner = false;
                    settleBet(pile);
                }
            });
            setTimeout(resetGame, 3000);
        } else if (checkForBust(dealer)) {
            pMessages.textContent = "Dealer busts!!! Player wins!"
            player.piles.forEach((pile) => {
                if (!pile.busted) {
                    pile.winner = true;
                    settleBet(pile);
                } else {
                    pile.winner = false;
                    settleBet(pile);
                }
            });
            setTimeout(resetGame, 3000);
        } else if (checkIfDealerStands()) {
            pMessages.textContent = "Dealer stands."
            player.piles.forEach((pile) => {
                var playerScores = getScores(pile);
                var dealerScores = getScores(dealer);
                if (!pile.busted) {
                    if (playingScore(playerScores[0], playerScores[1]) > playingScore(dealerScores[0], dealerScores[1])) {
                        pile.winner = true;
                        pMessages.textContent = "Player wins!"
                        settleBet(pile);
                    } else if (playingScore(playerScores[0], playerScores[1]) < playingScore(dealerScores[0], dealerScores[1])) {
                        pile.winner = false;
                        pMessages.textContent = "Dealer wins."
                        settleBet(pile);
                    } else if (playingScore(playerScores[0], playerScores[1]) === playingScore(dealerScores[0], dealerScores[1])) {
                        pMessages.textContent = "Push!";
                        player.money += pile.bet;
                        pPlayerScore.textContent = player.money;
                        bet = 0;
                        savePoints();
                    }
                } else {
                    pile.winner = false;
                    pMessages.textContent = "Dealer wins."
                    settleBet(pile);
                }
            });
            setTimeout(resetGame, 3000);
        }
    } else {
        player.piles.forEach((pile) => {
            pile.winner = false;
            settleBet(pile);
        });
        setTimeout(resetGame, 3000);
    }
}

//
var btnStandHandler = () => {
    if(currentPile.active) {
        currentPile.active = false;
        currentPile.bet = bet;
        activePiles = player.piles.filter((pile) => { return pile.active });
        if (activePiles.length === 0) {
            displayRightButtons();
            dealerMove();
        } else {
            nextPile();
        }
    }
}



//I need to create a extra piles of playing cards
//the extra pile needs to take one card from the original pile
//I need to be able to keep track of the scores of each individual pile of cards
var btnSplitHandler = () => {
    currentPile.bet = bet;
    //check how many piles there are
    var numberOfPiles = player.piles.length;
    //add classname player-pile
    var classname = `pile-${numberOfPiles + 1}`
    createPile(classname);
    var card = currentPile.cards.splice(1, 1);
    //get rid of image from first pile
    var images = document.getElementsByClassName(`${currentPile.classname} images`);
    images[0].removeChild(images[0].childNodes[1]);
    var previousPile = currentPile;

    nextPile();
    currentPile.cards.push(card[0]);
    var imgDiv = document.createElement('div');
    imgDiv.className = `${currentPile.classname}-img card`;
    var img = document.createElement('img');
    img.src = card[0].imgUrl;

    // img.style.width = '50px';

    imgDiv.appendChild(img);
    div = document.getElementsByClassName(`${currentPile.classname} images`);
    div[0].appendChild(imgDiv);

    dealCard(previousPile);
    dealCard(currentPile);
    updateScore(currentPile);
    updateScore(previousPile);
    previousPileF();
    displayRightButtons();
}

//double
var btnDoubleHandler = () => {
    player.money -= bet;
    pPlayerScore.textContent = player.money;
    bet = bet * 2;
    currentPile.bet = bet;
    pBetAmount.textContent = bet;
    dealCard(currentPile);
    currentPile.active = false;
    activePiles = player.piles.filter((pile) => { return pile.active });
    if (activePiles.length === 0) {
        displayRightButtons();
        dealerMove();
    } else {
        nextPile();
    }
}

//when splitting, we need to move between piles
var nextPile = () => {
    if (player.piles.length > 1) {
        currentIndex = player.piles.findIndex((pile) => {
            return pile.classname == currentPile.classname;
        });
        currentPile = player.piles[currentIndex + 1];
    }
    bet = currentPile.bet;
    displayRightButtons();
}
var previousPileF = () => {
    if (player.piles.length > 1) {
        currentIndex = player.piles.findIndex((pile) => {
            return pile.classname == currentPile.classname;
        });
        currentPile = player.piles[currentIndex - 1];
    }
    bet = currentPile.bet;
    displayRightButtons();
}

//reset game
var resetGame = () => {
    //destroy/empty all piles
    while (dealer.cards.length > 0) {
        dealer.cards.pop();
    };
    while (player.piles.length > 0) {
        pile = player.piles.pop();
    };
    //destroy all card images
    while (divDealerImages.firstChild) {
        divDealerImages.removeChild(divDealerImages.firstChild);
    }
    while (divPlayerPiles.firstChild) {
        divPlayerPiles.removeChild(divPlayerPiles.firstChild);
    }
    pMessages.textContent = "";
    pBetAmount.textContent = 0;
    displayRightButtons();
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
    //if no cards in any pile, hide score displays
    if(dealer.cards.length === 0) {
        pScores.forEach((p) => {
            p.style.visibility = 'hidden';
        });
    } else {
        pScores.forEach((p) => {
            p.style.visibility = 'visible';
        }); 
    }
    if (player.piles.length === 0) {
        showButtons(btnAllIn, btnBet5, btnBet25, btnBet50, btnBet100, btnBet500);
        hideButtons(btnStand, btnHit, btnSplit, btnDouble, btnDeal);
        if (bet > 0) {
            showButtons(btnDeal);
        }
    } else {
        showButtons(btnHit, btnStand);
        hideButtons(btnDeal, btnSplit, btnDouble, btnAllIn, btnBet5, btnBet25, btnBet50, btnBet100, btnBet500);
        if (currentPile.cards.length === 2 && (currentPile.cards[0].score[0] === currentPile.cards[1].score[0])) {
            showButtons(btnSplit);
        }
        var scores = getScores(currentPile);
        if ((scores[0] > 8 && scores[0] < 12) || (scores[1] > 8 && scores[1] < 12)) {
            showButtons(btnDouble);
        }
    }
}
//to hide buttons
var hideAllButtons = () => {
    debugger
    buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        button.style.opacity = '0.2';
        button.disabled = true;
    });
}

var hideButtons = (...buttons) => {
    buttons.forEach((button) => {
        button.style.opacity = '0.2';
        button.disabled = true;
    });
}
var showButtons = (...buttons) => {
    buttons.forEach((button) => {
        button.style.opacity = '1';
        button.disabled = false;
    });
}
btnBetHandler = (event) => {
    if (event.target.tagName === 'IMG') {
        buttonClass = event.target.closest('button').classList[1];
    } else { 
        buttonClass = event.target.classList[1];
    }

    if (buttonClass === 'btn-allin') {
        // currentPile.bet += player.money;
        // pBetAmount.textContent = currentPile.bet;
        bet = player.money;
        pBetAmount.textContent = bet;

        player.money = 0;
        pPlayerScore.textContent = 0;
    } else if (buttonClass === 'btn-5') {
        // currentPile.bet += 5;
        // pBetAmount.textContent = currentPile.bet;
        bet += 5;
        pBetAmount.textContent = bet;

        player.money -= 5;
        debugger
        pPlayerScore.textContent = player.money;
    } else if (buttonClass === 'btn-25') {
        // currentPile.bet += 25;
        // pBetAmount.textContent = currentPile.bet;
        bet += 25;
        pBetAmount.textContent = bet;

        player.money -= 25;
        pPlayerScore.textContent = player.money;
    } else if (buttonClass === 'btn-50') {
        // currentPile.bet += 50;
        // pBetAmount.textContent = currentPile.bet;
        bet += 50;
        pBetAmount.textContent = bet;

        player.money -= 50;
        pPlayerScore.textContent = player.money;
    } else if (buttonClass === 'btn-100') {
        // currentPile.bet += 100;
        // pBetAmount.textContent = currentPile.bet;
        bet += 100;
        pBetAmount.textContent = bet;

        player.money -= 100;
        pPlayerScore.textContent = player.money;
    } else if (buttonClass === 'btn-500') {
        // currentPile.bet += 500;
        // pBetAmount.textContent = currentPile.bet;
        bet += 500;
        pBetAmount.textContent = bet;

        player.money -= 500;
        pPlayerScore.textContent = player.money;
    }
    displayRightButtons();
}

//add eventlisteners to buttons
btnDeal.addEventListener('click', btnDealHandler);
btnHit.addEventListener('click', btnHitHandler);
btnStand.addEventListener('click', btnStandHandler);
btnSplit.addEventListener('click', btnSplitHandler);
btnDouble.addEventListener('click', btnDoubleHandler);
btnAllIn.addEventListener('click', btnBetHandler);
btnBet5.addEventListener('click', btnBetHandler);
btnBet25.addEventListener('click', btnBetHandler);
btnBet50.addEventListener('click', btnBetHandler);
btnBet100.addEventListener('click', btnBetHandler);
btnBet500.addEventListener('click', btnBetHandler);


var deck = createDeck();
var currentPile;
var bet = 0;
// player.money = Number(document.querySelector('.leader-board-score').textContent);
pMessages.textContent = "Welcome to BlackJack!";
displayRightButtons();