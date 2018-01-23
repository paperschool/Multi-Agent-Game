class Flamethrower extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(1);
    this.setRange(100);
    this.setRicochetCount(1)
  }

  update(deltaTime){

    super.update(deltaTime);

  }

  fire(player){
    if(this.cycling <= 0) {

      this.bullets.push(new Flamethrower_Bullet(this.pos.x,this.pos.y,7 ,this.direction  ,this.getRange()+Utility.Random(-20,20),this.getRicochetCount(),player.acc));
      this.bullets.push(new Flamethrower_Bullet(this.pos.x,this.pos.y,9 ,this.direction+4,this.getRange()+Utility.Random(-20,20),this.getRicochetCount(),player.acc));
      this.bullets.push(new Flamethrower_Bullet(this.pos.x,this.pos.y,8 ,this.direction-4,this.getRange()+Utility.Random(-20,20),this.getRicochetCount(),player.acc));
      this.bullets.push(new Flamethrower_Bullet(this.pos.x,this.pos.y,7 ,this.direction+8,this.getRange()+Utility.Random(-20,20),this.getRicochetCount(),player.acc));
      this.bullets.push(new Flamethrower_Bullet(this.pos.x,this.pos.y,8,this.direction-8,this.getRange()+Utility.Random(-20,20),this.getRicochetCount(),player.acc));
      this.cycling = this.fireRate;
    }
  }
}

class Flamethrower_Bullet extends Bullet {

  constructor(x,y,s,d,l,rc,acc){

    super(x,y,s,d,l,rc);

    this.setBulletAccuracy(4);

    this.colour.setColour(255,0,0,1);

    this.setSpeed(100);

    this.setSize(new SAT.Vector(5,5));

    // this.getAcc().add(acc);

  }

  update(deltaTime){

    super.update(deltaTime);

  }

  draw(camera){

    super.draw(camera);

    let lowerBound = 20;

    if(this.alive){

      if(this.getLifespan() > lowerBound) {
        this.colour.setR(255);
        this.colour.setG(Utility.Map(this.getLifespan(),0,this.getInitialLifeSpan()*1.4,0,255));
        this.colour.setB(0);
        this.colour.setA(Utility.Map(this.getLifespan(),0,this.getInitialLifeSpan(),0,1.0));
      } else {
        this.colour.setR(1);
        this.colour.setG(1);
        this.colour.setB(1);
        this.colour.setA(Utility.Map(this.getLifespan(),0,lowerBound,0,1.0));
      }

      Draw.fillCol(this.colour);
      Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,6);
    }

  }

}
