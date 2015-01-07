var canvas, context, cursor, width, height, r;
var ball, paddle, aiPaddle;
var state = 0; //0 = initial state, 1 = game, 2 = game_over
var scores = [0,0]; //Element zero is player score, element 1 is ai score. Game ends when one player gets to 3

//Gets canvas and canvas context, binds mouse movement function
$(document).ready(function() {
    canvas = document.getElementById("canvas");
    canvas.addEventListener("mousemove", function(e) {
        cursor = e.pageY - r.top;
    });
    canvas.addEventListener("click", function() {
       state = 1;
    });
    context = canvas.getContext("2d");
    context.fillStyle = "black";
    r = canvas.getBoundingClientRect();
    width = r.width;
    height = r.height;
    ball = new Ball();
    paddle = new Paddle(false);
    aiPaddle = new Paddle(true);
});

function drawMessage() {
    context.fillStyle = "white";
    context.font = "40px sans-serif";
    context.textAlign = "center";
    t = "Click to Start";
    if(state == 2) {
        t = "You Lost! Click to Try Again";
        scores = [0,0];
    }
    else if(state == 3) {
        t = "You Won! Click to Play Again";
        scores = [0,0];
    }
    if(state != 1)
        context.fillText(t, width/2, height/2);
}

function drawScores() {
    context.fillStyle = "white";
    context.font = "16px sans-serif";
    context.textAlign = "right";
    context.fillText(scores[0], width-25, 35);
    context.textAlign = "left";
    context.fillText(scores[1], 25, 35);
}

function Ball() {
    this.x = width/2;
    this.y = height/2;
    this.vx = 6;
    this.vy = 0;
    this.radius = 8;

    this.draw = function() {
        context.fillStyle = "white";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    };

    this.reset = function() {
        this.x = width/2;
        this.y = height/2;
        this.vx = 6;
        this.vy = 0;
    };

    this.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        if(this.x + this.radius >= paddle.x && this.y >= paddle.y - paddle.height/2&& this.y <= paddle.y + paddle.height/2) {
            this.vx = -this.vx;
            this.x = paddle.x - this.radius;
            this.vy = (this.y - paddle.y) * 0.25;
        }
        else if(this.x < aiPaddle.x + aiPaddle.width && this.y >= aiPaddle.y - aiPaddle.height/2 && this.y <= aiPaddle.y + aiPaddle.height/2) {
            this.vx = -this.vx;
            this.x = aiPaddle.x + aiPaddle.width;
            this.vy = (this.y - aiPaddle.y) * 0.25;
            aiPaddle.offset = (Math.random() - 0.5);
        }
        else if(this.x <= this.radius) {
            scores[0] += 1;
            this.reset();
        }
        else if(this.x + this.radius >= width) {
            scores[1] += 1;
            this.reset();
        }
        else if(this.y <= this.radius || this.y + this.radius >= height) {
            this.vy = -this.vy;
        }

    };
}

function Paddle(aiflag) {
    if(aiflag) {
        this.x = 0;
        this.v = 10;
        this.offset = 0;
    }
    else this.x = width-16;
    this.y = height/2;
    this.height = 64;
    this.width = 16;
    this.ai = aiflag;

    this.draw = function() {
        context.fillStyle = "white";
        context.fillRect(this.x, this.y-this.height/2, this.width, this.height);
    };

    this.update = function() {
        if(this.ai) {
            if (ball.vx < 0) {
                if(ball.y + this.height * this.offset > this.y - this.v){
                    if(this.y + this.v < ball.y + this.height * this.offset)
                        this.y += this.v;
                    else
                        this.y = ball.y + this.height * this.offset;
                }
                if(ball.y + this.height * this.offset < this.y + this.v){
                    if(this.y - this.v > ball.y + this.height * this.offset)
                        this.y -= this.v;
                    else
                        this.y = ball.y + this.height * this.offset;
                }
                if (this.y < this.height / 2) this.y = this.height / 2;
                if (this.y + this.height / 2 > height) this.y = height - this.height / 2;
            }
        }
        else {
            this.y = cursor;
            if(this.y < this.height/2) this.y = this.height/2;
            if(this.y + this.height/2 > height) this.y = height - this.height/2;
        }
    }
}

function run() {
    context.fillStyle = "black";
    context.clearRect(0, 0, width, height);
    context.fillRect(0,0, width, height);
    drawMessage();

    if(state == 1) {
        ball.update();
        ball.draw();
        paddle.update();
        aiPaddle.update();
        paddle.draw();
        aiPaddle.draw();
        drawScores();
    }

    if(scores[0] >= 3)
        state = 3;
    else if(scores[1] >= 3)
        state = 2;

}

setInterval(run, 20);