
class World {

  constructor(w,h){
    this.worldW = w;
    this.worldH = h;

    this.player = new Player(100,100,50);

  }

  update(){}

  draw(){
    Draw.clear(0,0,1000,1000);

    Draw.fill(51,255,255,1.0);
  	Draw.rect(0,0,this.worldW,this.worldH);

    this.player.update();
    this.player.draw();

  }

}

class Player {

  constructor(x,y,size){

    // positional data
    this.pos = new SAT.Vector(x,y);
    this.acc = new SAT.Vector(0,0);
    this.vel = new SAT.Vector(0,0);

    // physics
    this.input = new Input(this.mouseMoveEvent.bind(this),this.mouseDownEvent.bind(this),this.keyEvent.bind(this));

    this.size = size;

    this.direction = 0;

  }

  keyEvent(key){
    console.log(key);

    switch(key){
      case "w" : break;
      case "a" : break;
      case "s" : break;
      case "d" : break;
    }

  }

  mouseMoveEvent(e){
    // console.log(e);
    // this.pos.x = e.x;
    // this.pos.y = e.y;
  }

  mouseDownEvent(e){
    // console.log(e);
  }

  applyVelocity(){

  }

  update(){

    // this.direction = Utility.VectorAngle(this.pos,mousePos);

    this.direction = Math.atan2(this.pos.sub(mousePos));

    console.log(this.direction);

  }

  draw(){

    Draw.fill(51,51,51,1.0);

    Draw.save();

    Draw.rotate(this.direction);

    Draw.rect(this.pos.x-this.size/2,this.pos.y-this.size/2,this.size,this.size);

    Draw.restore();

    // line from player to mouse;
    Draw.line(this.pos.x,this.pos.y,mousePos.x,mousePos.y);

    Draw.line(this.pos.x,mousePos.y,mousePos.x,mousePos.y);

    Draw.line(this.pos.x,this.pos.y,this.pos.x,mousePos.y);


  }

}
