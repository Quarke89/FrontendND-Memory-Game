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

let grid = document.querySelector('.grid-container');


grid.addEventListener('click', handleGridClick);


function handleGridClick(e) {
    if (e.target.classList.contains("card")) {
        handleCardClick(e.target);
    }
}

function handleCardClick(card) {
    if (!card.classList.contains("match") && !card.classList.contains("open")) {
        card.classList.add("open");
        openCards.push(card);
        if (openCards.length === 2) {
            checkCardMatch();
        }
    }
}

function checkCardMatch() {
    if (openCards[0].querySelector('i').className === openCards[1].querySelector('i').className) {
        openCards[0].classList.add("match");
        openCards[1].classList.add("match");
    } else {
        openCards[0].classList.remove("open");
        openCards[1].classList.remove("open");
    }
    openCards = [];
}