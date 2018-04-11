class PickupManager  {

  constructor(player){

    this.pickups = [];

    this.player = player;

    input.setCallBack(InputKeys.SPACE,(function(){
      this.playerRequestedPickUp(this.player);
    }).bind(this));

  }


  update(deltaTime,player){

    // iterating through all pick up objects
    for(var pickup = 0 ; pickup < this.pickups.length ; pickup++){
      // temp variable for ease
      let p = this.pickups[pickup];

      // updating pickup
      p.update(deltaTime);

    }

  }

  draw(camera){

    for(var pickup = 0 ; pickup < this.pickups.length ; pickup++)
      if(this.pickups[pickup].getAlive())
        this.pickups[pickup].draw(camera);

  }

  // method to create new pickup type (x,y) as a position and @type with takes from pickup type.
  newPickup(x,y,type){

    let radius = 23;

    switch(type){
      case PickupType.GENERIC:
        this.pickups.push(new Pickup(x,y,radius,radius,radius));
        break;
      case PickupType.HEALTH:
        this.pickups.push(new Pickup_Health(x,y,radius,radius,radius));
        break;
      case PickupType.GUN:
        this.pickups.push(new Pickup_Gun(x,y,radius,radius,radius));
        break;
      case PickupType.PISTOL:
        this.pickups.push(new Pickup_Pistol_Gun(x,y,radius,radius,radius));
        break;
        case PickupType.SHOTGUN:
        this.pickups.push(new Pickup_Shot_Gun(x,y,radius,radius,radius));
        break;
      case PickupType.MACHINEGUN:
        this.pickups.push(new Pickup_Machine_Gun(x,y,radius,radius,radius));
        break;
      case PickupType.FLAMETHROWER:
        this.pickups.push(new Pickup_Flamethrower(x,y,radius,radius,radius));
        break;
      default:
        this.pickups.push(new Pickup(x,y,50,50,50));
        break;

    }

  }

  playerRequestedPickUp(player){

    // iterating through all pick up objects
    for(var pickup = 0 ; pickup < this.pickups.length ; pickup++){

      // temp variable for ease
      let p = this.pickups[pickup];

      // check if player is near object and object is active
      if(p.getAlive() && p.isNearPlayer(player)){

        if(player.getWeaponType() !== null){
          this.newPickup(
            player.getPos().x+Utility.RandomInt(-20,20),
            player.getPos().y+Utility.RandomInt(-20,20),
            player.getWeaponType()
          );
        }

        // if player is near object set object to false;
        console.log("Player Found '" + p.type + "' Pickup: " + pickup);

        switch(p.type){
          case PickupType.GENERIC:
            player.setColour(p.colour);
            p.setAlive(false);
            return;
          case PickupType.HEALTH:
            player.setColour(p.colour);
            p.setAlive(false);
            return;
          case PickupType.GUN:
            player.setColour(p.colour);
            player.setWeapon(new Gun(p.pos.x,p.pos.y));
            player.setWeaponType(p.type);
            p.setAlive(false);
            sound.play(SoundLabel.PICKUP_GUN);
            return;
          case PickupType.PISTOL:
            player.setColour(p.colour);
            player.setWeapon(new Pistol(p.pos.x,p.pos.y));
            player.setWeaponType(p.type);
            p.setAlive(false);
            sound.play(SoundLabel.PICKUP_GUN);
            return;
          case PickupType.MACHINEGUN:
            player.setColour(p.colour);
            player.setWeapon(new Machinegun(p.pos.x,p.pos.y));
            player.setWeaponType(p.type);
            p.setAlive(false);
            sound.play(SoundLabel.PICKUP_GUN);
            return;
          case PickupType.SHOTGUN:
            player.setColour(p.colour);
            player.setWeapon(new Shotgun(p.pos.x,p.pos.y));
            player.setWeaponType(p.type);
            p.setAlive(false);
            sound.play(SoundLabel.PICKUP_SHOTGUN);
            return;
          case PickupType.FLAMETHROWER:
            player.setColour(p.colour);
            player.setWeapon(new Flamethrower(p.pos.x,p.pos.y));
            player.setWeaponType(p.type);
            p.setAlive(false);
            sound.play(SoundLabel.PICKUP_FLAMETHROWER);
            return;
        }
      }
    }

  }

}
