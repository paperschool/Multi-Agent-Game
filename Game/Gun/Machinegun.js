class Machinegun extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(2);
    this.setRange(300);
    this.setRicochetCount(1)
  }

  fire(player){
    if(this.cycling <= 0) {
      this.bullets.push(new Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,15,player.direction,this.getRange(),this.getRicochetCount()));
      this.cycling = this.fireRate;
    }
  }
}

class Machinegun_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc){
    super(x,y,s,d,l,rc);
    this.setBulletAccuracy(1);
  }

  update(deltaTime){

    super.update(deltaTime);

    this.direction+=Utility.Random(-0.5,0.5);

  }

  draw(camera){

    super.draw(camera);

  }

}
