class Player {

  constructor(x,y,size,level){

    // player positions
    this.playerBody = null;

    // collision surface for player
    this.playerCol = new SAT.Polygon(new SAT.Vector(x,y),this.playerBody);

    // positional data
    this.pos = new SAT.Vector(x,y);

    this.acc = new SAT.Vector(0,0);

    this.vel = new SAT.Vector(0,0);

    // rendering

    // player position in the virtual world
    this.worldPosition = new SAT.Vector(0,0);

    this.levelSize = new SAT.Vector(level.x,level.y);

    // physics

    this.size = size;

    this.speed = 10;

    this.topSpeed = 10;

    this.dir = 0;

    this.colour = null;

    this.collided = false;
    this.colliding = false;

    this.friction = new SAT.Vector(0.90,0.90);

    // this.grav = new SAT.Vector(0,9);

  }

  input(type,value){
    if(type === "MOUSE"){

    }
    if(type === "KEYBOARD"){
      switch (value) {
        case "UP"   : this.applyAcc(0,-this.speed); break;
        case "DOWN" : this.applyAcc(0, this.speed); break;
        case "LEFT" : this.applyAcc(-this.speed,0); break;
        case "RIGHT": this.applyAcc( this.speed,0); break;
        default:
      }
    }
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

    this.acc.mul(this.friction);

    if(Math.abs(this.acc.x) < 1) this.acc.x = 0;
    if(Math.abs(this.acc.y) < 1) this.acc.y = 0;

    this.vel.set(this.acc.x,this.acc.y);

    this.checkWorldBounds();

    if(this.collided){
      this.vel.x = 0;
      this.vel.y = 0;
    }

    // calculating new world position
    this.worldPosition.add(this.vel);

  }

  checkWorldBounds(){

    if(this.worldPosition.x + this.vel.x <= 0) this.vel.set(-this.vel.x*0.5,this.vel.y);

    if(this.worldPosition.x + this.vel.x >= this.levelSize.x) this.vel.set(-this.vel.x*0.1,this.vel.y);

    if(this.worldPosition.y + this.vel.y <= 0) this.vel.set(this.vel.x,-this.vel.y*0.5);

    if(this.worldPosition.y + this.vel.y >= this.levelSize.y) this.vel.set(this.vel.x,-this.vel.y*0.5);


  }

  checkCollision(foreignBody){

    if(SAT.testPolygonPolygon(this.playerCol, foreignBody.wall)){
      // console.log("Collided With Wall",r.overlap);
      foreignBody.colliding = true;
      this.collided = true;
    } else {
      foreignBody.colliding = false;
      this.collided = false;
    }
  }

  update(deltaTime){

    // calculating velocity from acceleration, friction etc
    this.applyVelocity(deltaTime);

    this.dir = Utility.Degrees(Utility.angle(this.pos,mousePos));

    // stored points in SAT Object for drawing and collisions

    // redrawing polygon as from a normalised position
    this.playerCol = new SAT.Polygon(
      new SAT.Vector(this.pos.x,this.pos.y),
      Draw.polygonQuadNorm(40.0,20.0,this.dir)
    )

  }

  draw(){

    if(this.colliding){
      Draw.fill(70,51,255,1.0);
    } else {
      Draw.fill(100,200,255,1.0);
    }

    Draw.polygon('#f00',this.playerCol.getPoints());

    Draw.polygonOutline(Draw.polygonQuad(this.pos.x,this.pos.y,40.0,20.0,this.dir));

    Draw.line(this.pos.x,this.pos.y,mousePos.x,mousePos.y)


  }

}
