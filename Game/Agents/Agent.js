
class Agent extends Actor {

  constructor(x,y){

    super(x,y,0.9,0.9,3.0,6.0);

    this.setLife(10000);

    this.setAlive(true);

    this.setSpeed(0.2);

    this.setTopSpeed(10.0);

    this.setSize(new SAT.Vector(50,50));

    this.path = null;

    this.colour = new Colour(255,100,100);

    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    this.direction = 90;

    this.isColliding = false;

  }

  getPath(){
    return this.path;
  }

  getNext(){
    return this.path[1];
  }

  setPath(path){
    this.path = path;
  }

  getPathDirection(){
    if(this.getPath().length > 1) {
      return this.calculateDirection(this.getPos(),this.getNext());
    } else {
      return null;
    }
  }

  update(deltaTime){

    if(this.life <= 0) {  this.alive = false; return; }


    super.update(deltaTime)

    // if(this.isColliding){
    //
    //   this.setDirection(this.getDirection() + Utility.Random(1,50));
    //
    //   this.isColliding = false;
    //
    // }

    this.getPathDirection();

    this.applyAcc(
        new SAT.Vector(
          (this.speed*deltaTime) * Math.cos(Utility.Radians(this.direction)),
          (this.speed*deltaTime) * Math.sin(Utility.Radians(this.direction))
        )
    );

    // redrawing collision polygon from a normalised position
    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    this.evaluateVelocity(deltaTime);

    this.colour.setA(Utility.Map(this.life,0,this.initialLife,0.0,1.0));


  }

  draw(camera){
    // super.draw(camera);

    if(this.getAlive()){

      Draw.fillCol(this.colour);
      Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.direction));
    }
  }


}
