const canvas = document.getElementById('igra');
const context = canvas.getContext('2d');

/*
Dropovi:
zeleni - 20 ammo-a,
plavi - freeze,
crveni - zivot,
narandzasti - bomba (pocisti sve protivnike sa ekrana)
*/

/*
Protivnici:
plavi - 3 hp,
zuti - 4 hp,
crveni - 5 hp
*/

canvas.style.cursor = 'none';

//promenljive
let tasteri = {};
let speed = 5;
let enemySpeed = 4;
let wave = 1;
let waveCount = 20;
let waveCountSpawn = 20;
let fireRate = 5;
let fireInterval = null;
let ammo = 200;
let pauseInterval = null;
let n = 10;
let lives = 5;
let gameOver = false;
let score = 0;
let scoreIncInterval = null;

let bullets = [];
let enemies = [];
let drops = [];
let hiScoreList = [];

let mouse = {
    x: canvas.width/2,
    y: canvas.height/2
}

document.addEventListener('mousedown', startFire);
document.addEventListener('mouseup', stopFire);

document.addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

});

document.addEventListener('keydown', event => {
    tasteri[event.code] = true;
});

document.addEventListener('keyup', event => {
    tasteri[event.code] = false;
});

class Rectangle{
    constructor(x, y, w, h, col){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.col = col;
    }

    draw(){
        context.fillStyle = this.col;
        context.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Circle{
    constructor(x, y, r, col){
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;
    }

    draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        context.fillStyle = this.col;
        context.fill();
        context.closePath();
    }

    update(){
        this.draw();
    }
}

class Igrac {
    constructor(x, y, r, col) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;

        this.dx = 0;
        this.dy = 0;
    }

    Animiraj() {


        if(tasteri['KeyW'] && tasteri['KeyA'] && !tasteri['KeyS'] && !tasteri['KeyD'])
        {
            this.y += -(speed*Math.sqrt(2))/2;
            this.x += -((speed*Math.sqrt(2))/2);
        }

        if(tasteri['KeyW'] && tasteri['KeyD'] && !tasteri['KeyS'] && !tasteri['KeyA'])
        {
            this.y += -(speed*Math.sqrt(2))/2;
            this.x += ((speed*Math.sqrt(2))/2);
        }

        if(tasteri['KeyS'] && tasteri['KeyA'] && !tasteri['KeyD'] && !tasteri['KeyW'])
        {
            this.y += (speed*Math.sqrt(2))/2;
            this.x += -((speed*Math.sqrt(2))/2);
        }

        if(tasteri['KeyS'] && tasteri['KeyD'] && !tasteri['KeyA'] && !tasteri['KeyW'])
        {
            this.y += (speed*Math.sqrt(2))/2;
            this.x += ((speed*Math.sqrt(2))/2);
        }

        if(tasteri['KeyW'] && !tasteri['KeyA'] && !tasteri['KeyD']) {
            //console.log('uso');
            this.y += -speed;
        }

        if(tasteri['KeyS'] && !tasteri['KeyA'] && !tasteri['KeyD']) {
            this.y += speed;
        }

        if(tasteri['KeyA'] && !tasteri['KeyW'] && !tasteri['KeyS']) {
            this.x += -speed;
        }
        
        if(tasteri['KeyD'] && !tasteri['KeyW'] && !tasteri['KeyS']) {
            this.x += speed;
        }

        //this.x += this.dx;
        //this.y += this.dy;

        if(this.x - this.r < 0) {
            this.x = 0 + this.r;
        }
        if(this.x + this.r > canvas.width) {
            this.x = canvas.width - this.r;
        }
        if(this.y + this.r > canvas.height) {
            this.y = canvas.height - this.r;
        }
        if(this.y - this.r < 0) {
            this.y = 0 + this.r;
        }
    }

    Isctraj() {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        context.fillStyle = this.col;
        context.fill();
        context.closePath();
    }
}

