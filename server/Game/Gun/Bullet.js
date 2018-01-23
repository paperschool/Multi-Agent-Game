class Bullet extends Actor {

  constructor(x,y,s,d,l,rc){
    super(x,y,0,0,s,0);

    this.colour = new Colour().random();;

    this.setSize(new SAT.Vector(5,5));

    this.setInitialLifeSpan(l);

    this.setLifespan(l);

    this.setDirection(d);

    this.setRicochetCount(rc);

    this.setAcc(new SAT.Vector(
      Math.cos(Utility.Radians(this.getDirection())),
      Math.sin(Utility.Radians(this.getDirection()))
    ));

    this.getAcc().scale(this.getSpeed());

    this.setFriction(new SAT.Vector(0.98,0.98));

    this.setAirResistance(1.01);

    // 0 implies no random wobble
    this.setBulletAccuracy(0);

    this.collider = new CircularCollider(this.pos.x,this.pos.y,this.size.x);

  }

  getBulletAccuracy(){
    return this.bulletAccurracy;
  }

  // getting the friction multiplier
  getAirResistance(){
    return this.airResistance;
  }

  getInitialLifeSpan(){
    return this.initialLifeSpan;
  }

  getRicochetCount(){
    return this.ricochetCount;
  }

  setBulletAccuracy(bulletAccurracy){
    return this.bulletAccurracy = bulletAccurracy;
  }

  setInitialLifeSpan(lifespan){
    this.initialLifeSpan = lifespan;
  }

  // a number that multiplies the friction effect on projectiles
  setAirResistance(airResistance){
    this.airResistance = airResistance;
  }

  setRicochetCount(count){
    this.ricochetCount = count;
  }

  evaluateVelocity(deltaTime){
    super.evaluateVelocity(deltaTime)

    // adding bullet inaccuracy
    this.getPos().add(new SAT.Vector(
      Utility.Random(-this.getBulletAccuracy(),this.getBulletAccuracy()),
      Utility.Random(-this.getBulletAccuracy(),this.getBulletAccuracy())
    ));

  }

  update(deltaTime){

    // lifecycle methods
    if(!this.alive) return;

    // decrimenting life
    this.lifespan--;

    // checking ricochetCount count;
    if(this.ricochetCount <= 0) this.setAlive(false);

    // killing actor when lifespan ends
    if(this.lifespan <= 0) this.setAlive(false);

    // killing bullet when its too slow
    if(this.getAcc().x === 0 && this.getAcc().y === 0) this.setAlive(false);

    // updating collider center position with current position
    this.collider.setPos(this.pos);

    this.evaluateVelocity(deltaTime);


  }

  draw(camera){

    if(this.alive){
      Draw.fillCol(this.colour);
      Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,5);
    }

  }


}
