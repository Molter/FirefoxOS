	// Setup requestAnimationFrame
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
						window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// Create the canvasElement
var canvasElement = document.createElement("canvas");
var canvasContext = canvasElement.getContext("2d");
canvasElement.width = 512;
canvasElement.height = 480;
document.body.appendChild(canvasElement);

// Background image
var isBackgroundReady = false;

var bgImage = new Image();
bgImage.onload = function () {
	isBackgroundReady = true;
};
bgImage.src = "img/background.png";

// Hero image
var isHeroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	isHeroReady = true;
};
heroImage.src = "img/hero.png";

// Monster image
var isMonsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	isMonsterReady = true;
};
monsterImage.src = "img/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
	speed: 128
};
var monstersCaught = 0;

// Handle keyboard controls
var pressedKeys = {};

addEventListener("keydown", function (e) {
	pressedKeys[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete pressedKeys[e.keyCode];
}, false);

document.getElementById('stop').addEventListener('click', function() {
	 document.getElementById('stop').style.display = 'none';
	 isGameRuning = true;
	 runGame();
}, false);




// reset the game when the player catches a monster
var resetGame = function () {	
	isGameRuning = false;
	document.getElementById('stop').style.display = 'block';
	hero.x = canvasElement.width / 2;
	hero.y = canvasElement.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvasElement.width - 64));
	monster.y = 32 + (Math.random() * (canvasElement.height - 64));
};

var moveHero = function(intMovementModificator) {
	if (38 in pressedKeys) { // Player holding up
		if(hero.y > 30 ){
			hero.y -= hero.speed * intMovementModificator;
		}
		return;
	}

	if (40 in pressedKeys) { // Player holding down
		if(hero.y < 420 ){
			hero.y += hero.speed * intMovementModificator;
		}
		return;
	}
	
	if (37 in pressedKeys) { // Player holding left
		if(hero.x > 30){
			hero.x -= hero.speed * intMovementModificator;
		}
		return;
	}
	if (39 in pressedKeys) { // Player holding right
		if(hero.x < 450 ){
			hero.x += hero.speed * intMovementModificator;
		}
		return;
	}
};

var moveMonster = function(intMovementModificator) {
	if(hero.x > monster.x) {
		monster.x += monster.speed * intMovementModificator;
	}else {
		monster.x -= monster.speed * intMovementModificator;
	}

	if(hero.y > monster.y) {
		monster.y += monster.speed * intMovementModificator;
	}else {
		monster.y -= monster.speed * intMovementModificator;
	}
};


// Update game objects
var updateGameObjects = function (intMovementModificator) {
	var isHeroAlive = true;
	
	moveHero(intMovementModificator);
	moveMonster(intMovementModificator);

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		resetGame();
		isHeroAlive = false;
	}
	return isHeroAlive;
};



// Draw everything
var renderObjects = function () {
	if (isBackgroundReady) {
		canvasContext.drawImage(bgImage, 0, 0);
	}

	if (isHeroReady) {
		canvasContext.drawImage(heroImage, hero.x, hero.y);
	}

	if (isMonsterReady) {
		canvasContext.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	canvasContext.fillStyle = "rgb(250, 250, 250)";
	canvasContext.font = "24px Helvetica";
	canvasContext.textAlign = "left";
	canvasContext.textBaseline = "top";
	canvasContext.fillText("Deaths: " + monstersCaught, 32, 32);
};


// The main game loop
var runGame = function () {	
	var endedTimestamp = Date.now();
	var timeDiference = endedTimestamp - startedTimestamp;
	if(isGameRuning) {
		updateGameObjects(timeDiference / 1000);
	}
	renderObjects();

	startedTimestamp = endedTimestamp;
	requestAnimationFrame(runGame);
};

// Let's play this game!
var isGameRuning = false;
resetGame();
var startedTimestamp = Date.now();
runGame();
document.getElementById('stop').style.display = 'block';