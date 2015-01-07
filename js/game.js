var canvasID, context;
var cursorX = 0, cursorY = 0;
var canvasX = 0, canvasY = 0, canvasW = 800, canvasH = 600;
var playerScore=0, aiScore=0;

///end declarations

function OnMouseMove(e){
    cursorX = e.pageX-canvasX;
    cursorY = e.pageY-canvasY;
}

$(document).ready(function(){
    canvasID = document.getElementById("canvas");
    canvasID.addEventListener("mousemove", OnMouseMove, false);
    context = canvasID.getContext('2d');
    var rect = canvasID.getBoundingClientRect();
    canvasX = rect.left; canvasY = rect.top;
    canvasW = rect.right-canvasX; canvasH = rect.bottom-canvasY;
});

function DrawScores(){
    context.fillStyle = "white";
    context.font = "16px sans-serif";
    context.fillText(aiScore, 30,30);
    context.fillText(playerScore, canvasW-50,30);
}

function Ball(){
    this.radius = 8;
    this.x = canvasW/2;
    this.y = canvasH/2;
    this.vx = 5;
    this.vy = 0;

    this.Draw = function(){
        context.fillStyle = "white";

        context.beginPath();  //HTML5 cant draw circles.  draw an arc instead.
        context.arc(this.x, this.y, this.radius, 0, 3.1416*2);
        context.closePath();

        context.fill();
    };

    this.Update = function(){
        this.x += this.vx;
        this.y += this.vy;

        if(this.x >= playerPaddle.x - playerPaddle.w/2 - this.radius){
            if(this.y >= playerPaddle.y - playerPaddle.h/2 && this.y <= playerPaddle.y + playerPaddle.h/2){
                this.vy = (playerPaddle.y-this.y)*-0.4;
                this.x = playerPaddle.x - playerPaddle.w/2 - this.radius;
                this.vx*=-1;
            }else{
                aiScore++;
                this.vy=0;
                this.x = canvasW/2;
                this.y = canvasH/2;
            }
            aiPaddle.AIChangeOffset();
        }
        if(this.x <= aiPaddle.x + aiPaddle.w/2 + this.radius){
            if(this.y >= aiPaddle.y - aiPaddle.h/2 && this.y <= aiPaddle.y + aiPaddle.h/2){
                this.vy = (aiPaddle.y-this.y)*-0.2;
                this.x = aiPaddle.x + aiPaddle.w/2 + this.radius;
                this.vx*=-1;
            }else{
                playerScore++;
                this.vy=0;
                this.x = canvasW/2;
                this.y = canvasH/2;
            }
        }

        if(this.y<this.radius){
            this.vy*=-1; this.y=this.radius;}
        else if(this.y>canvasH-this.radius){
            this.vy*=-1; this.y=canvasH-this.radius;}
    }
}

function Paddle(){
    this.x=0;
    this.y = canvasH/2;
    this.w = 32;
    this.h=64;

    this.aiv=9;
    this.aiOffset = 0;

    this.Draw = function(){
        context.fillStyle="white";
        context.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    };

    this.FloorAndCeiling = function(){
        if(this.y < this.h/2) this.y = this.h/2;
        if(this.y > canvasH-this.h/2) this.y = canvasH-this.h/2;
    };

    this.PlayerUpdate = function(){
        this.y = cursorY;

        this.FloorAndCeiling();
    };

    this.AIUpdate = function(){
        if(ball.vx < 0){
            if(ball.y + this.h*this.aiOffset > this.y -this.aiv){
                if(this.y+this.aiv<ball.y + this.h*this.aiOffset)
                    this.y+=this.aiv;
                else
                    this.y=ball.y + this.h*this.aiOffset;
            }
            if(ball.y + this.h*this.aiOffset < this.y + this.aiv){
                if(this.y-this.aiv>ball.y + this.h*this.aiOffset)
                    this.y-=this.aiv;
                else
                    this.y=ball.y + this.h*this.aiOffset;
            }

            this.FloorAndCeiling();
        }
    };

    this.AIChangeOffset = function(){
        this.aiOffset = (Math.random()-0.5)*0.9;
    }


}

var ball = new Ball();
var aiPaddle = new Paddle(), playerPaddle = new Paddle();
playerPaddle.x = canvasW;

function Run(){
    aiPaddle.AIUpdate();
    playerPaddle.PlayerUpdate();
    ball.Update();

    context.fillStyle="black";

    context.clearRect(0,0, canvasW, canvasH);
    context.fillRect(0,0, canvasW, canvasH);

    ball.Draw();
    aiPaddle.Draw();
    playerPaddle.Draw();
    DrawScores();
}

setInterval(Run,20); //!!IMPORTANT!! tells the browser to call Run() every 20ms