class AgentManager {

  constructor(level){

    this.level = level;

    this.grid = level.grid

    this.gridSize = this.grid.gridSize;

    this.agents = [];

    this.agentsWeapons = [];

    this.drawDebugPath        = false;
    this.drawDebugVision      = false;
    this.drawDebugLineOfSight = false;

  }

  toggleDrawDebugPath(){
    this.drawDebugPath ^= true;;
  }

  toggleDrawDebugVision(){

    this.drawDebugLineOfSight ^= true;

    this.drawDebugVision ^= true;

    for(var agent = 0 ; agent < this.agents.length ; agent++) {
      this.agents[agent].setDebugOn(this.drawDebugVision);
    }

  }

  getAgents(){
    return this.agents;
  }

  getLiveAgents(){
    return this.agents.reduce( (t,c,i) => t + (c.getAlive()) , 0 );
  }

  addAgent(x,y,type,weapon,patrol){

    // console.log(" > AGENT MANAGER : Agent: " + type + " added!");

    switch (type) {
      case AgentType.GENERIC  :
        // passing reference to level implies agent has access to all level information
        this.agents.push(new Agent(x,y,this.level));
        break;
      case AgentType.FOLLOW   : break;
      case AgentType.WANDERING: break;
      case AgentType.TRACE    :

        this.agents.push(new Agent_Patrol(x,y,this.level,patrol));
        break;
      default:
    }

    let a = this.agents[this.agents.length-1];

    switch(weapon){
      case PickupType.PISTOL       : a.setWeapon(new Pistol(a.getPos().x,a.getPos().y)); break;
      case PickupType.MACHINEGUN   : a.setWeapon(new Machinegun(a.getPos().x,a.getPos().y)); break;
      case PickupType.SHOTGUN      : a.setWeapon(new Shotgun(a.getPos().x,a.getPos().y)); break;
      case PickupType.FLAMETHROWER : a.setWeapon(new Flamethrower(a.getPos().x,a.getPos().y)); break;
    }

  }

  update(deltaTime){

    diagnostic.updateLine("---- Agents",this.agents.length);

    if(input.isDown("H")) this.toggleDrawDebugPath()

    if(input.isDown("J")) this.toggleDrawDebugVision();

    for(var agent = this.agents.length - 1 ; agent >= 0 ; agent--) {
      if(!this.agents[agent].getAlive()){
        this.agents.splice(agent,1);
        continue;
      } else {

        // update agent internals
        this.agents[agent].update(deltaTime);

      }
    }

  }

  draw(camera){

    for(var agent = 0 ; agent < this.agents.length ; agent++){
      // actual agent draw call
      this.agents[agent].draw(camera);
    }

  }

}
