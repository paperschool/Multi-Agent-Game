class Actor extends Entity {

  constructor(x,y,fx = 0.9,fy = 0.9,s = 1.0,ts = 10.0) {

    super(x,y,0,0);

    // direction value in degrees
    this.direction = 0;

    // calulcated Acceleration based off of input / friction
    this.acc = new SAT.Vector(0,0);

    // final velocity applies to actor
    this.vel = new SAT.Vector(0,0);

    // friction applies to acceleration vector before being set to velocity
    this.friction = new SAT.Vector(0.9,0.9);

    // player speed increment
    this.speed = 3.0;

    // speed cap
    this.topSpeed = 6.0;

    // weapon actor is holding
    this.weapon = null;

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

  setDirection(direction){
    this.direction.set(direction);
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
    console.log("Actor Recieved Weapon");
    this.weapon = weapon;
  }

  givePickUp(pickup){

    switch(pickup.type){
      case PickupType.GENERIC: break;

      case PickupType.HEALTH: break;

      case PickupType.GUN: break;

    }

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



}
