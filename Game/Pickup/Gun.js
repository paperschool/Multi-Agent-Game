
class Gun extends Pickup {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    // hard coded type (escaping javascripts poor typing)
    this.type = PickupType.GUN;

    this.colour = new Colour(51,51,51);

    ////////////////////

    this.cycling = 0;

    // ticks/shot
    this.fireRate = 50;

    this.bullets = [];

  }

  update(player){
    super.update(player);
    this.cycling++;
  }

  draw(camera){
    super.draw(camera);
  }

  fire(){

    if(this.cycling >= this.fireRate){

      console.log("FIRE");



      this.cycling = 0;

    }

  }

}
