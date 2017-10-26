

class World {

  constructor(w,h){

    this.size = new SAT.Vector(w,h)

    this.player = new Player(200,200,50);

    this.level = new Level();

  }

  update(deltaTime){

    this.level.update();

    this.player.update();

  }

  draw(){

    Draw.clear(0,0,1000,1000);

    Draw.fill(51,255,255,1.0);

    Draw.rect(0,0,this.size.x,this.size.y);

    this.level.draw();

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

  }

  keyEvent(key){

    console.log(key);

    switch(key){
      case "w" :  this.vel.x = 0;
                  this.vel.y = -1;
                  break;
      case "a" :  this.vel.x = -1;
                  this.vel.y = 0;
                  break;
      case "s" :  this.vel.x = 0;
                  this.vel.y = 1;
                  break;
      case "d" :  this.vel.x = 1;
                  this.vel.y = 0;
                  break;
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

    this.pos.add(this.vel);

    this.acc.x *= 0.98;
    this.acc.y *= 0.98;

  }

  update(deltaTime){
    this.applyVelocity();
  }

  draw(){

    Draw.fill(51,51,51,1.0);
    Draw.rect(this.pos.x-this.size/2,this.pos.y-this.size/2,this.size,this.size);


  }

}
