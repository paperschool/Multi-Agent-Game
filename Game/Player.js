class Player extends Actor {

  constructor(x,y){

    // calling super with position, friction, speed and top speed values
    super(x,y,0.9,0.9,3.0,6.0);

    this.setSpeed(1.0);
    this.setTopSpeed(10.0);

    // COLLISIONS
    this.playerCol = new SAT.Polygon (
      new SAT.Vector(this.pos.x,this.pos.y),
      Draw.polygonQuadNorm(40.0,20.0,this.direction)
    )

  }

  // method given to player only for checking input states
  checkKeyboardInput(){

    // if up is pressed apply a negative vertical acc
    if(input.isDown("UP"))    this.applyAcc(new SAT.Vector(0.0,-this.speed));

    // if down is pressed apply a positive vertical acc
    if(input.isDown("DOWN"))  this.applyAcc(new SAT.Vector(0.0,this.speed));

    // if left is pressed apply a negative horizontal acc
    if(input.isDown("LEFT"))  this.applyAcc(new SAT.Vector(-this.speed,0.0));

    // if right is pressed apply a positive horizontal acc
    if(input.isDown("RIGHT")) this.applyAcc(new SAT.Vector(this.speed,0.0));

  }

  // method given to player only for checking input states
  checkMouseInput(){

    if(input.mouse.click && input.mouse.button === "LEFT"){
      if(this.weapon !== null)
        this.weapon.fire();
    }

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

  }

  // TODO: Fix poor association to parent class
  update(deltaTime){

    // checking for user input
    this.checkKeyboardInput();

    this.checkMouseInput();

    // redrawing collision polygon from a normalised position
    this.playerCol = new SAT.Polygon (
      new SAT.Vector(this.pos.x,this.pos.y),
      Draw.polygonQuadNorm(40.0,20.0,this.direction)
    )

    // calculating angle of player relative to mouse (Kinda hacky as i know player is centered)
    this.calculateDirection({x:CW/2,y:CH/2},input.mouse);

    // calculating velocity from acceleration, friction etc
    this.evaluateVelocity(deltaTime);

    // adding velocity to position vector
    this.pos.add(this.vel);

  }

  draw(camera){

    Draw.fillCol(this.colour)
    Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.direction));
    Draw.line(this.pos.x-camera.x,this.pos.y-camera.y,input.mouse.x,input.mouse.y);



    // Draw.fill(51,255,51);
    // Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,10)

    // Draw.line(this.pos.x-camera.x,this.pos.y-camera.y,this.pos.x,this.pos.y + this.vel.y*10);
    //
    // Draw.line(this.pos.x-camera.x,this.pos.y-camera.y,this.pos.x + this.vel.x*10,this.pos.y);
    //
    // Draw.fill(255,0,0);
    // Draw.text(20,"serif","center",new SAT.Vector(this.pos.x + this.vel.x*11,this.pos.y),Math.floor(this.vel.x));
    //
    // Draw.text(20,"serif","center",new SAT.Vector(this.pos.x,this.pos.y + this.vel.y*11),Math.floor(this.vel.y));

    // this.playerSprite.draw();

  }

}
