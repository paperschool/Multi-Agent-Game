class Shotgun extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(30);
    this.setRange(100);
    this.setRicochetCount(2)
  }

  update(deltaTime){

    super.update(deltaTime);

    this.setDirection(this.getDirection()+Utility.Random(-5,5));

  }

  fire(player){
    if(this.cycling <= 0) {
      this.bullets.push(new Shotgun_Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,15,player.direction+2,this.getRange(),this.getRicochetCount()));
      this.bullets.push(new Shotgun_Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,15,player.direction-2,this.getRange(),this.getRicochetCount()));
      this.bullets.push(new Shotgun_Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,15,player.direction+4,this.getRange(),this.getRicochetCount()));
      this.bullets.push(new Shotgun_Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,15,player.direction+4,this.getRange(),this.getRicochetCount()));
      this.bullets.push(new Shotgun_Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,15,player.direction+6,this.getRange(),this.getRicochetCount()));
      this.cycling = this.fireRate;
    }
  }
}

class Shotgun_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc){
    super(x,y,s,d,l,rc);
    this.setBulletAccuracy(10);
  }

  update(deltaTime){

    super.update(deltaTime);

    this.direction+= Utility.Random(-2,2);

  }

  draw(camera){

    super.draw(camera);

  }

}
