//============================================================================
// File:            app.js
// Author:          Vish Potnis
// Description:     Script for memory/matching game
//============================================================================

const grid = document.querySelector('.grid-container');
grid.addEventListener('click', handleGridClick);
grid.addEventListener('transitionend', handleCardAnimations);
grid.addEventListener('animationend', handleCardAnimations);

const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', restartGame);

const movesText = document.querySelector('.score-moves');

const starList = document.querySelector('.score-stars');



// define icons for the grid
let icons = ['fa-cog', 'fa-cog',
    'fa-anchor', 'fa-anchor',
    'fa-cloud', 'fa-cloud',
    'fa-reddit-alien', 'fa-reddit-alien',
    'fa-bolt', 'fa-bolt',
    'fa-beer', 'fa-beer',
    'fa-rocket', 'fa-rocket',
    'fa-umbrella', 'fa-umbrella'
];


let moves = 0; // keep track of number of user moves         
let numStars = 3;
let openCards = []; // keep track of open cards

let gridState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


restartGame();

function restartGame() {

    moves = 0;
    movesText.textContent = moves;
    numStars = 3;
    openCards = [];
    gridState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    shuffleArray(icons); // randomize icon locations

    resetClasses();
    resetStars();


    // assign icons to the cards
    let cardText = document.querySelectorAll('.card i');
    for (let i = 0; i < cardText.length; i++) {
        cardText[i].classList.add(icons[i]);
    }
}

function resetClasses() {
    const cardText = document.querySelectorAll('.card i');
    for (let i = 0; i < cardText.length; i++) {
        cardText[i].classList = "fa";
    }

    const cardFront = document.querySelectorAll('.card.card-front');
    for (let i = 0; i < cardFront.length; i++) {
        cardFront[i].classList = "card card-front";
    }

    const cards = document.querySelectorAll('.card-container');
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList = "card-container";
    }
}

function resetStars() {
    const starHTML = document.createDocumentFragment();
    starHTML.appendChild(document.createElement('li'));
    starHTML.children[0].innerHTML = `<i class="fa fa-star"></i>`;

    for (let i = 0; i < numStars - starList.childElementCount; i++) {
        starList.appendChild(starHTML);
    }
}

// shuffle an array
function shuffleArray(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));

        let temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
}







// handle only clicks on a card
function handleGridClick(e) {
    if (e.target.classList.contains("card")) {
        // pass card container to handler function
        handleCardClick(e.target.parentNode);
    }
}

function handleCardClick(card) {
    const arrSum = gridState.reduce((a, b) => a + b, 0);

    if (!card.classList.contains("is-flipped") && arrSum === 0) {
        openCards.push(card);
        let cardIdx = Number(card.getAttribute('id')) - 1;
        gridState[cardIdx] = 1;
        card.classList.add("is-flipped");
    }
}


function handleCardAnimations(e) {
    let cardIdx = Number(e.target.getAttribute('id')) - 1;
    animationManager(e, cardIdx);
}

/*
0 - animation done
1 - open animation
2 - match animation
3 - wrong animation
4 - close animation
*/

function animationManager(e, cardIdx) {

    let cardState = gridState[cardIdx];
    switch (cardState) {
        case 0:
            break;
        case 1:
            if (openCards.length === 2) {
                checkCardMatch();
            } else {
                gridState[cardIdx] = 0
            }
            break;
        case 2:
            e.target.classList.remove("match-animation-active");
            gridState[cardIdx] = 0;
            break;
        case 3:
            e.target.classList.remove("wrong-animation-active");
            gridState[cardIdx] = 4;
            e.target.classList.remove("is-flipped");
            break;
        case 4:
            e.target.querySelector('.card-front').classList.remove("wrong");
            gridState[cardIdx] = 0;
            break;
    }

}

function checkCardMatch() {

    moves++;
    movesText.textContent = moves;
    adjustStars();

    let cardIdx1 = Number(openCards[0].getAttribute('id')) - 1;
    let cardIdx2 = Number(openCards[1].getAttribute('id')) - 1;

    if (openCards[0].querySelector('i').className === openCards[1].querySelector('i').className) {

        openCards[0].querySelector('.card-front').classList.add("match");
        openCards[1].querySelector('.card-front').classList.add("match");
        openCards[0].classList.add("match-animation-active");
        openCards[1].classList.add("match-animation-active");
        gridState[cardIdx1] = 2;
        gridState[cardIdx2] = 2;

    } else {
        openCards[0].querySelector('.card-front').classList.add("wrong");
        openCards[1].querySelector('.card-front').classList.add("wrong");
        openCards[0].classList.add("wrong-animation-active");
        openCards[1].classList.add("wrong-animation-active");
        gridState[cardIdx1] = 3;
        gridState[cardIdx2] = 3;

    }
    openCards = [];
}

function adjustStars() {
    if (moves <= 3) {
        numStars = 3;
    } else if (moves <= 20) {
        numStars = 2;
    } else {
        numStars = 1;
    }

    for (let i = 0; i < starList.childElementCount - numStars; i++) {
        starList.removeChild(starList.querySelector('.score-stars li'));
    }

}