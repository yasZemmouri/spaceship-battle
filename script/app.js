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

const myShip = new SpaceShip("USS Schwarzenegger", 20, 5, 0.7);

const alienS = new SpaceShip("Minion", 0, 0, 0);

// Elements
const attackBtnEl = document.getElementById("attackBtn");
const bulletEl = document.getElementById("bullet");
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
const retreatEl = document.getElementById("retreat");
const stayEl = document.getElementById("stay");
const helpBtnEl = document.getElementById("helpBtn");
const helpMsgEl = document.getElementById("helpMsg");

const youWinEl = document.getElementById("youWin");
const lastMessageEl = document.getElementById("lastMessage");

// Global Variables
let turn = 0;
let aliensCounter = 6;
let aliensBlockMaxWidth = 400;
const initialHull = myShip.hull;
let player = "";

//=============Functions=======================
//Logic
const randomValue = function (min, max) {
  return Math.random() * (max - min) + min;
};

const promptFunc = function () {
  player = prompt("Enter Your Name: ");
  while (player === "" || player === null) {
    player = prompt("We don't have the whole day.\nPlease enter your name: ");
  }
  headerEl.textContent = "Click the attack button to start the game.";
  turn = 1;
};

const alienTerminated = function () {
  headerEl.textContent = "One Alien Terminated.";
  console.log("Alien Terminated");
  console.log(`${aliensCounter - 1} aliens left`);
  aliensEl[aliensCounter - 1].remove(); //should desepear when it get hit not before
  aliensBlockMaxWidth -= 70;
  aliensBlockEl.style.maxWidth = `${aliensBlockMaxWidth}px`;
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
const retreat = function () {
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
    turn = 0;
    console.log("You win");
    headerEl.textContent = "Well played. All aliens Terminated.";
    lastMessageEl.textContent = `${player} The Terminator.`;
    setTimeout(function () {
      youWinEl.style.display = "block";
    }, 2000);

    return true;
  }
};

const gameOver = function () {
  turn = 0;
  console.log("Game Over\nYou Lost");
  headerEl.textContent = "So Bad. We were so close.";
  setTimeout(function () {
    pEl[0].textContent = "GAME OVER";
    pEl[1].textContent = "You Lost";
    gameOverEl.classList.add("transform");
    footerEl.remove();
  }, 1500);
};

const alienMove = function () {
  if (turn === 2) {
    setTimeout(function () {
      bulletEl.style.animationDirection = "alternate-reverse";
      bulletEl.style.backgroundColor = "red";
      bulletEl.classList.add("bullet-final");
      setTimeout(function () {
        console.log("alien attacked");
        alienS.accuracy = randomValue(0.6, 0.8);
        console.log("aliens Accuracy: " + alienS.accuracy);
        if (myShip.accuracy < alienS.accuracy) {
          myShip.hull === 20
            ? (headerEl.textContent = "Oh my God! You got SHOT!")
            : (headerEl.textContent = "Oh my God! You got shot AGAIN!");
          myShip.hull -= alienS.firepower;
          console.log("my new hull: " + myShip.hull);
          //Display my hull on dashboard.
          myShip.hull > 0
            ? (pHullEl.textContent = `${myShip.hull.toFixed(1)}/${initialHull}`)
            : (pHullEl.textContent = `0/${initialHull}`);
          //check if player survived
          if (myShip.hull > 0) {
            console.log("You survived.");
          } else gameOver();
        } else {
          headerEl.textContent = "Alien missed!";
          console.log("Alien missed!");
        }
        console.log("---------------------------------");
        bulletEl.classList.remove("bullet-final");
        turn = 1;
      }, 600);
    }, 1000);
  }
};

const playerMove = function () {
  if (turn === 1) {
    //DOM
    bulletEl.style.animationDirection = "alternate";
    bulletEl.style.backgroundColor = "white";
    bulletEl.classList.add("bullet-final");
    turn = 0;

    setTimeout(function () {
      bulletEl.classList.remove("bullet-final");

      alienS.accuracy = randomValue(0.6, 0.8);
      console.log("aliens Accuracy: " + alienS.accuracy);
      console.log("you attacked");
      if (myShip.accuracy > alienS.accuracy) {
        alienS.hull -= myShip.firepower;
        console.log("new alien hull: " + alienS.hull);
        if (alienS.hull > 0) {
          console.log("alien survived. He will attack");
        } else {
          alienTerminated();
          choice();
          checkWin() || alienSReset();
          //check if you won if not
          //reset alien.
        }
      } else {
        headerEl.textContent = "You missed!";
        console.log("You missed!");
      }
      console.log("-------------------------------------------------");
      turn = 2;
      alienMove();
    }, 600);
  }
};

const alienSReset = function () {
  alienS.hull = randomValue(3, 6);
  console.log("alienS hull: " + alienS.hull);
  alienS.firepower = randomValue(2, 4);
  console.log("alienS fire power: " + alienS.firepower);
};

// DashBoard Elements Graphic
pNameEl.textContent = `${myShip.sName}`;
pFPowerEl.textContent = `${myShip.firepower}`;
pAccuracyEl.textContent = `${myShip.accuracy}`;
const personalInfo = function () {
  pHullEl.textContent = `${myShip.hull}/${initialHull}`;
};

//============GAME=================
//Premove
personalInfo();
alienSReset();

//Event Listeners
window.addEventListener("load", promptFunc);
attackBtnEl.addEventListener("click", playerMove);
helpBtnEl.addEventListener("click", function () {
  helpMsgEl.classList.toggle("hide");
});

retreatEl.addEventListener("click", retreat);
choiceBtnEl.onclick = () => {
  choiceMenuEl.style.display = "flex";
  let text = `Retreat. ${(6 - aliensCounter) * 20}% to win.`;
  retreatEl.textContent = "";
  let newText = document.createTextNode(text);
  retreatEl.appendChild(newText);
};
stayEl.addEventListener("click", stay);
