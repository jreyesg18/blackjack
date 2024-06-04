document.addEventListener('DOMContentLoaded', () => {
    const playerCards = document.getElementById('player-cards');
    const dealerCards = document.getElementById('dealer-cards');
    const playerScoreEl = document.getElementById('player-score');
    const dealerScoreEl = document.getElementById('dealer-score');
    const messageEl = document.getElementById('message');

    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    const restartButton = document.getElementById('restart-button');

    let deck = [];
    let playerHand = [];
    let dealerHand = [];

    function createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        deck = [];

        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }

        deck = shuffle(deck);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGame() {
        playerHand = [drawCard(), drawCard()];
        dealerHand = [drawCard(), drawCard()];

        updateScores();
        displayHands();

        hitButton.disabled = false;
        standButton.disabled = false;
        messageEl.textContent = '';
    }

    function drawCard() {
        return deck.pop();
    }

    function getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            return 10;
        } else if (card.value === 'A') {
            return 11;
        } else {
            return parseInt(card.value);
        }
    }

    function calculateScore(hand) {
        let score = 0;
        let aceCount = 0;

        for (let card of hand) {
            score += getCardValue(card);
            if (card.value === 'A') {
                aceCount++;
            }
        }

        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }

        return score;
    }

    function updateScores() {
        const playerScore = calculateScore(playerHand);
        const dealerScore = calculateScore(dealerHand);

        playerScoreEl.textContent = playerScore;
        dealerScoreEl.textContent = dealerScore;
    }

    function displayHands() {
        playerCards.innerHTML = '';
        dealerCards.innerHTML = '';

        for (let card of playerHand) {
            playerCards.innerHTML += `<span>${card.value} of ${card.suit}</span><br>`;
        }

        for (let card of dealerHand) {
            dealerCards.innerHTML += `<span>${card.value} of ${card.suit}</span><br>`;
        }
    }

    function checkGameOver() {
        const playerScore = calculateScore(playerHand);
        const dealerScore = calculateScore(dealerHand);

        if (playerScore > 21) {
            messageEl.textContent = '¡Te pasaste! Pierdes.';
            endGame();
        } else if (dealerScore > 21) {
            messageEl.textContent = '¡El crupier se pasó! Tú ganas.';
            endGame();
        } else if (playerScore === 21) {
            messageEl.textContent = '¡Blackjack! Tú ganas.';
            endGame();
        } else if (dealerScore === 21) {
            messageEl.textContent = '¡El crupier tiene Blackjack! Pierdes.';
            endGame();
        } else if (dealerScore >= 17) {
            if (playerScore > dealerScore) {
                messageEl.textContent = '¡Tú ganas!';
            } else if (playerScore < dealerScore) {
                messageEl.textContent = 'Pierdes.';
            } else {
                messageEl.textContent = 'Empate.';
            }
            endGame();
        }
    }

    function dealerTurn() {
        while (calculateScore(dealerHand) < 17) {
            dealerHand.push(drawCard());
        }

        updateScores();
        displayHands();
        checkGameOver();
    }

    function endGame() {
        hitButton.disabled = true;
        standButton.disabled = true;
    }

    hitButton.addEventListener('click', () => {
        playerHand.push(drawCard());
        updateScores();
        displayHands();
        checkGameOver();
    });

    standButton.addEventListener('click', () => {
        dealerTurn();
    });

    restartButton.addEventListener('click', () => {
        createDeck();
        startGame();
    });

    createDeck();
    startGame();
});