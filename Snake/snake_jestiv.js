const canvas = document.getElementById("zmijica");
const canvasScore = document.getElementById("score");

const context = canvas.getContext("2d");
const contextScore = canvasScore.getContext("2d");

const velicina_celije = 30;

let score = 0;
let highScore = 0;

let zmija = [];
zmija[0] = {
	x : 9*velicina_celije,
	y : 10*velicina_celije
}

let hrana = {
	x : Math.floor(Math.random() * 15 + 2) * velicina_celije,
	y : Math.floor(Math.random() * 15 + 2) * velicina_celije
}

function premestiHranu() {

	hrana.x = Math.floor(Math.random() * 15 + 2) * velicina_celije;
	hrana.y = Math.floor(Math.random() * 15 + 2) * velicina_celije;
}

function checkHrana() {

	for(let i = 0; i < zmija.length; ++i) {
		if(zmija[i].x == hrana.x && zmija[i].y == hrana.y) 
			return false;
	}

	return true;
}

function renderZmija() {

	for(let i = 0; i < zmija.length; ++i) {
		context.fillStyle = (i == 0) ? "red" : "green";
		context.fillRect(zmija[i].x, zmija[i].y, velicina_celije, velicina_celije);

		context.strokeStyle = "white";
		context.strokeRect(zmija[i].x, zmija[i].y, velicina_celije, velicina_celije);
	}
}

function renderHrana() {

	while(!checkHrana())
		premestiHranu();

	context.fillStyle = "green";
	context.fillRect(hrana.x, hrana.y, velicina_celije, velicina_celije);
}

let smer;
document.addEventListener("keydown", keyDownHandler);
function keyDownHandler(event) {
	if(event.keyCode == 37 && smer != "desno")
		smer = "levo";
	else if(event.keyCode == 39 && smer != "levo")
		smer = "desno";
	else if(event.keyCode == 38 && smer != "dole")
		smer = "gore";
	else if(event.keyCode == 40 && smer != "gore")
		smer = "dole";
}

function igra() {
	
	let zmijaX = zmija[0].x;
	let zmijaY = zmija[0].y;

	if(smer == "gore")
		zmijaY -= velicina_celije;
	else if(smer == "dole")
		zmijaY += velicina_celije;
	else if(smer == "levo")
		zmijaX -= velicina_celije;
	else if(smer == "desno")
		zmijaX += velicina_celije;

	if(zmijaX < 0)
		zmijaX = canvas.width - velicina_celije;
	if(zmijaY < 0)
		zmijaY = canvas.height - velicina_celije;
	if(zmijaX == canvas.width)
		zmijaX = zmijaX % canvas.width;
	if(zmijaY == canvas.height)
		zmijaY = zmijaY % canvas.height;

	// if(zmijaY > canvas.height)
	// 	zmijaY = 0;
	// if(zmijaY < 0)
	// 	zmijaY = canvas.height;
	// if(zmijaX < 0)
	// 	zmijaX = canvas.width;
	// if(zmijaX > canvas.width)
	// 	xmijaX = 0;

	let popFlag = false;
	let popCnt = 0;

	for(let i = 0; i < zmija.length; ++i) {
		if(zmija[i].x == zmijaX && zmija[i].y == zmijaY) {
			popFlag = true;
			popCnt = zmija.length - (i + 1);
		}
	}

	if(popFlag == true) {
		for(let i = 0; i < popCnt; ++i)
			zmija.pop();
		score -= popCnt;
	}	

	if(zmijaX == hrana.x && zmijaY == hrana.y) {
		score++;
	}
	else {
		zmija.pop();
	}

	zmija.unshift({
		x : zmijaX,
		y : zmijaY
	});
}

function renderScore() {

	let strScore = "Score: " + score;
	let srtHighScore = "High score: " + highScore;
	contextScore.font = "30px Arial";
	contextScore.strokeStyle = "white";
	contextScore.strokeText(strScore, 10, 30);
	contextScore.strokeText(srtHighScore, 300, 30);
}

function render() {

	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	contextScore.fillStyle = "black";
	contextScore.fillRect(0, 0, canvasScore.width, canvasScore.height);

	renderScore();
	renderZmija();
	renderHrana();
	igra();
}

let play = setInterval(render, 100);