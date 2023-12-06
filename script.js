// when the DOM loads
document.addEventListener("DOMContentLoaded", function() {
  const gameContainer = document.getElementById("game");
  const cards = document.querySelectorAll('.card');
  const startButton = document.getElementById("start-button");
  const startOverlay = document.getElementById("start-overlay");
  const endScreen = document.getElementById("end-screen");
  let lowScore = localStorage.getItem("high-score");

  // Set up high score on the start page
  if (lowScore) {
    document.getElementById("display-score").innerHTML = "High Score: " + lowScore;
  }

  for (let card of cards) {
    card.addEventListener('click', handleCardClick);
  }

  startButton.addEventListener("click", start)

  // Hide the start screen once game starts
  function start() {
    startOverlay.style.display = 'none';
    gameContainer.style.display = 'flex';
 
    // since there are only 7 images but 14 blocks, we need an array with 1-7 duplicated
    let numArray = [];
    for (let i = 1; i <= cards.length/2; i++) {
      numArray.push(i);
    }
    let shuffledArray = shuffle(numArray.concat(numArray));

    // add images to back of cards with newly shuffledArray
    for (let j = 0; j < cards.length; j++) {
      cards[j].children[1].children[0].src = 'images/' + shuffledArray[j] + '.jpg';
      cards[j].classList.add(shuffledArray[j]);
    }
  }

  // shuffle the array
  function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }
  
  let clickCount = 0; // Counts number of clicks that've occured
  let moves = 0;
  let matchCounter = cards.length / 2; // Reduce count by one every time you match to determine when game is over
  
  // this function handles the click event on each card
  function handleCardClick(event) {
    let clickedDiv = event.target.parentNode.parentNode;
    if (clickedDiv.classList.contains('is-flipped') || clickCount >= 2) return; // avoid multiple clicks on itself or already matched cards
    clickedDiv.classList.toggle('is-flipped');

    // first card clicked
    if (clickCount === 0) {
      clickCount++;
      clickedDiv.dataset.clicked = true;
    }

    // second card clicked
    else if (clickCount === 1) {
      clickCount++;
      //increment number of moves
      moves += 1;
      document.getElementById("moves").innerHTML = moves;
      let firstCard = document.querySelector("[data-clicked='true']"); // track the first card clicked before flipping the second one

      // if the cards match each other
      if (clickedDiv.classList.contains(firstCard.classList[1])) {
        clickCount = 0;
        matchCounter--;
        firstCard.dataset.clicked = false;
      }

      // if the cards don't match each other
      else {
        setTimeout(function() {
          firstCard.classList.toggle('is-flipped');
          clickedDiv.classList.toggle('is-flipped');
          clickCount = 0;
          firstCard.dataset.clicked = false;
        }, 1000);
      }
      if (matchCounter === 0) endGame();
    }
  }

  // Brings up endgame overlay once all cards match
  function endGame() {
    let endScore = document.getElementById("final-score");
    endScreen.style.display = 'flex';
    endScore.innerHTML = "Final Score: " + moves;

    // check if it's a new high score
    let oldScore = +localStorage.getItem("high-score") || Infinity; // If first time playing, Infinity will be lowest score
    if (moves < oldScore) {
      endScore.innerHTML += " - NEW RECORD!";
      localStorage.setItem("high-score", moves);
    }
  }
});



