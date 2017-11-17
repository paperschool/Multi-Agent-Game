class Player extends Actor {

  constructor(x,y){

    // calling super with position, friction, speed and top speed values
    super(x,y,0.9,0.9,3.0,6.0);

    this.setSpeed(1.0);

    this.setTopSpeed(10.0);

    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    // this.collider = new CircularCollider(this.pos.x,this.pos.y,40);

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
        this.weapon.fire(this);
    }

  }

  // TODO: Fix poor association to parent class
  update(deltaTime){

    // checking for user input
    this.checkKeyboardInput();

    this.checkMouseInput();

    // redrawing collision polygon from a normalised position
    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));
    // this.collider = new CircularCollider(this.pos.x,this.pos.y,40);
    // this.collider.setPos(this.pos);

    // calculating angle of player relative to mouse (Kinda hacky as i know player is centered)
    this.calculateDirection({x:CW/2,y:CH/2},input.mouse);

    // calculating velocity from acceleration, friction etc
    this.evaluateVelocity(deltaTime);


    if(this.weapon) this.weapon.update(deltaTime);

  }

  draw(camera){

    Draw.fillCol(this.colour)

    // Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,40);

    Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.direction));

    Draw.line(this.pos.x-camera.x,this.pos.y-camera.y,input.mouse.x,input.mouse.y);

    if(this.weapon) this.weapon.draw(camera);

  }

}
