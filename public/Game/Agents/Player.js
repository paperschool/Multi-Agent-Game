class Player extends Actor {

  constructor(x,y){

    // calling super with position, friction, speed and top speed values
    super(x,y,0.9,0.9,3.0,6.0);

    this.setSpeed(1.5);

    this.setTopSpeed(10.0);

    this.setCollider(new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction)));

    this.setInvincibility(false);

    // this.collider = new CircularCollider(this.pos.x,this.pos.y,40);

  }

  getInvincibility(){
    return this.invincible;
  }

  setInvincibility(set){
    this.invincible = set;
  }

  applyDamage(bullet){

    if(!this.invincible){

      let d = Math.floor(20 * ((1.0 / bullet.getInitialLifeSpan()) * bullet.getLifespan()));

      // diagnostic.updateLine("-Bullet Dmg",bullet);
      this.life -= bullet.getBulletDamage();

    }

  }


  // method given to player only for checking input states
  checkKeyboardInput(deltaTime){

    // if up is pressed apply a negative vertical acc
    if(input.isDown(InputKeys.UP))    this.applyImpulse(new SAT.Vector(0.0,-this.speed));

    // if down is pressed apply a positive vertical acc
    if(input.isDown(InputKeys.DOWN))  this.applyImpulse(new SAT.Vector(0.0,this.speed));

    // if left is pressed apply a negative horizontal acc
    if(input.isDown(InputKeys.LEFT))  this.applyImpulse(new SAT.Vector(-this.speed,0.0));

    // if right is pressed apply a positive horizontal acc
    if(input.isDown(InputKeys.RIGHT)) this.applyImpulse(new SAT.Vector(this.speed,0.0));

  }

  // method given to player only for checking input states
  checkMouseInput(){

    if(input.mouse.click && input.mouse.button === "LEFT"){
      if(this.weapon !== null){
        this.weapon.setAttemptedFire(true);
        if(this.weapon.fire(this)){
          this.getLevel().ParticleSystem.addParticle(this.getPos().x,this.getPos().y,this.getDirection(),ParticleType.GUNSMOKE);
          this.getLevel().camera.resetShake(this.getWeapon().getDamage()*2);
        }
      }
    } else {
      if(this.weapon !== null){
        this.weapon.setAttemptedFire(false);
      }
    }

  }

  // TODO: Fix poor association to parent class
  update(deltaTime){


    // calculating angle of player relative to mouse (Kinda hacky as i know player is centered)
    this.calculateDirection({x:CW/2,y:CH/2},input.mouse);

    // checking for user input
    this.checkKeyboardInput(deltaTime);

    this.checkMouseInput();

    super.update(deltaTime);

    if(this.getLevel().grid.isOutsideBounds(this.getPos())) this.rollBackPosition();

    // redrawing collision polygon from a normalised position
    // this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    this.collider.rebuild(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));


    if(this.getLife() <= 0) this.setAlive(false);

    if(this.weapon) {
      this.weapon.setPos(this.getPos());
      this.weapon.setDirection(this.getDirection());
      this.weapon.update(deltaTime);

      for(var i = 0 ; i < this.weapon.bullets.length ; i++)
          this.weapon.bullets[i].update(deltaTime);
    }

    diagnostic.updateLine("Acc: ",Math.round(Utility.pyth(this.acc.x,this.acc.y) * 1000) / 1000);
    diagnostic.updateLine("Vel: ",Math.round(Utility.pyth(this.vel.x,this.vel.y) * 1000) / 1000);

  }

  draw(camera){

    Draw.fillHex(gameTheme['PLAYER'])

    // Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,40);

    Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.direction));

    // Draw.line(this.pos.x-camera.x,this.pos.y-camera.y,input.mouse.x,input.mouse.y);

    // this.sprite.draw(camera);

    if(this.weapon) this.weapon.draw(camera);

  }

}
