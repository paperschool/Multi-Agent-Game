class Pistol extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(30);
    this.setRange(1000);
    this.setRicochetCount(2)
  }

  fire(player){
    if(this.cycling <= 0) {
      this.bullets.push(new Bullet(this.pos.x,this.pos.y,1,this.direction,this.getRange(),this.getRicochetCount()));
      this.cycling = this.fireRate;
    }
  }
}
