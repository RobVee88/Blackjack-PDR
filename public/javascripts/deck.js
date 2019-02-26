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