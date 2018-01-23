class Shotgun extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(30);
    this.setRange(100);
    this.setRicochetCount(1)
  }

  update(deltaTime){

    super.update(deltaTime);

  }

  fire(player){
    if(this.cycling <= 0) {
      this.bullets.push(new Shotgun_Bullet(this.pos.x,this.pos.y,20,this.direction+2,this.getRange(),this.getRicochetCount(),player.acc));
      this.bullets.push(new Shotgun_Bullet(this.pos.x,this.pos.y,20,this.direction-2,this.getRange(),this.getRicochetCount(),player.acc));
      this.bullets.push(new Shotgun_Bullet(this.pos.x,this.pos.y,15,this.direction+4,this.getRange(),this.getRicochetCount(),player.acc));
      this.bullets.push(new Shotgun_Bullet(this.pos.x,this.pos.y,20,this.direction+4,this.getRange(),this.getRicochetCount(),player.acc));
      this.bullets.push(new Shotgun_Bullet(this.pos.x,this.pos.y,15,this.direction+6,this.getRange(),this.getRicochetCount(),player.acc));
      this.cycling = this.fireRate;
    }
  }
}

class Shotgun_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc,acc){

    super(x,y,s,d,l,rc);

    this.setBulletAccuracy(4);

    this.colour.setColour(255,0,0,1);

  }

  update(deltaTime){

    super.update(deltaTime);

    this.direction+= Utility.Random(-2,2);

  }

  draw(camera){

    super.draw(camera);

  }

}
