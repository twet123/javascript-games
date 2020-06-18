const canvas = document.getElementById("igra");
const context = canvas.getContext("2d");

//Promenljive
let score;
let highScore;
let igrac;
let gravity;
let prepreke;
let gameSpeed;
let tasteri = {};
let kliknuto = false;
let kvadrati = [];
let maxY;

document.addEventListener("keydown", function(event){
    tasteri[event.code] = true;
});

document.addEventListener("keyup", function(event){
    tasteri[event.code] = false;
});

document.addEventListener("mousedown", function(event){
    kliknuto = true;
})

class Kvadrat{
    constructor(x, y, w, h, col){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.col = col;

        this.dy = 0;
        this.snagaSkoka = 0;
        this.naZemlji = true;
        this.visinaSkoka = 15;
        this.skokFlag = false;
        this.ponovniSkok = true;
    }

    Animiraj(){
        if(tasteri["ArrowUp"]){
            this.Skoci();
        } else{
            this.snagaSkoka = 0;
            this.ponovniSkok = true;
        }

        this.y += this.dy;

        if(this.y + this.h < canvas.height){
            this.dy += gravity;
            this.naZemlji = false;
            if(this.y < canvas.height/2)
            {
                this.y = canvas.height/2;
            }
        } else{
            if(this.skokFlag){
                this.dy = -15;
                this.skokFlag = false;
            }
            else
                this.dy = 0;
            this.naZemlji = true;
            this.y = canvas.height - this.h;
            // this.snagaSkoka = 2;
            // this.Skoci();
        }

        this.Iscrtaj();
    }

    Skoci(){
        if(this.naZemlji && this.snagaSkoka == 0 && this.ponovniSkok){
            this.skokFlag = true;
            this.snagaSkoka = 1;
            this.dy = -this.visinaSkoka;
        } else if(this.snagaSkoka > 0 ){
            if(this.y <= canvas.height/2){
                this.snagaSkoka = 0;
                this.ponovniSkok = false;
            }
            else{
                this.snagaSkoka++;
                this.dy = -this.visinaSkoka - (this.snagaSkoka / 50);
            }
    
        }

        // if(this.naZemlji && this.snagaSkoka == 0){
        //     this.snagaSkoka = 1;
        //     this.dy = -this.visinaSkoka;
        // } else if(this.snagaSkoka > 0 && this.snagaSkoka < 10){
        //     this.snagaSkoka++;
        //     this.dy = -this.visinaSkoka - (this.snagaSkoka / 50);
        // }
    }

    Padni(){
        this.y += this.dy;

        if(this.y + this.h < canvas.height){
            this.dy += gravity;
        } else{
            this.dy = 0;
            this.y = canvas.height - this.h;
        }

        this.Iscrtaj();
    }

    Iscrtaj(){
        context.beginPath();
        context.fillStyle = this.col;
        context.fillRect(this.x, this.y, this.w, this.h);
        context.closePath();
    }
}

class Igrac{
    constructor(x, y, w, h, col){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.col = col;

        this.dy = 0;
        this.visinaSkoka = 15;
        this.originalnaVisina = h;
        this.naZemlji = false;
        this.snagaSkoka = 0;
    }

    Animiraj(){

        if(tasteri['Space']){
            this.Skoci();
        } else{
            this.snagaSkoka = 0;
        }

        this.y += this.dy;

        if(this.y + this.h < canvas.height){
            this.dy += gravity;
            this.naZemlji = false;
        } else{
            this.dy = 0;
            this.naZemlji = true;
            this.y = canvas.height - this.h;
        }

        this.Iscrtaj();
    }

    Skoci(){
        if(this.naZemlji && this.snagaSkoka == 0){
            this.snagaSkoka = 1;
            this.dy = -this.visinaSkoka;
        } else if(this.snagaSkoka > 0 && this.snagaSkoka < 10){
            this.snagaSkoka++;
            this.dy = -this.visinaSkoka - (this.snagaSkoka / 50);
        }
    }

    Iscrtaj(){
        context.beginPath();
        context.fillStyle = this.col;
        context.fillRect(this.x, this.y, this.w, this.h);
        context.closePath();
    }
}

function pocni(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;

    context.font = "15px sans-serif";

    gameSpeed = 2;
    gravity = 1;
    score = 0;
    highScore = 0;

    igrac = new Igrac(25, 0, 50, 50, "#000000");
    kvadrati[0] = new Kvadrat(100, 0, 50, 50, "#000000");
    kvadrati[1] = new Kvadrat(kvadrati[0].x + kvadrati[0].w + 10, 0, 50, 50, "#000000");
    kvadrati[2] = new Kvadrat(kvadrati[1].x + kvadrati[1].w + 10, 0, 50, 50, "#000000");
    kvadrati[3] = new Kvadrat(kvadrati[2].x + kvadrati[2].w + 10, 0, 50, 50, "#000000");
    kvadrati[4] = new Kvadrat( (canvas.width - 50) / 2, canvas.height - 50, 50, 50, "#000000");

    maxY = canvas.height;
    
    requestAnimationFrame(loop);
}

function loop(){
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    igrac.Animiraj();

    if(kliknuto){
        kvadrati[0].Padni();
        if(kvadrati[0].y > canvas.height/2)
            kvadrati[1].Padni();
        if(kvadrati[1].y > canvas.height/2)
            kvadrati[2].Padni();
        if(kvadrati[2].y > canvas.height/2)
            kvadrati[3].Padni();
    }

    if(kvadrati[4].y < maxY)
        maxY = kvadrati[4].y;

    //console.log(igrac.snagaSkoka); 

    kvadrati[0].Iscrtaj()
    kvadrati[1].Iscrtaj();
    kvadrati[2].Iscrtaj();
    kvadrati[3].Iscrtaj();
    kvadrati[4].Animiraj();
}

pocni();