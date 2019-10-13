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

// shuffle an array
function shuffleArray(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));

        let temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
}

// randomize icon locations
// shuffleArray(icons);

// assign icons to the cards
let cardText = document.querySelectorAll('.card i');
for (let i = 0; i < cardText.length; i++) {
    cardText[i].classList.add("fa", icons[i]);
}


let moves = 0; // keep track of number of user moves            
let openCards = []; // keep track of open cards
let userInput = true;

let gridState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const grid = document.querySelector('.grid-container');
grid.addEventListener('click', handleGridClick);
grid.addEventListener('transitionend', handleTransitionEnd);
grid.addEventListener('transitionrun', handleTransitionRun);



// handle only clicks on a card
function handleGridClick(e) {
    if (userInput && e.target.classList.contains("card")) {
        // pass card container to handler function
        handleCardClick(e.target.parentNode);
    }
}

function handleCardClick(card) {
    if (!card.classList.contains("is-flipped")) {
        openCards.push(card);
        card.classList.add("is-flipped");
        
    }
}

function handleTransitionRun(e){
    // userInput = false;
    console.log(e);
}

function handleTransitionEnd(e){
    // userInput = true;
    if (openCards.length === 2) {
        checkCardMatch();
    }
}

function checkCardMatch() {
    if (openCards[0].querySelector('i').className === openCards[1].querySelector('i').className) {
        openCards[0].querySelector('.card-front').classList.add("match");
        openCards[1].querySelector('.card-front').classList.add("match");
        openCards[0].classList.toggle("match-animation-active");
        openCards[1].classList.toggle("match-animation-active");
        // openCards[0].querySelector('.card-front').classList.add("match-animation-active");
        // openCards[1].querySelector('.card-front').classList.add("match-animation-active");
       
    } else {
        openCards[0].querySelector('.card-front').classList.add("wrong");
        openCards[1].querySelector('.card-front').classList.add("wrong");
        openCards[0].classList.toggle("wrong-animation-active");
        openCards[1].classList.toggle("wrong-animation-active");
        openCards[0].classList.remove("is-flipped");
        openCards[1].classList.remove("is-flipped");
    }
    openCards = [];
}