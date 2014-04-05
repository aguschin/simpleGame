// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
var box_number = 6;
var box_width = canvas.width/box_number;
var box_height = canvas.height/box_number;

// Game objects
var game_won = false;
var hero = {
	x: 0,
	y: 0
};
var monster = {};
var level = 0;
var steps = 0;
var score = 0;

//Array of boxes
var box_array = new Array();
var cross_array = new Array();
for (i=0;i<box_number;i++) {
	box_array[i]=new Array();
	cross_array[i]=new Array();
	for (j=0;j<box_number;j++) {
		box_array[i][j]=0;
		cross_array[i][j]=0;
	}
}
var box_amount = 1;//Math.floor(2+Math.random()*3);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.JPG";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/player.png";

// Monster image
var boxReady = false;
var boxImage = new Image();
boxImage.onload = function () {
	boxReady = true;
};
boxImage.src = "images/box.png";

// Monster image
var crossReady = false;
var crossImage = new Image();
crossImage.onload = function () {
	crossReady = true;
};
crossImage.src = "images/cross.png";

// Reset the game
var reset = function () {
	if (game_won === true) {
	level += 1;
	console.log(steps)
	score += Math.floor(box_amount*10000/steps);
	steps = 0;
	}
	game_won = false;
	
	for (i=0;i<box_number;i++) {
	 for (j=0;j<box_number;j++) {
		box_array[i][j]=0;
		cross_array[i][j]=0;
	}
	}
	box_amount = 1;//Math.floor(2+Math.random()*3);
	var rand1 = 0;
	var rand2 = 0;
	for (i=0; i<box_amount; i++) {
	do {
		rand1 = Math.floor(1+Math.random()*4);
		rand2 = Math.floor(1+Math.random()*4);
	}
	while (box_array[rand1][rand2]===1 || cross_array[rand1][rand2]===1 || (rand1 === hero.x && rand2 === hero.y));
	box_array[rand1][rand2] = 1;
	do {
		rand1 = Math.floor(Math.random()*4.9);
		rand2 = Math.floor(Math.random()*4.9);
	}
	while (box_array[rand1][rand2]===1 || cross_array[rand1][rand2]===1 || (rand1 === hero.x && rand2 === hero.y));
	cross_array[rand1][rand2] = 1;
};
}

addEventListener("keydown", function (e) {
	if (e.keyCode === 32 || game_won) {reset();}
	else {update(e.keyCode);}
}, false);

//Sleep
function pausecomp(millis)
 {
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < millis);
}

// Update game objects
var update = function (keyCode) {
	var vector = {};
	vector.x = 0;
	vector.y = 0;
	if ((38 === keyCode || 87 === keyCode) && (hero.y > 0)) { // Player holding up
		vector.y = -1;
	}
	if ((40 === keyCode || 83 === keyCode) && (hero.y < box_number - 1)) { // Player holding down
		vector.y = 1;
	}
	if ((37 === keyCode || 65 === keyCode) && (hero.x > 0)) { // Player holding left
		vector.x = -1;
	}
	if ((39 === keyCode || 68 === keyCode) && (hero.x < box_number - 1)) { // Player holding right
		vector.x = 1;
	}
	if (vector.x != 0 || vector.y != 0) {
	if (box_array[hero.y+vector.y][hero.x+vector.x] === 1) {
		if (hero.x+2*vector.x >= 0 && hero.y+2*vector.y >= 0 && hero.x+2*vector.x <= box_number-1 
		&& hero.y+2*vector.y <= box_number-1 && box_array[hero.y+2*vector.y][hero.x+2*vector.x] === 0) {
			box_array[hero.y+vector.y][hero.x+vector.x] = 0;
			box_array[hero.y+2*vector.y][hero.x+2*vector.x] = 1;
			hero.x += vector.x;
			hero.y += vector.y;
			++steps;
		}
	}
	else {
		hero.x += vector.x;
		hero.y += vector.y;
		++steps;
	}
	}
	pausecomp(50);
};

var game_over = function() {
	ctx.fillStyle = "#000000";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("YOU WIN", 32, 128);
	ctx.fillText("Press any key to repeat", 32, 160);
	game_won = true;
}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
	}

	if (boxReady) {
		ctx.drawImage(boxImage, monster.x, monster.y, box_width, box_height);
	}
	var inc = 0;
	for (i=0;i<box_number;i++) {
		for (j=0;j<box_number;j++) {
		if (cross_array[j][i]===1) {ctx.drawImage(crossImage, i*box_width, j*box_height, box_width, box_height);}
		if (box_array[j][i]===1) {ctx.drawImage(boxImage, i*box_width, j*box_height, box_width, box_height);}
		if (cross_array[j][i]===1 && cross_array[j][i]===box_array[j][i]) {inc += 1;}
		}
	}
	if (inc === box_amount) {game_over();}
	
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x*box_width, hero.y*box_height, box_width, box_height);
	}

	// Score
	ctx.fillStyle = "#696969";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Steps on level: " + steps, 32, 32);
	ctx.fillText("Level: " + level, 32, 64);
	ctx.fillText("Score: " + (score-score%100), 32, 96);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	render();
	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible