
class Gun extends Actor {

  // x and y specify position, f = fire rate, ss = shot count;
  constructor(x,y,f,sc){
    super(x,y,1,1,0,0);

    // hard coded type (escaping javascripts poor typing)
    this.type = PickupType.GUN;

    // setting colour of actor
    this.colour = new Colour(51,51,51);

    // counter to reset fire rate
    this.cycling = 0;

    // ticks/shot
    this.fireRate = f;

    // defines "spread" but is effectively number of bullets fired per shot
    this.shotCount = sc;

    // array to store bullets
    this.bullets = [];

  }

  update(player){

    super.update(player);

    this.cycling--;

    // iterating through bullets
    for(var bullet = this.bullets.length-1 ; bullet > 0 ; bullet--) {

      this.bullets[bullet].update();

      // checking if bullet is dead
      if(!this.bullets[bullet].getAlive()){
        // splicing bullet object from bullet array
        this.bullets.splice(bullet,1);
      }

    }

  }

  draw(camera){

    super.draw(camera);

    // iterating through bullets
    for(var bullet = this.bullets.length-1 ; bullet > 0; bullet--) {

      this.bullets[bullet].draw(camera);

    }

  }

  fire(player){

    if(this.cycling <= 0) {

      for(var i = -this.shotCount ; i < this.shotCount-1 ; i++){
        this.bullets.push(new Bullet(player.pos.x+player.vel.x,player.pos.y+player.vel.y,15,player.direction + i*(10),1000));
      }

      this.cycling = this.fireRate;

    }

  }

}
