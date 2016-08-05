"use strict";

var p = document.querySelector("#p");
var ctx = p.getContext("2d");
var paused = false;
var POSITION_85 = 85,
    POSITION_100 = 100,
    POSITION_200 = 200,
    POSITION_400 = 400;

// Enemies our player must avoid
var Enemy = function(x, y) {

    var sprites = ['images/enemy-bug.png', 'images/enemy-bug2.png'];
    this.x = x;
    this.y = y;

    this.sprite = sprites[Math.floor(Math.random() * sprites.length)];

};

// The enemy's x-position when it's x-position is less than the canvas width with the product of dt*10 plus the Player's score...will increase the speed of the enemy, thus the dificulty of the game for the Player
Enemy.prototype.update = function(dt) {
    var newStart = Math.floor((Math.random() * -500) + -300);

    if (this.x < 505) {
        this.x += (dt * 10 + score);
    } else {
        this.x = newStart;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//  Player Class, update(), render() and
// a handleInput() methods.

var Player = function(x, y) {

    var sprites = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];

    this.sprite = sprites[Math.floor(Math.random() * sprites.length)];
    this.x = POSITION_200;
    this.y = POSITION_400;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player.prototype.update = function() {
// 	this.checkPlayerCollisions();
// };

Player.prototype.update = function() {
    this.checkPlayerCollisions();
    if (this.y < 0) {
        this.reset();
        score += 1;
    }
};

// Function to translate keyboard input for directing the player movement
//

Player.prototype.handleInput = function(keyPressed) {
    if (keyPressed === 'right' && this.x < POSITION_400) {
        this.x += POSITION_100;
    } else if (keyPressed === 'left' && this.x > 99) {
        this.x -= POSITION_100;
    } else if (keyPressed === 'down' && this.y < POSITION_400) {
        this.y += POSITION_85;
    } else if (keyPressed === 'up' && this.y > 59) {
        this.y -= POSITION_85;
    } else if (keyPressed === 'p') {
        paused = !paused;
    } else if (keyPressed === 'r') {
        location.reload();
    }
    // Get x and y value for Player for purposes of location values to help build boundry limits in the game for the Player
    console.log(this.x, this.y);
};

// Instantiation of objects.
// Enemy objects in an array called allEnemies
// Player object in a variable called player
var allEnemies = [],
    defaultEnemyLanesX = [-200, -150, -125, -75, -20],
    defaultEnemyLanesY = [65, 145, 225];
var enemy1, enemy2, enemy3, enemy4, enemy5;
var player;

// Creation of enemies and player
enemy1 = new Enemy(defaultEnemyLanesX[Math.floor(Math.random() * defaultEnemyLanesX.length)], defaultEnemyLanesY[Math.floor(Math.random() * defaultEnemyLanesY.length)]);
enemy2 = new Enemy(defaultEnemyLanesX[Math.floor(Math.random() * defaultEnemyLanesX.length)], defaultEnemyLanesY[Math.floor(Math.random() * defaultEnemyLanesY.length)]);
enemy3 = new Enemy(defaultEnemyLanesX[Math.floor(Math.random() * defaultEnemyLanesX.length)], defaultEnemyLanesY[Math.floor(Math.random() * defaultEnemyLanesY.length)]);
enemy4 = new Enemy(defaultEnemyLanesX[Math.floor(Math.random() * defaultEnemyLanesX.length)], defaultEnemyLanesY[Math.floor(Math.random() * defaultEnemyLanesY.length)]);
enemy5 = new Enemy(defaultEnemyLanesX[Math.floor(Math.random() * defaultEnemyLanesX.length)], defaultEnemyLanesY[Math.floor(Math.random() * defaultEnemyLanesY.length)]);

allEnemies.push(enemy1, enemy2, enemy3, enemy4, enemy5);
player = new Player();

//Variables created to track Player reaching water, goal-item or being eaten by a water bug

var score = 0;
var deaths = 0;

// Player restart check, if Player and Enemy collide; the deduction of a Player score point for being eaten, and the addition of a deaths point; or, if Player (collides) reaches a goal item, the addition of two score points. The point(s) update will be reflected in the browser window.

Player.prototype.checkPlayerCollisions = function() {

    for (var enemy in allEnemies) {
        if (
            this.y + 130 >= allEnemies[enemy].y + 95 &&
            this.x + 25 <= allEnemies[enemy].x + 85 &&
            this.y + 75 <= allEnemies[enemy].y + 135 &&
            this.x + 75 >= allEnemies[enemy].x + 15) {
            this.reset();
            deaths += 1;
            score -= 1;
        }

    }
    for (var goal in allGoals) {
        if (
            this.y == allGoals[goal].y &&
            this.x == allGoals[goal].x) {
            this.reset();
            score += 2;
        }
    }

    document.getElementById('score').value = score;

    document.getElementById('deaths').value = deaths;

};

// Player restart position if eaten by enemy (water bug); the location is the bottom row of the game; however, the column where the Player's death occured is preserved -- to help with Player strategy

Player.prototype.reset = function() {
    this.y = POSITION_400;
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this. This was modified to allow for a way to reload the game and a way to pause the game. The pause game function had to be on its own handleInput so the game could be restarted from the paused state.
document.addEventListener('keyup', function(e) {
    var pauseKey = 80;
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        82: 'r'
    };

    if (e.keyCode == pauseKey) {
        paused = !paused;
    }
    if (paused) {
        paused.handleInput(allowedKeys[e.keyCode]);
    } else {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

//Creation of Goal items, random slection of Goal items, random location placement of Goal items on game board
var Goal = function(x, y) {

    var sprites = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Key.png',
    ];

    this.sprite = sprites[Math.floor(Math.random() * sprites.length)];
    this.x = x;
    this.y = y;
};

Goal.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var allGoals = [],
    defaultGoalLanesX = [0, 100, 200, 300, 400],
    defaultGoalLanesY = [-25];
var goal1, goal2, goal3;

goal1 = new Goal(defaultGoalLanesX[Math.floor(Math.random() * defaultGoalLanesX.length)], defaultGoalLanesY);
goal2 = new Goal(defaultGoalLanesX[Math.floor(Math.random() * defaultGoalLanesX.length)], defaultGoalLanesY);
goal3 = new Goal(defaultGoalLanesX[Math.floor(Math.random() * defaultGoalLanesX.length)], defaultGoalLanesY);

allGoals.push(goal1, goal2, goal3);

//The Math.random javascript function is at its best with a larger selection size of numbers, objects and strings. So, because of the small game environment, i.e., number of total cells to place game pieces, some cells may receive to array objects in the same cell. This can occur with the Goal items. This can also occur with the Emeny (water bugs). The Enemy can possibly be placed directly on top of one another, or in a connected fashion similar to train cars due to the small game play environment and Math.random situation I am describing.
