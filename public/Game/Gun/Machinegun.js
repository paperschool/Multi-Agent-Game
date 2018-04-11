class Machinegun extends Gun {

  constructor(x,y){
    super(x,y,0,0,0);
    this.setFireRate(5);
    this.setRange(300);
    this.setSpeed(5)
    this.setRicochetCount(1);
    this.setDamage(2);
    this.setShotCount(1);

  }

  fire(player){
    if(this.cycling <= 0) {

      sound.play(SoundLabel.MACHINEGUN);


      for(let b = 0 ; b < this.getShotCount() ; b++){

        this.bullets.push(
          new Machinegun_Bullet(
            this.pos.x,
            this.pos.y,
            this.getSpeed(),
            this.getDirection(),
            this.getRange(),
            this.getRicochetCount(),
            this.getDamage()
          )
        );
      }
      this.cycling = this.fireRate;
      return true;
    } else {
      return false;
    }
  }

}

class Machinegun_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc,dmg){
    super(x,y,s,d,l,rc,dmg);
    this.setBulletAccuracy(1);
    // this.setSpeed(100);

    this.setTrail(30);

    this.colour = new Colour(200,0,20);
  }

  update(deltaTime){

    super.update(deltaTime);

    this.colour.g += 10;

    this.direction+=Utility.Random(-0.5,0.5);

  }

  draw(camera){

    super.draw(camera);

    // Draw.line(
    //   this.getPos().x-camera.x,
    //   this.getPos().y-camera.y,
    //   this.getOldPos().x-camera.x,
    //   this.getOldPos().y-camera.y,
    //   5,this.colour.getHex())



  }

}
