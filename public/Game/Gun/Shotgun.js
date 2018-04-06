class Shotgun extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(20);
    this.setRange(100);
    this.setRicochetCount(1)
    this.setSpeed(15);
    this.setShotCount(10)
    this.spread = 5;
  }

  update(deltaTime){
    super.update(deltaTime);
  }

  fire(player){
    if(this.cycling <= 0) {
      for(let b = 0 ; b < this.shotCount ; b++){
        this.bullets.push(new Shotgun_Bullet(
          this.pos.x,
          this.pos.y,
          this.getSpeed()+Utility.RandomInt(-this.spread,this.spread),
          this.getDirection()+Utility.RandomInt(-this.spread,this.spread),
          this.getRange(),
          this.getRicochetCount(),
          player.getAcc())
        )
      }
      this.cycling = this.fireRate;
    }
  }
}

class Shotgun_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc,acc){

    super(x,y,s,d,l,rc);

    this.setBulletAccuracy(4);

    this.colour = new Colour(255,0,0,1);

  }

  update(deltaTime){

    super.update(deltaTime);

    this.colour.g += 40;

    this.direction+= Utility.Random(-2,2);

  }

  draw(camera){

    super.draw(camera);

  }

}
