
class Health extends Pickup {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    // hard coded type (escaping javascripts poor typing)
    this.type = PickupType.HEALTH;

    this.colour = new Colour(160,255,160);

  }

  update(player){
    super.update(player);
  }

  draw(camera){
    super.draw(camera);
  }

}
