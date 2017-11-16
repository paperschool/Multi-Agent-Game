class Actor extends Rectangle {

  constructor(x,y,fx = 0.9,fy = 0.9,s = 1.0,ts = 10.0) {

    super(x,y,0,0);

    // living state of actor
    this.alive = true;

    // lifespan
    this.lifespan = 0;

    // direction value in degrees
    this.direction = 0;

    // calulcated Acceleration based off of input / friction
    this.acc = new SAT.Vector(0,0);

    // final velocity applies to actor
    this.vel = new SAT.Vector(0,0);

    // friction applies to acceleration vector before being set to velocity
    this.friction = new SAT.Vector(0.9,0.9);

    // player speed increment
    this.speed = s;

    // speed cap
    this.topSpeed = ts;

    // weapon actor is holding
    this.weapon = null;

  }

  getShot(){
    return this.shot;
  }

  getAlive(){
    return this.alive;
  }

  getDirection(){
    return this.direction;
  }

  getAcc(){
    return this.acc;
  }

  getVel(){
    return this.vel;
  }

  getFriction(){
    return this.friction;
  }

  getSpeed(){
    return this.speed;
  }

  getTopSpeed(){
    return this.topSpeed;
  }

  getWeapon(){
    return this.weapon;
  }

  getLifespan(){
    return this.lifespan;
  }

  setAlive(alive){
    this.alive = alive;
  }

  setDirection(direction){
    this.direction = direction;
  }

  setAcc(acc){
    this.acc.set(acc);
  }

  setVel(vel){
    this.vel.set(vel);
  }

  setFriction(friction){
    this.friction.set(friction);
  }

  setSpeed(speed){
    this.speed = speed;
  }

  setTopSpeed(speed){
    this.topSpeed = speed;
  }

  setWeapon(weapon){
    this.weapon = weapon;
  }

  setLifespan(lifespan){
    this.lifespan = lifespan;
  }

  setShot(shot){
    this.shot = shot;
  }

  flipDirection(){
      this.direction += 180;
  }

  applyAcc(newAcc){

    // checking speed
    if(Math.abs(this.acc.x) <= this.topSpeed){
      this.acc.add(new SAT.Vector(newAcc.x,0));
    }

    if(Math.abs(this.acc.y) <= this.topSpeed){
      this.acc.add(new SAT.Vector(0,newAcc.y));
    }

  }

  applyFriction(){
    this.acc.scale(this.friction.x,this.friction.y);
  }

  calculateDirection(pointFrom,pointTo){
    this.direction = Utility.Degrees(Utility.angle(pointFrom,pointTo));
  }

  update(deltaTime){
    super.update(deltaTime);
  }

  draw(camera){
    super.draw(camera);
  }

}
