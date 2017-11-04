class Player {

  constructor(x,y,size,level){

    // player positions
    this.playerBody = null;

    // collision surface for player
    this.playerCol = new SAT.Polygon(new SAT.Vector(x,y),this.playerBody);

    // setting canvas position (constant);
    this.pos = new SAT.Vector(x,y);

    this.acc = new SAT.Vector(0,0);

    this.testVel = new SAT.Vector(0,0);

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

    this.friction = new SAT.Vector(0.95,0.95);

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

    if(Math.abs(this.acc.x) < this.topSpeed){
      this.acc.add({x:x,y:0});
    }

    if(Math.abs(this.acc.y) < this.topSpeed){
      this.acc.add({x:0,y:y});
    }

  }

  evaluateVelocity(deltaTime){

    this.acc.mul(this.friction);

    if(Math.abs(this.acc.x) <= 1) this.acc.x = 0;
    if(Math.abs(this.acc.y) <= 1) this.acc.y = 0;

    // applying calculated velocity to test velocity
    this.testVel.set(this.acc.x,this.acc.y);

  }

  checkCollision(foreignBody,response){
    // returning outcome of collision test
    return SAT.testPolygonPolygon(this.playerCol, foreignBody.wall,response);
  }

  evaluateCollisions(level){

    for(var wall = 0 ; wall < level.walls.length ; wall++){

      let testWall = level.walls[wall];

      let r = new SAT.Response();

      // checking horizontal vector first
      if(SAT.testPolygonPolygon(this.playerCol, testWall.wall,r)){
        // console.log("collision horizontal: " + this.testVel.x + " : " + this.testVel.y);
        console.log(testWall.id +  " collision: " + r.overlapV.x + " : " + r.overlapV.y);
        testWall.colliding = true;
        r.overlapV.scale(1.001)
        this.testVel.sub(r.overlapV);
      }

    }

    // setting final velocity after acceleration
    this.vel.set(this.testVel.x,this.testVel.y);

    // setting offset position
    this.worldPosition.add(this.vel)

    // returning calculated player position as vector to offset level
    level.setLevelProjectionOffset(this.vel);

  }

  // TODO: Fix poor association to parent class
  update(deltaTime,level){

    this.input();

    // redrawing collision polygon as from a normalised position
    this.playerCol = new SAT.Polygon(
      new SAT.Vector(this.pos.x,this.pos.y),
      Draw.polygonQuadNorm(40.0,20.0,this.dir)
    )

    // calculating angle of player relative to mouse
    this.dir = Utility.Degrees(Utility.angle(this.pos,mousePos));

    // calculating velocity from acceleration, friction etc
    this.evaluateVelocity(deltaTime);

    // calculating collision changes
    this.evaluateCollisions(level);

  }

  draw(){

    Draw.polygon('#f00',this.playerCol.getPoints());

    Draw.polygonOutline(Draw.polygonQuad(this.pos.x,this.pos.y,40.0,20.0,this.dir));

    Draw.line(this.pos.x,this.pos.y,mousePos.x,mousePos.y);

    Draw.line(this.pos.x,this.pos.y,this.pos.x,this.pos.y + this.vel.y*10);

    Draw.line(this.pos.x,this.pos.y,this.pos.x + this.vel.x*10,this.pos.y);

    Draw.fill(255,0,0);
    Draw.text(20,"serif","center",new SAT.Vector(this.pos.x + this.vel.x*11,this.pos.y),Math.floor(this.vel.x));

    Draw.text(20,"serif","center",new SAT.Vector(this.pos.x,this.pos.y + this.vel.y*11),Math.floor(this.vel.y));


  }

}
