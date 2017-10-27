class Player {

  constructor(x,y,size){

    // player positions
    this.playerBody = null;

    // collision surface for player
    this.playerCol = new SAT.Polygon(new SAT.Vector(x,y),this.playerBody);

    // positional data
    this.pos = new SAT.Vector(x,y);
    this.acc = new SAT.Vector(0,0);
    this.vel = new SAT.Vector(0,0);

    // physics
    this.input = new Input(this.mouseMoveEvent.bind(this),this.mouseDownEvent.bind(this),this.keyEvent.bind(this));

    this.size = size;

    this.speed = 10;

    this.dir = 0;

    this.colour = null;

    this.colliding = false;

  }

  keyEvent(key){

    console.log(key);

    switch(key){
      case "UP" :  this.vel.x = 0;
                  this.vel.y = -this.speed;
                  break;
      case "LEFT" :  this.vel.x = -this.speed;
                  this.vel.y = 0;
                  break;
      case "RIGHT" :  this.vel.x = this.speed;
                  this.vel.y = 0;
                  break;
      case "DOWN" :  this.vel.x = 0;
                  this.vel.y = this.speed;
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

  applyVelocity(deltaTime){

    this.pos.add(this.vel);

    this.vel.x *= this.acc.x;
    this.vel.y *= this.acc.y;

    this.acc.x *= 0.99;
    this.acc.y *= 0.99;

  }

  checkCollision(foreignBody){

    if(SAT.testPolygonPolygon(this.playerCol, foreignBody)){
      this.colliding = true;
    } else {
      this.colliding = false;
    }
  }

  update(deltaTime){

    this.applyVelocity(deltaTime);
    this.dir = Utility.Degrees(Utility.angle(this.pos,mousePos));

    // stored points in SAT Object for drawing and collisions
    this.playerCol.setPoints(Draw.polygonQuad(this.pos.x,this.pos.y,40.0,20.0,this.dir));

  }

  draw(){

    if(this.colliding){
      Draw.fill(70,51,255,1.0);
    } else {
      Draw.fill(100,200,255,1.0);
    }

    Draw.polygon('#f00',this.playerCol.getPoints());

    Draw.polygonOutline(this.playerCol.getPoints());

    Draw.line(this.pos.x,this.pos.y,mousePos.x,mousePos.y)


  }

}
