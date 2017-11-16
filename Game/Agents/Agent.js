
class Agent extends Actor {

  constructor(x,y){
    super(x,y,0.9,0.9,3.0,6.0);

    this.setSpeed(1.0);

    this.setTopSpeed(10.0);

    this.setSize(new SAT.Vector(50,50));

    this.colour = new Colour().random();

    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

  }

  evaluateVelocity(deltaTime){

    // zeroing velocity when its too low
    if(Math.abs(this.acc.x) <= 0.0001) this.acc.x = 0;
    if(Math.abs(this.acc.y) <= 0.0001) this.acc.y = 0;

    // calling friction applicator
    this.applyFriction();

    // applying calculated velocity to test velocity
    this.vel.set(this.acc);

    this.vel.scale(deltaTime);

    // adding velocity to position vector
    this.pos.add(this.vel);

  }

  update(deltaTime){
    super.update(deltaTime)

    let move = new SAT.Vector(Utility.Random(-1,1),Utility.Random(-1,1));

    this.applyAcc(move);

    // calculating angle of player relative to mouse (Kinda hacky as i know player is centered)
    this.calculateDirection(this.pos,this.pos.add(move));

    console.log(this.direction);

    // redrawing collision polygon from a normalised position
    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));


    this.evaluateVelocity(deltaTime);


  }

  draw(camera){
    // super.draw(camera);

    Draw.fillCol(this.colour)

    Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.direction));


  }


}
