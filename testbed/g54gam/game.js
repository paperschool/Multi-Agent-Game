function windowResized(){
  resizeCanvas(innerWidth,innerHeight);
  cam.setOrigin(createVector(width/2,height/2));
}

let can = null;
let cam = null;

let player = null;

function setup(){
  can = createCanvas(innerWidth,innerHeight);
  can.parent("editor_canvas")

  cam = new Camera(createVector(width/2,height/2))

  player = new Player(
    createVector(width/2,height/2),
    createVector(100,100)
  );

}

function draw(){

  background(51);

  stroke(255,0,0);
  strokeWeight(2);
  line(
    0+cam.getX(),
    -400+cam.getY(),
    0+cam.getX(),
    400+cam.getY()
  )

  stroke(0,255,0);
  line(
    -400+cam.getX(),
    0+cam.getY(),
    400+cam.getX(),
    0+cam.getY()
  )



  noStroke();


  fill(255,255,255,100);
  ellipse(
    0+cam.getX(),
    0+cam.getY(),
    dist(0+cam.getX(),0+cam.getY(),player.pos.x,player.pos.y)*2
  );

  cam.update();
  cam.draw();

  player.update();
  player.draw();

}

class Player {

  constructor(p,s){
    this.pos  = createVector(p.x,p.y);
    this.size = createVector(s.x,s.y);
    this.movement = 20;

  }

  update(){
    // up
    if(keyIsDown(87)){
      this.pos.y += this.movement;
    }

    // down
    if(keyIsDown(83)){
      this.pos.y -= this.movement;
    }

    // left
    if(keyIsDown(65)){
      this.pos.x += this.movement;
    }

    // right
    if(keyIsDown(68)){
      this.pos.x -= this.movement;
    }

  }

  draw(){
    fill(255,100,200);
    rect(
      this.pos.x-(this.size.x/2)+cam.getX(),
      this.pos.y-(this.size.y/2)+cam.getY(),
      this.size.x,this.size.y
    );
  }

}


class Camera {

  constructor(origin){
    this.origin = createVector(origin.x,origin.y);
    this.offset = createVector(0,0);
    this.movement = 20;
  }

  setOrigin(origin){
    this.origin = createVector(origin.x,origin.y);
  }

  setFocus(focus){
    this.focus = focus;
  }

  getOffset(){
    return this.offset;
  }

  getX(){
    return this.offset.x;
  }

  getY(){
    return this.offset.y;
  }

  update(){

    // up
    if(keyIsDown(87)){
      this.offset.y += this.movement;
    }

    // down
    if(keyIsDown(83)){
      this.offset.y -= this.movement;
    }

    // left
    if(keyIsDown(65)){
      this.offset.x += this.movement;
    }

    // right
    if(keyIsDown(68)){
      this.offset.x -= this.movement;
    }

    console.log(this.offset.x);

  }

  draw(){
    fill(255,0,0);
    ellipse(this.origin.x,this.origin.y,10);
  }

}
