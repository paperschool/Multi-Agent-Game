
class Agent extends Actor {

  constructor(x,y){
    super(x,y,0.9,0.9,3.0,6.0);

    this.setAlive(true);

    this.setSpeed(0.5);

    this.setTopSpeed(10.0);

    this.setSize(new SAT.Vector(50,50));

    this.colour = new Colour().random();

    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    this.direction = 90;

    this.isColliding = false;

    this.setShot(false);

  }

  update(deltaTime){
    super.update(deltaTime)

    if(this.getShot()){
      this.setAlive(false);
    }

    if(this.isColliding){

      this.setDirection(this.getDirection() + Utility.Random(1,50));

      this.isColliding = false;

    }

    this.applyAcc(
        new SAT.Vector(
          (this.speed*deltaTime) * Math.cos(Utility.Radians(this.direction)),
          (this.speed*deltaTime) * Math.sin(Utility.Radians(this.direction))
        )
    );

    // redrawing collision polygon from a normalised position
    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    this.evaluateVelocity(deltaTime);

    // calculating angle of player relative to mouse (Kinda hacky as i know player is centered)

    // this.calculateDirection();


  }

  draw(camera){
    // super.draw(camera);

    if(this.getAlive()){
      Draw.fillCol(this.colour)
      Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.direction));
    }
  }


}