class Enemy{
    constructor(x, y, r, col, hp){
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;

        this.speed = enemySpeed;

        this.hp = hp;
        this.dx = 0;
        this.dy = 0;
    }

    draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        context.fillStyle = this.col;
        context.fill();
        context.closePath();
    }

    update(){
        let vel_x = igrac.x - this.x;
        let vel_y = igrac.y - this.y;

        let dist = Math.sqrt(vel_x * vel_x + vel_y * vel_y);
        this.dx = vel_x / dist;
        this.dy = vel_y / dist;

        this.dx *= this.speed;
        this.dy *= this.speed;

        this.x += this.dx;
        this.y += this.dy;
    }
}

function drawCrosshair() {
    context.beginPath();
    context.arc(mouse.x, mouse.y, 10, 0, 2*Math.PI);
    context.strokeStyle = '#FF0000';
    context.stroke();
    context.closePath();

    context.beginPath();
    context.arc(mouse.x, mouse.y, 2, 0, 2*Math.PI);
    context.fillStyle = "#FF0000";
    context.fill();
    context.closePath();

    context.beginPath();
    context.moveTo(mouse.x + 7, mouse.y);
    context.lineTo(mouse.x + 13, mouse.y);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(mouse.x - 7, mouse.y);
    context.lineTo(mouse.x - 13, mouse.y);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(mouse.x, mouse.y + 7);
    context.lineTo(mouse.x, mouse.y + 13);
    context.stroke();
    context.closePath();
    
    context.beginPath();
    context.moveTo(mouse.x, mouse.y - 7);
    context.lineTo(mouse.x, mouse.y - 13);
    context.stroke();
    context.closePath();
}

function shoot(){
    if(ammo > 0 && pauseInterval == null){
        let bullet = new Circle(igrac.x, igrac.y, 5, 'white');

        let vel_x = mouse.x - bullet.x;
        let vel_y = mouse.y - bullet.y;

        let dist = Math.sqrt(vel_x * vel_x + vel_y * vel_y);
        bullet.dx = vel_x / dist;
        bullet.dy = vel_y / dist;

        bullet.dx *= speed;
        bullet.dy *= speed;

        bullets.push(bullet);
        ammo--;
    }
}

function randomInt(min, max){
    return Math.round(Math.random()* (max-min) + min);
}

function startFire(){
    shoot();
    fireInterval = setInterval(shoot, 1000/fireRate);
}

function stopFire(){
    clearInterval(fireInterval);
}

function printAmmo(){
    context.fillStyle = 'white';
    context.font = '20px Comic Sans';
    context.fillText('AMMO ' + ammo.toString(), 0, canvas.height);
}

function printWave(){
    context.fillStyle = 'white';
    context.font = '30px Comic Sans';
    context.fillText('WAVE' + wave.toString(), 0, 0+30);
}

function enemiesRemaining(){
    context.fillStyle = 'white';
    context.font = '30px Comic Sans';
    context.fillText('Enemies remaining: ' + waveCountSpawn.toString(), 0 + 300, 0 + 30);
}

function kreirajPrepreke(){
    let num = randomInt(1, 4);
    console.log(num);
    let hp = randomInt(3, 5);
    let col;

    if(hp == 3)
        col = 'blue';
    else if(hp == 4)
        col = 'yellow';
    else if(hp == 5)
        col = 'red';

    let enemy;

    if(num == 1){
        enemy = new Enemy(0 + randomInt(0, canvas.width), 0, 20, col, hp);
    }
    
    else if(num == 2){
        enemy = new Enemy(0 + randomInt(0, canvas.width), canvas.height, 20, col, hp);
    }

    else if(num == 3){
        enemy = new Enemy(canvas.width, 0 + randomInt(0, canvas.height), 20, col, hp);
    }

    else if(num == 4){
        enemy = new Enemy(canvas.width, canvas.height - randomInt(0, canvas.height), 20, col, hp);
    }

    enemies.push(enemy);
}

