// Deal one up card to each player, followed by a down card to the dealer. 
// Then deal a second up card to each player, followed by the dealer's up card


//link to dom elements (these will change when merging with Daniels beautiful webpages)
var btnDeal = document.querySelector('.deal');
var btnStand = document.querySelector('.stand');
var btnSplit = document.querySelector('.split');
var btnDouble = document.querySelector('.double');
var pPlayerCard = document.querySelector('.player-cards-1');
var pDealerCard = document.querySelector('.dealer-card');
var h1PlayerScore = document.querySelector('.player-score');
var h1DealerScore = document.querySelector('.dealer-score');
var h1PlayerFunds = document.querySelector('.player-funds');
var pMessages = document.querySelector('.messages');
var divPlayerPiles = document.querySelector('.player-piles');
var divPile1 = document.querySelector('.pile-1');

//player, array of cards (objects), score ($), name
var player = {
    piles: [], //needed in case of split, this is an array of objects that contain a classname and an array of cards
    money: 0,
    name: ""
}
//house, array of cards (objects)
var dealer = [];

var deck = createDeck();

//create a pile at the start
//push cards to piles
//when checking score, check all piles for scores

dealStartingHands();

//event listeners for buttons (these will change when daniels shit is ready)
btnDeal.addEventListener('click', btnDealHandler);
btnStand.addEventListener('click', btnStandHandler);
btnSplit.addEventListener('click', btnSplitHandler);
//btnDouble.addEventListener('click', btnDoubleHandler);
console.log(deck);
