
class Pickup extends Actor {

  constructor(x,y,w,h,radius) {
    super(x,y,0,0,0,0);

    this.type = PickupType.GENERIC;

    this.bounds = new Circle(x+w/2,y+h/2,radius);

    this.pickupRadius = radius;

    this.colour = new Colour().random();

    this.setSize(new SAT.Vector(w,h));

    // if pickup has been picked up;
    this.setAlive(true);

  }

  // method to check if player position is overlaping pickup
  isNearPlayer(otherPlayerPos){
    return this.bounds.checkPointInCircle(otherPlayerPos);
  }

  update(deltaTime){
    super.update(deltaTime)
  }

  draw(camera){

    if(this.getAlive()){

      super.draw(camera)
      Draw.fillCol(this.colour);
      Draw.rect(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x,this.size.y);

    }

  }

}

class Pickup_Gun extends Pickup {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    this.type = PickupType.GUN;

    this.setAlive(true);

    // setting colour of actor
    this.colour = new Colour(51,51,51);
  }

  update(deltaTime) {
    super.update(deltaTime);
  }

  draw(camera){
    super.draw(camera);

    Draw.fillCol(this.colour);
    Draw.rect(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x,this.size.y);

  }

}


class Pickup_Health extends Pickup {

  constructor(x,y,w,h,radius){
    super(x,y,w,h,radius);

    // hard coded type (escaping javascripts poor typing)
    this.type = PickupType.HEALTH;

    this.setAlive(true);

    this.colour = new Colour(160,255,160);

    this.broken = [];

    for(var i = 0 ; i < 10 ; i++){
      this.broken.push(new Rectangle(this.pos.x + Utility.Random(-50,50),this.pos.y + Utility.Random(-50,50),Utility.Random(5,10),Utility.Random(5,10)));
      this.broken[this.broken.length-1].setColour(new Colour().random());
    }

  }

  update(player){
    super.update(player);
  }

  draw(camera){

    if(this.getAlive()){

      super.draw(camera);

      Draw.fillCol(this.colour);
      Draw.rect(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x,this.size.y);


    } else {

      for(var i = 0 ; i < this.broken.length ; i++){
          this.broken[i].draw(camera);
      }

    }
  }
}