function dotDistance(x, y, x1, y1){
    return Math.sqrt(Math.pow(x-x1, 2) + Math.pow(y-y1, 2));
}

function gameOverScreen(){
    context.clearRect(0, 0, context.width, context.height);
    context.fillStyle = 'white';
    context.font = 'bold 50px Comic Sans';
    context.textAlign = 'center';
    context.fillText('GAME OVER!', canvas.width/2, canvas.height/2 - 200);
    context.font = '30px Comic Sans';
    context.fillText('Score: ' + score.toString(), canvas.width/2, canvas.height/2 - 100);
    context.fillText('Waves survived: ' + (wave-1).toString(), canvas.width/2, canvas.height/2 - 50)
    context.fillText('High Scores', canvas.width/2, canvas.height/2);
    if(sessionStorage.getItem('hiScore1')){
        context.fillText('1. ' + sessionStorage.getItem('hiScore1'), canvas.width/2, canvas.height/2 + 50);
    }
    if(sessionStorage.getItem('hiScore2')){
        context.fillText('2. ' + sessionStorage.getItem('hiScore2'), canvas.width/2, canvas.height/2 + 100);
    }
    if(sessionStorage.getItem('hiScore2')){
        context.fillText('3. ' + sessionStorage.getItem('hiScore3'), canvas.width/2, canvas.height/2 + 150);
    }
}

function printScore(){
    context.fontStyle = 'white';
    context.font = '30px Comic Sans';
    context.fillText('SCORE: ' + score.toString(), canvas.width - 500, canvas.height);
}

function printLives(){
    context.fillStyle = 'white';
    context.font = '30px Comic Sans';
    context.fillText('LIVES: ' + lives.toString(), canvas.width-200, 0+30);
}

function scoreIncrement(){
    if(pauseInterval == null && gameOver == false)
        score += 10;
}

function pocni(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;

    if(sessionStorage.getItem('hiScore1')) {
        hiScoreList.push(parseInt(sessionStorage.getItem('hiScore1')));
    }

    if(sessionStorage.getItem('hiScore2')) {
        hiScoreList.push(parseInt(sessionStorage.getItem('hiScore2')));
    }

    if(sessionStorage.getItem('hiScore3')) {
        hiScoreList.push(parseInt(sessionStorage.getItem('hiScore3')));
    }

    context.font = "15px sans-serif";

    igrac = new Igrac(canvas.width/2, canvas.height/2, 10, "#FFFFFF");
    scoreIncInterval = setInterval(scoreIncrement, 1000);
    
    requestAnimationFrame(loop);
}

let enemy = new Enemy(0, 0, 20, 'blue');

let original_timer = 120;
let timer = original_timer;

