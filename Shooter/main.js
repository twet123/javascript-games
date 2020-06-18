const canvas = document.getElementById('igra');
const context = canvas.getContext('2d');

let bullets = [];
let enemies = [];
let fireRate = 10;
let fireInterval = null;
let speed = 6;
let enemiesKilled = 0;
let score = 0;
let hiScore = 0;

let mouse = {
    x: canvas.width/2,
    y: canvas.height/2
}

document.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

});

//document.addEventListener('click', shoot);

document.addEventListener('mousedown', startFire);
document.addEventListener('mouseup', stopFire);

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

class Enemy{
    constructor(x, y, r, col){
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;

        this.hp = 2;
        this.dx = -speed;
    }

    draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        context.fillStyle = this.col;
        context.fill();
        context.closePath();
    }

    update(){
        this.x += this.dx;
        this.draw();
        this.dx = -speed;
    }
}

function printScore(){
    context.fillStyle = 'yellow';
    context.font = '20px Comic Sans';
    context.fillText('Score: ' + score.toString(), 0, 20);
    context.font = '10px Comic Sans';
    context.fillText('Hi-Score: ' + hiScore.toString(), 200, 10);
}

function randomInt(min, max){
    return Math.round(Math.random()* (max-min) + min);
}

function kreirajPrepreke(){
    let velicina = randomInt(10, 30);
    let enemy = new Enemy(canvas.width - velicina, randomInt(0 + velicina, canvas.height - velicina), velicina, '#FF000F');
    
    enemies.push(enemy);
  }

function shoot(){
    let bullet = new Circle(player.x, player.y, 5, 'white');

    let vel_x = mouse.x - bullet.x;
    let vel_y = mouse.y - bullet.y;

    let dist = Math.sqrt(vel_x * vel_x + vel_y * vel_y);
    bullet.dx = vel_x / dist;
    bullet.dy = vel_y / dist;

    bullet.dx *= speed;
    bullet.dy *= speed;

    bullets.push(bullet);
}

function startFire(){
    shoot();
    fireInterval = setInterval(shoot, 1000/fireRate);
}

function stopFire(){
    clearInterval(fireInterval);
}

let player;

function start(){
    player = new Circle(0, canvas.height/2, 30, '#DF00FE');
}

let original_timer = 180;
let timer = original_timer;


function loop(){
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    timer--;
    if(timer <= 0){
        kreirajPrepreke();
        timer = original_timer - speed * 8;
        console.log(timer);

        if(timer < 40)
            timer = 40;
    }

    for(let i = 0; i < enemies.length; ++i){
        let enemy = enemies[i];

        if (enemy.x + enemy.r < 0){
            score -= 50;
            enemies.splice(i ,1);
        }

        enemy.update();
    }

    for(let i = 0; i < bullets.length; ++i){
        let bullet = bullets[i];

        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        if(bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height){
            bullets.splice(i, 1);
        }

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
                        enemies.splice(j, 1);
                        enemiesKilled++;
                        if(enemiesKilled != 0 && enemiesKilled % 7 == 0)
                            fireRate += 2;
                        score += 100;
                        if(score > hiScore)
                            hiScore = score;
                    }
                }
            }
        }

        bullet.update();
    }

    player.update();

    printScore();

    if(speed < 20)
        speed += 0.001;
}

start();
loop();