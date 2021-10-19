var missile = [];
var bombs = [];
var total = 5;
var score = 0;
var health = 100;
var players = [];
var numGames = 0;
var scoreTotal = 0;

function setup() {
  createCanvas(600,400);
  song = loadSound('explode2.mp3');
  bg = loadImage('missile.png');
  for (var i = 0; i < 5; i++) {
    bombs.push(new bomb());
  }
}

function draw() {
  background(bg);
  stroke(0);
  fill(36,255,36);
  text("Score: " + score, 5, 15);
  text("Health: " + health, 5, 30);
  for (var i = 0; i < bombs.length; i++) {
    checkbase(i);
    bombs[i].update();
    bombs[i].show();
    collide(i);
    }

  for (let i = 0; i < missile.length; i++) {
    if (missile[i].launched === true) {
      missile[i].launch();
    }
    if (missile[i].done === true) {
      missile.splice(i,1);
    }
  }
}

function checkbase1(i) {
  if (bombs[i].pos.y > height) {
    health = health - 10;
    bombs.splice(i,1);
    bombs.push(new bomb());
  }
}
function mousePressed() {
  if (mouseX < width && mouseY < height) {
    if (missile.length < total) {
      missile.push(new Missile());
      target = createVector(mouseX, mouseY);
      missile[missile.length-1].target = target;
      missile[missile.length-1].launched = true;
      missile[missile.length-1].launch();
    }
  }
}

function collide(i) {
  for (var j = 0; j < missile.length; j++) {
    dist = p5.Vector.sub(bombs[i].pos, missile[j].pos);
    if (dist.mag() < missile[j].r/1.75) {
      bombs[i].dead = true;
      bombs.splice(i,1);
      bombs.push(new bomb());
      score = score + 10;
    }
  }
}

function checkbase(i) {
  if (bombs[i].pos.y > height) {
    health = health - 10;
    bombs.splice(i,1);
    bombs.push(new bomb());
  }
}