function loop(){
    requestAnimationFrame(loop);

    if(gameOver == false){
        context.clearRect(0, 0, canvas.width, canvas.height);

        if(pauseInterval == null && waveCountSpawn != 0){
            timer--;
            if(timer <= 0){
                kreirajPrepreke();
                waveCountSpawn--;
                timer = original_timer;
            }
        }

        drawCrosshair();
        printAmmo();
        printWave();
        printLives();
        printScore();
        enemiesRemaining();

        if(pauseInterval != null){
            context.fillStyle = 'white';
            context.font = '50px Comic Sans';
            context.fillText((n).toString(), canvas.width/2, canvas.height/2);
        }

        igrac.Animiraj();
        igrac.Isctraj();

        for(let i = 0; i < enemies.length; ++i){
            let enemy = enemies[i];
            enemy.draw();
            enemy.update();
            if(dotDistance(enemy.x, enemy.y, igrac.x, igrac.y) <= (enemy.r + igrac.r)){
                lives--;
                waveCount--;
                enemies.splice(i, 1);
            }
            if(lives <= 0){
                gameOver = true;
                hiScoreList.push(score);
                hiScoreList.sort((a, b) => b - a);
                console.log(hiScoreList);
                if(hiScoreList[0] != undefined && hiScoreList[0] != null)
                    sessionStorage.setItem('hiScore1', hiScoreList[0]);
                if(hiScoreList[1] != undefined && hiScoreList[1] != null)
                    sessionStorage.setItem('hiScore2', hiScoreList[1]);
                if(hiScoreList[2] != undefined && hiScoreList[2] != null)
                    sessionStorage.setItem('hiScore3', hiScoreList[2]);
                gameOverScreen();
            }
        }

        for(let i = 0; i < drops.length; ++i){
            drops[i].draw();

            let drop = drops[i];
            let circleDrop = new Circle(drop.x + (drop.w/2), drop.y + (drop.h/2), drop.h/2, '');

            if(dotDistance(igrac.x, igrac.y, circleDrop.x, circleDrop.y) <= (circleDrop.r + igrac.r)) {
                if(drop.col == 'green') {
                    ammo+=20;
                    drops.splice(i, 1);
                }
                else if(drop.col == 'blue') {
                    for(let i = 0; i < enemies.length; ++i){
                        let enemy = enemies[i];
                        enemy.speed = 0;
                    }
                    drops.splice(i, 1);
                }
                else if(drop.col == 'red') {
                    lives++;
                    drops.splice(i, 1);
                }
                else if(drop.col == 'orange') {
                    waveCount -= enemies.length;
                    enemies.splice(0, enemies.length); 
                    drops.splice(i, 1);
                }
                //console.log('usao');
            }
        }

        for(let i = 0; i < bullets.length; ++i){
            let bullet = bullets[i];

            bullet.x += bullet.dx;
            bullet.y += bullet.dy;

            if(bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height){
                bullets.splice(i, 1);
            }

            bullet.update();

            for(let j = 0; j < enemies.length; ++j){
                let enemy = enemies[j];

                if(enemy != undefined){
                    //console.log(enemy);

                    let ex = bullet.x - enemy.x;
                    let ey = bullet.y - enemy.y;
                    let distance = Math.sqrt(ex * ex + ey * ey);

                    //console.log(distance);

                    if (distance < bullet.r + enemy.r){
                        //console.log("hit");
                        bullets.splice(i, 1);
                        enemy.hp--;
                        if(enemy.hp<=0){
                            let x = enemy.x;
                            let y = enemy.y;
                            enemies.splice(j, 1);
                            score += 50;
                            waveCount--;
                            let drop = randomInt(1, 100);
                            console.log(drop);
                            if(drop % 3 == 0){
                                let rect = new Rectangle(x, y, 20, 20, 'green');
                                drops.push(rect);
                            }
                            else if(drop % 5 == 0){
                                let rect = new Rectangle(x, y, 20, 20, 'blue');
                                drops.push(rect);
                            }
                            else if(drop % 11 == 0){
                                let rect = new Rectangle(x, y, 20, 20, 'red');
                                drops.push(rect);
                            }
                            else if(drop == 97 || drop == 43 || drop == 19 || drop == 23){
                                let rect = new Rectangle(x, y, 20, 20, 'orange');
                                drops.push(rect);
                            }
                        }
                    }
                }
            }
        }

        if(waveCount <= 0){
            n = 10;
            waveCount = 20;
            waveCountSpawn = 20;
            enemySpeed *= 1.05;
            fireRate *= 1.05;
            original_timer *= 0.95;
            wave++;
            pauseInterval = setInterval(function(){
                n--;
                if(n <= 0){
                    n = 10;
                    clearInterval(pauseInterval);
                    pauseInterval = null;
                }
            }, 1000);
        }
    }
    // else{
    //     context.clearRect(0, 0, context.width, context.height);
    //     gameOverScreen();
    // }
}

pocni();