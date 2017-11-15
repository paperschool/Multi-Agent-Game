
class Pickup extends Rectangle {

  constructor(x,y,w,h,radius){
    super(x,y,w,h)

    this.type = PickupType.GENERIC;

    this.bounds = new Circle(x+w/2,y+h/2,radius);

    this.pickupRadius = radius;

    this.colour = new Colour().random();

    // if pickup has been picked up;
    this.active = true;

  }

  // method to check if player position is overlaping pickup
  isNearPlayer(otherPlayerPos){
    return this.bounds.checkPointInCircle(otherPlayerPos);
  }

  update(){
    super.update()
  }

  draw(camera){

    if(this.active){
      // this.bounds.draw(camera);
      super.draw(camera)
    }

  }

}
