"use strict";

//Space Ships
class SpaceShip {
  constructor(sName, hull, firepower, accuracy) {
    this.sName = sName;
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }
}

const helloworld = new SpaceShip("USS HelloWorld", 20, 5, 0.7);
// console.log(helloworld); //comment out

const alienS = new SpaceShip("Minion", 0, 0, 0);

// Elements
const attackBtnEl = document.getElementById("attackBtn");
const bulletEl = document.getElementById("bullet");
const abulletEl = document.getElementById("abullet");
const pNameEl = document.getElementById("pName");
const pHullEl = document.getElementById("pHull");
const pFPowerEl = document.getElementById("pFPower");
const pAccuracyEl = document.getElementById("pAccuracy");
const aliensBlockEl = document.getElementById("aliens-block");
const headerEl = document.getElementsByTagName("header")[0];
const aliensEl = document.querySelectorAll("#aliens-block img");
const gameOverEl = document.getElementById("gameOver");
const pEl = document.getElementsByTagName("p");
const footerEl = document.getElementsByTagName("footer")[0];
const choiceBtnEl = document.getElementById("choiceBtn");
const choiceMenuEl = document.getElementById("choiceMenu");
const leaveEl = document.getElementById("leave");
const stayEl = document.getElementById("stay");
const youWinEl = document.getElementById("youWin");

// Global Variables
let turn = 1;
let aliensCounter = 6;
let aliensBlockMaxWidth = 400;
const initialHull = helloworld.hull;

//=============Functions=======================
//Logic
const randomValue = function (min, max) {
  return Math.random() * (max - min) + min;
};

const alienDestroyed = function () {
  console.log("Alien Destroyed");
  console.log(`${aliensCounter - 1} aliens left`);
  aliensEl[aliensCounter - 1].remove(); //should desepear when it get hit not before
  aliensBlockMaxWidth -= 70;
  aliensBlockEl.style.maxWidth = `${aliensBlockMaxWidth}px`;
  console.log("aliens-block max-width: " + aliensBlockMaxWidth);
  aliensCounter--;
};

const choice = function () {
  turn = 0;
  choiceBtnEl.style.visibility = "visible";
};
const stay = function () {
  choiceBtnEl.style.visibility = "hidden";
  choiceMenuEl.style.display = "none";
};
const leave = function () {
  let chance = ((6 - aliensCounter) * 20) / 100;
  if (chance > Math.random()) {
    aliensCounter = 0;
    checkWin();
  } else {
    gameOver();
  }
};

const checkWin = function () {
  if (aliensCounter === 0) {
    console.log("You win");
    headerEl.textContent = "All Aliens Destroyed";
    youWinEl.style.display = "block";
    turn = 0;
    return true;
  }
};

const gameOver = function () {
  console.log("Game Over\nYou Lost");
  pEl[0].textContent = "GAME OVER";
  pEl[1].textContent = "You Lost";
  gameOverEl.classList.add("transform");
  headerEl.textContent = "So Bad";
  footerEl.remove();
  turn = 0;
};

const alienMove = function () {
  if (turn === 2) {
    console.log("alien attacked");
    alienS.accuracy = randomValue(0.6, 0.8);
    console.log("aliens Accuracy: " + alienS.accuracy);
    if (helloworld.accuracy < alienS.accuracy) {
      helloworld.hull -= alienS.firepower;
      console.log("my new hull: " + helloworld.hull);
      pHullEl.textContent = `${helloworld.hull.toFixed(1)}/${initialHull}`;
      //check if player survived
      if (helloworld.hull > 0) {
        console.log("You survived.");
      } else gameOver();
    } else {
      console.log("Alien missed!");
    }
  }
  turn = 1;
};

const playerMove = function () {
  if (turn === 1) {
    console.log("you attacked");
    alienS.accuracy = randomValue(0.6, 0.8);
    console.log("aliens Accuracy: " + alienS.accuracy);
    if (helloworld.accuracy > alienS.accuracy) {
      alienS.hull -= helloworld.firepower;
      console.log("new alien hull: " + alienS.hull);
      if (alienS.hull > 0) {
        console.log("alien survived. He will attack");
      } else {
        // turn = 2; //maybe not here???
        alienDestroyed();
        choice();
        checkWin() || alienSReset();
        //check if you won if not
        //reset alien.
      }
    } else {
      console.log("You missed!");
      //   turn = 2;
    }
  }
  turn = 2;
  alienMove();
};

const alienSReset = function () {
  alienS.hull = randomValue(3, 6);
  console.log("alienS hull: " + alienS.hull);
  alienS.firepower = randomValue(2, 4);
  console.log("alienS fire power: " + alienS.firepower);
};

// Graphic
pNameEl.textContent = `${helloworld.sName}`;
pFPowerEl.textContent = `${helloworld.firepower}`;
pAccuracyEl.textContent = `${helloworld.accuracy}`;
const personalInfo = function () {
  pHullEl.textContent = `${helloworld.hull}/${initialHull}`;
};

//============GAME=================
//Premove
personalInfo();
alienSReset();

//Event Listener
attackBtnEl.addEventListener("click", playerMove);
leaveEl.addEventListener("click", leave);
choiceBtnEl.onclick = () => {
  choiceMenuEl.style.display = "flex";
  let text = `Retreat. ${(6 - aliensCounter) * 20}% to win.`;
  leaveEl.textContent = "";
  let newText = document.createTextNode(text);
  leaveEl.appendChild(newText);
};
stayEl.addEventListener("click", stay);
