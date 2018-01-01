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

    this.initialLife = 100;

    // life variable
    this.life = 100;

    this.sprite = new Sprite("Game/Assets/Sprites/topDown.gif",250,213,this.pos.x,this.pos.y,1);

    // switch debug draw on or off
    this.debugOn = false;

  }

  getDebugOn(){
    return this.debugOn;
  }

  getLife(){
    return this.life;
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

  setDebugOn(debugOn){
    this.debugOn = debugOn;
  }

  setLife(life){
    this.life = life;
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

  applyDamage(bullet){

    // function that applies damage to the player
    diagnostic.updateLine("-Bullet Dmg",Math.floor(20 * ((1.0 / bullet.getInitialLifeSpan()) * bullet.getLifespan())));
    this.life -= 20 * ((1.0 / bullet.getInitialLifeSpan()) * bullet.getLifespan());

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

  evaluateVelocity(deltaTime){

    // zeroing velocity when its too low
    if(Math.abs(this.acc.x) <= 0.0001) this.acc.x = 0;
    if(Math.abs(this.acc.y) <= 0.0001) this.acc.y = 0;

    // calling friction applicator
    this.applyFriction();

    // applying calculated velocity to test velocity
    this.vel.set(this.acc);

    // scaling velocity to deltatime
    this.vel.scale(deltaTime);

    // adding velocity to position vector
    this.pos.add(this.vel);

  }

  applyFriction(){
    this.acc.scale(this.friction.x,this.friction.y);
  }

  calculateDirection(pointFrom,pointTo){
    this.direction = Utility.Degrees(Utility.angle(pointFrom,pointTo));
  }

  pointInVision(other){

    // normalised vector from center of cone to other position
    let ab = Utility.pointsToVector(this.getPos(),other);
    ab.normalize();

    // get normalised vector of center of cone
    let a = new SAT.Vector()
    a.set(this.getPos());
    a.normalize()

    let dab = Utility.Dot(a,ab);

    let angle = Math.acos(dab);

    console.log(Utility.Degrees(angle),this.direction);

  }

  update(deltaTime){
    super.update(deltaTime);
  }

  draw(camera){
    super.draw(camera);
  }

}
