
var PickupType = {

  GENERIC:"generic",
  HEALTH:"hp",
  GUN:"gun"

}

class PickupManager  {

  constructor(){

    this.pickups = [];

  }

  update(deltaTime,player){

    // iterating through all pick up objects
    for(var pickup = 0 ; pickup < this.pickups.length ; pickup++){

      // temp variable for ease
      let p = this.pickups[pickup];

      // updating pickup
      p.update(deltaTime);

      // check if player is near object and object is active
      if(p.getAlive() && p.isNearPlayer(player.pos)){

        // if player is near object set object to false;
        console.log("Player Found '" + p.type + "' Pickup: " + pickup);

        switch(p.type){
          case PickupType.GENERIC:
            player.setColour(p.colour);
            p.setAlive(false);
            break;
          case PickupType.HEALTH:
            player.setColour(p.colour);
            p.setAlive(false);
            break;
          case PickupType.GUN:
            player.setColour(p.colour);
            player.setWeapon(new Gun(p.pos.x,p.pos.y,10,3));
            p.setAlive(false);
            break;
        }
      }
    }
  }

  draw(camera){

    for(var pickup = 0 ; pickup < this.pickups.length ; pickup++)
      if(this.pickups[pickup].getAlive())
        this.pickups[pickup].draw(camera);
  }

  // method to create new pickup type (x,y) as a position and @type with takes from pickup type.
  newPickup(x,y,type){
    switch(type){
      case PickupType.GENERIC:
        this.pickups.push(new Pickup(x,y,50,50,50));
        break;
      case PickupType.HEALTH:
        this.pickups.push(new Pickup_Health(x,y,50,50,50));
        break;
      case PickupType.GUN:
        this.pickups.push(new Pickup_Gun(x,y,50,50,50));
        console.log(" > Pickup Manager : Added Gun Pickup")
        break;
      default:
        this.pickups.push(new Pickup(x,y,50,50,50));
        break;
    }

  }

}
