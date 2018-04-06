class Machinegun extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(2);
    this.setRange(300);
    this.setRicochetCount(1)
  }

  fire(player){
    if(this.cycling <= 0) {
      this.bullets.push(new Machinegun_Bullet(this.pos.x,this.pos.y,5,this.direction,this.getRange(),this.getRicochetCount()));
      this.cycling = this.fireRate;
    }
  }
}

class Machinegun_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc){
    super(x,y,s,d,l,rc);
    this.setBulletAccuracy(1);
    // this.setSpeed(100);
    this.colour = new Colour().randomRGBLock(200,255,true,true,false);
  }

  update(deltaTime){

    super.update(deltaTime);

    this.direction+=Utility.Random(-0.5,0.5);

    // console.log(this.ricochetCount)

  }

  draw(camera){

    super.draw(camera);

  }

}
