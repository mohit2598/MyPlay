let images = [];
let grass;
let road;
let myFile;
let x = 0;
let y = 0;
let myData;
let pos;
var car;
function preload() {
  result = loadStrings("track.txt"); 
  images[0] = loadImage("images/grass.png");
  images[1] = loadImage("images/road.png");
  images[2] = loadImage("images/start.png");
  images[3] = loadImage("images/car.png");
}
function setup() {
 
  createCanvas(900, 800);
  x=17+ 9 * 60;
  y=60 + 1 * 45;
  grass=new Group();
  road=new Group();
  for( let i = 0; i < result.length; i++){
    //text(result[i], 20, 60 + i * 20);
    myData = splitTokens(result[i], " ");
    for( j= 0; j < myData.length; j++){
      if(myData[j]=="0"){
        let temp=createSprite(20+ i * 60, 60 + j * 45);
        temp.scale = 0.2150;
        temp.addImage(images[0]);
        grass.add(temp);
        console.log(temp.height);
        console.log(temp.width);
        // drawSprite(sprite[1]);
        
      }
      else if(myData[j]=="2"){
        let temp=createSprite(20+ i * 60, 60 + j * 45);
        temp.scale = 0.20;
        temp.addImage(images[2]);
        // drawSprite(sprite[3]);
        
      }else{
        let temp=createSprite(20+ i * 60, 60 + j * 45);
        temp.scale = 0.23;
        temp.addImage(images[1]);
        road.add(temp);
        // drawSprite(sprite[2]);
      }
    }
  }

  car = createSprite(x,y);
  car.scale = 0.10;
  car.addImage(images[3]);
  car.addSpeed(0.1,0);
  pos=car.position;
}



function draw(){
  //background(93, 185, 60    );
  drawSprites();
  
  
  if (car.overlap(grass)) {
    car.position.x = x;
    car.position.y=y;
    car.rotation=0;
    car.setSpeed(0,0);
  }
  
}
function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    car.rotation+=10;
    car.setSpeed(car.getSpeed(), car.rotation);
  }
  else if (keyCode == DOWN_ARROW) {
    car.setSpeed(car.getSpeed()-0.1, 0);
  }
  else if (keyCode == LEFT_ARROW) {
    car.rotation-=2;
    car.setSpeed(car.getSpeed(), car.rotation);
  }
  else if (keyCode == UP_ARROW) {
    car.setSpeed(car.getSpeed()+0.1, 0);
  }
  else if (key == ' ') {
    car.setSpeed(0, 0);
  }
  return false;
}

