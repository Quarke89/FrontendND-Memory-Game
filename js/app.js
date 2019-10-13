//============================================================================
// File:            app.js
// Author:          Vish Potnis
// Description:     Script for memory/matching game
//============================================================================

// attach click and animation transition event handlers to cards
const grid = document.querySelector('.grid-container');
grid.addEventListener('click', handleGridClick);
grid.addEventListener('transitionend', handleCardAnimations);
grid.addEventListener('animationend', handleCardAnimations);

// attach click event handler to restart button
const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', restartGame);
restartBtn.addEventListener('click', rotateButton);

// attach click even handler to play again button in the hidden overlay
const playAgainBtn = document.querySelector('.btn-play-again');
playAgainBtn.addEventListener('click', restartGame);

// DOM elements for the overlay
const overlay = document.querySelector('.overlay');
const popupMoveTxt = document.querySelector('.popup-moves');
const popupStarsTxt = document.querySelector('.popup-stars');
const popupTimerTxt = document.querySelector('.popup-timer');

// DOM elements for the score panel
const movesText = document.querySelector('.score-moves');
const starList = document.querySelector('.score-stars');
const timerText = document.querySelector('.timer-text');


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

// global variables

let moves;      // keep track of number of user moves         
let numStars;   // number of active stars based on user moves
let openCards;  // keep track of open cards
let numMatches; // number of successful matches completed
let gridState;  // array that holds the animation state of each card
let timeStart;  
let timeElapsed;
let timer;      // reference for the interval


// restart the game and reset all assests to the init values
function restartGame() {


    overlay.classList.remove('visible'); //disable overlay if present
    
    // init globals
    moves = 0;
    movesText.textContent = moves;
    numStars = 3;
    timeStart = Date.now();
    timeElapsed = 0;
    timerText.textContent = 0;
    openCards = [];
    numMatches = 0;
    gridState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    // set a timer to update in the score panel
    timer = setInterval(() => {
        timeElapsed = Date.now() - timeStart;
        timerText.textContent = Math.floor(timeElapsed / 1000);
    }, 1000);


    // shuffleArray(icons); // randomize icon locations

    resetClasses();
    resetStars();

    // assign icons to the cards
    let cardText = document.querySelectorAll('.card i');
    for (let i = 0; i < cardText.length; i++) {
        cardText[i].classList.add(icons[i]);
    }
}

// reset classes on cards to reset the grid
function resetClasses() {
    const cardText = document.querySelectorAll('.card i');
    for(const c of cardText){
        c.classList = "fa";
    }

    const cardFront = document.querySelectorAll('.card.card-front');    
    for(const c of cardFront){
        c.classList = "card card-front";
    }

    const cards = document.querySelectorAll('.card-container');    
    for(const c of cards){
        c.classList = "card-container";
    }
}

// reset star count to 3 
function resetStars() {

    let starDiff = numStars - starList.childElementCount;

    for (let i = 0; i < starDiff; i++) {
        const starHTML = document.createDocumentFragment();
        starHTML.appendChild(document.createElement('li'));
        starHTML.children[0].innerHTML = `<i class="fa fa-star"></i>`;
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

// rotate the restart button
function rotateButton() {
    restartBtn.classList.add("btn-rotate");
    // remove the class after a fixed timeout
    setTimeout(() => {
        restartBtn.classList.remove("btn-rotate");
    }, 500);

}

// handle on the grid container. Check if the click was on a card
function handleGridClick(e) {
    if (e.target.classList.contains("card")) {
        // pass card container to handler function
        handleCardClick(e.target.parentNode);
    }
}

// Starting point to the animation sequence for flipping a card and
// checking for a match
function handleCardClick(card) {

    // check if any other card is going through an animation
    const arrSum = gridState.reduce((a, b) => a + b, 0);

    // if the card is not flipped and there are no active animations
    // add the card to the open cards array, change the grid state and 
    // start the animation
    if (!card.classList.contains("is-flipped") && arrSum === 0) {
        openCards.push(card);
        let cardIdx = Number(card.getAttribute('id')) - 1;
        gridState[cardIdx] = 1;
        card.classList.add("is-flipped");
    }
}

// handler function that runs on animation end
// calls the main animation manager
function handleCardAnimations(e) {
    let cardIdx = Number(e.target.getAttribute('id')) - 1;
    animationManager(e, cardIdx);
}

// animation manager is used to sequence the animations and
// block user inputs using the gridState array
// Each gridState array value represents:
// 0 - finished state
// 1 - open animation ended
// 2 - match animation ended
// 3 - wrong animation ended
// 4 - close animation ended
function animationManager(e, cardIdx) {

    let cardState = gridState[cardIdx];
    switch (cardState) {
        case 0:
            break;
        case 1:
            // if open animation has ended and there are 2 open cards
            // check if they match. If only 1 card has been opened reset the grid state
            // to allow for next user input
            if (openCards.length === 2) {
                checkCardMatch();
            } else {
                gridState[cardIdx] = 0
            }
            break;
        case 2:
            // match animation just ended, check if game has been won
            e.target.classList.remove("match-animation-active");
            gridState[cardIdx] = 0;
            if (numMatches === 8) {
                gameWon();
            }
            break;
        case 3:
            // wong animation just ended, flip the card back to close position
            e.target.classList.remove("wrong-animation-active");
            gridState[cardIdx] = 4;
            e.target.classList.remove("is-flipped");
            break;
        case 4:
            // close animation ended. can only happen if wrong pairs were picked
            e.target.querySelector('.card-front').classList.remove("wrong");
            gridState[cardIdx] = 0;
            break;
    }

}

// check if the two open cards match
function checkCardMatch() {

    // increase the number of moves and adjust stars
    moves++;
    movesText.textContent = moves;
    adjustStars();

    let cardIdx1 = Number(openCards[0].getAttribute('id')) - 1;
    let cardIdx2 = Number(openCards[1].getAttribute('id')) - 1;

    // if the two cards match start the match animation and incease the number of matches
    // else start the wrong animation
    if (openCards[0].querySelector('i').className === openCards[1].querySelector('i').className) {

        numMatches++;
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
    // reset open cards
    openCards = [];
}

// adjust the star rating based on number of moves
function adjustStars() {
    if (moves <= 12) {
        numStars = 3;
    } else if (moves <= 20) {
        numStars = 2;
    } else {
        numStars = 1;
    }

    let starDiff = starList.childElementCount - numStars;

    for (let i = 0; i < starDiff; i++) {
        starList.removeChild(starList.querySelector('.score-stars li'));
    }

}

// called when all cards have been matched. Stop the timer and display
// the game won overlay
function gameWon() {
    clearInterval(timer);

    popupMoveTxt.textContent = moves;
    popupStarsTxt.textContent = numStars;
    popupTimerTxt.textContent = Math.floor(timeElapsed / 1000);

    overlay.classList.add('visible');

}

restartGame();
