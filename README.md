# Project: Memory Game

This project was done as part of the Front-End Nanodegree program for Udacity

## Notable code details

### HTML

The HTML consists of 3 different sections
1. Score panel
   * Tracks moves, stars, and the time
   * Restart game button
2. Grid
   * Contains the 4x4 grid of cards
3. Overlay
   * Hidden overlay that is displayed when game is won

### CSS

CSS grid is used for layout of the 4x4 grid

Each card is a container that has 2 `divs` that represent the front and back side of the card.
The front side is rotated using `transform: rotateY(180deg)` and with `backface-visibility: hidden`.

Open/close animations are done using transitions by applying `transform: rotateY(180deg)` to the entire card container

Match and wrong animations are done using keyframe animations by scaling and translating the container

### Javascript

An "animation manager" function is used to handle the animation transitions and sequencing. It is triggered on `animationend` and `transitionend` events. It changes the transition state of each card and triggers the next animation. The transition state is used to avoid user inputs during transitions. 



## How to play

The grid represents 16 tiles that can be flipped. There are 8 pairs of 2 matching symbols shuffled across the grid. The goal is to find 2 matching tiles by clicking on each one by one until all the pairs are found.

Every uncovered pair of tiles counts as one move. The objective is to find all pairs with the least number of moves as possible. Stars are awarded based on total moves used
* 3 stars: Less than 12 moves
* 2 stars: 13-20 moves
* 1 stars: 21+ moves

There is a timer to track elapsed time. The restart button will reset the game