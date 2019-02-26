//eventhandlers
var btnDealHandler = () => {
    var card = dealCard();
    player.piles[0].push(card);

    //show cards in player's spot, this will have to go after merge with Daniels stuff
    pPlayerCard.textContent = pPlayerCard.textContent +  card.suit;
    pPlayerCard.textContent = pPlayerCard.textContent +  card.value;

    checkPlayerBustStand21(player.piles[0]);
}

var btnStandHandler = () => {
    while(checkDealerBustStand21() === false) {
        dealerMove();
    }
}

var btnSplitHandler = () => {
    //find out how many piles there are
    numberOfPiles = player.piles.length;
    //create another pile and add one card from the orignal pile in there
    player.piles.push([player.piles[0].splice(1,1)]);
    //deal a card into both piles
    player.piles[0].push(dealCard());
    player.piles[1].push(dealCard());
    //create another pile div
    var pile = document.createElement('div');
    pile.className = `pile-${numberOfPiles + 1}`;
    var p = document.createElement('p');
    p.className = `player-cards${numberOfPiles +1}`
    pile.appendChild(p);
    divPlayerPiles.appendChild(pile);
    player.piles.forEach((pile) =>{
        getScores(pile);
    })
}
//pile {
//  cards: []
//  classname: ""
//}
//I need to create a extra piles of playing cards
//the extra pile needs to take one card from the original pile
//I need to be able to keep track of the scores of each individual pile of cards
//I need a seperate set of buttons for each pile, created when the extra pile is created