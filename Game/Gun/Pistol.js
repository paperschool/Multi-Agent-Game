class Pistol extends Gun {

  constructor(x,y){
    super(x,y,0,0);
    this.setFireRate(30);
    this.setRange(100);
    this.setRicochetCount(2)
  }

  fire(player){
    if(this.cycling <= 0) {
      this.bullets.push(new Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,15,player.direction,this.getRange(),this.getRicochetCount()));
      this.cycling = this.fireRate;
    }
  }
}
