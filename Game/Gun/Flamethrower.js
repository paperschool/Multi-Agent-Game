class Flamethrower extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(1);
    this.setRange(80);
    this.setRicochetCount(1)
  }

  update(deltaTime){

    super.update(deltaTime);

    this.setDirection(this.getDirection()+Utility.Random(-5,5));

  }

  fire(player){
    if(this.cycling <= 0) {

      this.bullets.push(new Flamethrower_Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,10,player.direction,  this.getRange()+Utility.Random(-20,20),this.getRicochetCount()));
      this.bullets.push(new Flamethrower_Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,7,player.direction+2,this.getRange()+Utility.Random(-20,20),this.getRicochetCount()));
      this.bullets.push(new Flamethrower_Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,8,player.direction-4,this.getRange()+Utility.Random(-20,20),this.getRicochetCount()));
      this.bullets.push(new Flamethrower_Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,6,player.direction+6,this.getRange()+Utility.Random(-20,20),this.getRicochetCount()));
      this.cycling = this.fireRate;
    }
  }
}

class Flamethrower_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc){
    super(x,y,s,d,l,rc);
    this.setBulletAccuracy(2);
  }

  update(deltaTime){

    super.update(deltaTime);

  }

  draw(camera){

    super.draw(camera);

    if(this.alive){

      this.colour.setColour(
        new Colour(
          255,
          Utility.Map(this.getLifespan(),0,this.getInitialLifeSpan(),0,200),
          Utility.Map(this.getLifespan(),0,this.getInitialLifeSpan(),255,0),
          Utility.Map(this.getLifespan(),0,this.getInitialLifeSpan(),0.0,1.0)
        )
      )

      Draw.fillCol(this.colour);



      Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,6);
    }

  }

}
