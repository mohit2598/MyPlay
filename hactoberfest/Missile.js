function Missile() {
  this.pos = createVector(width/2,height);
  this.hit = false;
  this.launched = false;
  this.done = false;
  this.target = createVector(0,0,0);
  this.r = 5;
  this.speed = 2;

  this.launch = function() {
    this.checkhit(this.target);
    if (this.hit === false && this.launched === true) {
      path = p5.Vector.sub(this.target, this.pos);
      path.div(path.mag());
      this.update(path);
      this.show();
    } else if (this.launched === true && this.hit === true) {
      song.play();
      this.explode();
      // song.stop();
    }
  }

  this.show = function() {
    push();
    fill(255);
    stroke(255);
    line(width/2,height,this.pos.x,this.pos.y);
    fill(255,36,36);
    ellipse(this.pos.x+0.5,this.pos.y,3,3);
    pop();
  }

  this.update = function(path) {
    path.mult(this.speed);
    this.pos.add(path);
  }

  this.checkhit = function(target) {
    var dist = 0;
    dist = p5.Vector.sub(target, this.pos);
    if (dist.mag() < 1) {
      this.hit = true;
      this.explode();
    }
  }

  this.explode = function() {
    if (this.r > 75) {
      this.done = true;
    } else {
      push();
      fill(255,255,255,100);
      stroke(255,255,255,100);
      ellipse(this.pos.x,this.pos.y,this.r,this.r);
      this.r = this.r + 0.5;
      pop();
    }
  }


  this.reset = function() {
    pos = createVector(width/2,height);
    this.target = createVector(0,0,0);
    this.r = 5;
    this.launched = false;
    this.hit = false;
  }
  
  this.disable = function() {
    pos = null;
    this.target = 0;
  }
  
}
