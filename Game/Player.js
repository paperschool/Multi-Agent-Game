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

    this.speed = 8;

    this.topSpeed = 20;

    this.dir = 0;

    this.colour = null;

    this.colliding = false;

    this.friction = new SAT.Vector(0.90,0.90);

    // this.grav = new SAT.Vector(0,9);

  }

  keyEvent(key) {

    // console.log(key);

    switch(key) {

      // case "UP"   : this.acc.add(this.acc.,-this.speed); break;
      // case "DOWN" : this.acc.add(this.acc.x, this.speed); break;
      // case "LEFT" : this.acc.add(-this.speed,this.acc.y); break;
      // case "RIGHT": this.acc.add( this.speed,this.acc.y); break;

      case "UP"   : this.applyAcc(0,-this.speed); break;
      case "DOWN" : this.applyAcc(0, this.speed); break;
      case "LEFT" : this.applyAcc(-this.speed,0); break;
      case "RIGHT": this.applyAcc( this.speed,0); break;
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

  applyAcc(x,y){

    if(this.acc.x < this.topSpeed){
      this.acc.add({x:x,y:0});
    }

    if(this.acc.y < this.topSpeed){
      this.acc.add({x:0,y:y});
    }

  }

  applyVelocity(deltaTime){

    this.acc.mul(this.friction)

    if(Math.abs(this.acc.x) < 1) this.acc.x = 0;
    if(Math.abs(this.acc.y) < 1) this.acc.y = 0;


    this.vel.set(this.acc.x,this.acc.y);

    this.pos.add(this.vel);

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
