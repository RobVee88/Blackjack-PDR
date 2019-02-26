//deal starting hands
var dealStartingHands = () => {
    player.piles.push([dealCard(),dealCard()]);
     var dCard1 = dealCard();
     var dCard2 = dealCard();

    //add animations of the dealing of the card here
    dealer.push(dCard1);
    dealer.push(dCard2);
    console.log(player.piles[0]);
    console.log(player.piles);
    player.piles[0].forEach((card) => {
        pPlayerCard.textContent = pPlayerCard.textContent +  card.suit;
        pPlayerCard.textContent = pPlayerCard.textContent +  card.value;
    });

    pDealerCard.textContent = pDealerCard.textContent +  dCard1.suit;
    pDealerCard.textContent = pDealerCard.textContent +  dCard1.value;
    pDealerCard.textContent = pDealerCard.textContent +  dCard2.suit;
    pDealerCard.textContent = pDealerCard.textContent +  dCard2.value;
    checkBlackJack(player.piles[0]);
}

//dealer move
var dealerMove = () => {
    var card = dealCard();
    dealer.push(card);

    //show cards in dealer's spot, this will have to go after merge with Daniels stuff
    pDealerCard.textContent = pDealerCard.textContent +  card.suit;
    pDealerCard.textContent = pDealerCard.textContent +  card.value;
}

var getDealerScores = () => {
    dealerScoreHigh = 0;
    dealerScoreLow = 0;
    dealer.forEach((card) => {
        if(card.value === "A") {
            dealerScoreHigh += card.score[1];
            dealerScoreLow += card.score[0];
        } else {
            dealerScoreHigh += card.score[0];
            dealerScoreLow += card.score[0];
        }
    });
    if(dealerScoreHigh !== dealerScoreLow){
        if(dealerScoreHigh > 21) {
            h1DealerScore.textContent = dealerScoreLow;
        } else {
            h1DealerScore.textContent = `${dealerScoreLow} / ${dealerScoreHigh}`
        }
    } else {
        h1DealerScore.textContent = dealerScoreHigh;
    }
    return [dealerScoreHigh,dealerScoreLow];
}

var getScores = (pile) => {
    playerScoreHigh = 0; 
    playerScoreLow = 0;

    pile.forEach((card) => {
        if(card.value === "A") {
            playerScoreHigh += card.score[1];
            playerScoreLow += card.score[0];
        } else {
            playerScoreHigh += card.score[0];
            playerScoreLow += card.score[0];
        }
    });
    // display scores
    if(playerScoreHigh !== playerScoreLow){
        if(playerScoreHigh > 21) {
            h1PlayerScore.textContent = playerScoreLow;
        } else {
            h1PlayerScore.textContent = `${playerScoreLow} / ${playerScoreHigh}`
        }
    } else {
        h1PlayerScore.textContent = playerScoreHigh;
    }

    return [playerScoreHigh,playerScoreLow];
}

//check for 21 or bust
var checkBlackJack = (pile) => {
    //make array due to aces being 1/11, this makes it so a player can have 2 different scores
    playerScores = getScores(pile);
    dealerScores = getDealerScores();

    playerScoreHigh = playerScores[0]; 
    dealerScoreHigh = dealerScores[0];

    //check for player blackjack
    if(playerScoreHigh === 21) {
        pMessages.textContent = "PLAYER HAS BLACKJACK!!";
        return true;
    } 
    //check for dealer blackjack
    if(dealerScoreHigh === 21) {
        pMessages.textContent = "DEALER HAS BLACKJACK!!";
        return true;
    } 
    return false;
}
var checkDealerBustStand21 = () => {
    scores = getDealerScores();
    dealerScoreHigh = scores[0];
    dealerScoreLow = scores[1];

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
    if(dealerScoreHigh >= 17 && dealerScoreLow >= 17) {
        pMessages.textContent = "DEALER STANDS!";
        return true;
    }
    return false;
}
var checkPlayerBustStand21 = (pile) => {
    scores = getScores(pile);
    playerScoreHigh = scores[0]; 
    playerScoreLow = scores[1];

    if(playerScoreHigh === 21 || playerScoreLow === 21) {
        pMessages.textContent = "PLAYER HAS 21!!";
        return true;
    }
    //check for player bust
    if(playerScoreLow > 21) {
        pMessages.textContent = "PLAYER BUSTS!!";
        return true;
    }
    return false;
}