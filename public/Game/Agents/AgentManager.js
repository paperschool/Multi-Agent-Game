class AgentManager {

  constructor(level){

    this.level = level;

    this.grid = level.grid

    this.gridSize = this.grid.gridSize;

    this.agents = [];

    this.seperation = 10;

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

  seperateAgents(){

    for(let a = 0 ; a < this.agents.length ; a++){
      this.agents[a].applyImpluse(this.seperateAgent(a));
    }
  }

  seperateAgent(agent){

    let steer = new SAT.Vector();

    for(let a = 0 ; a < this.agents.length ; a++){

      let other = this.agents[a];

      let d = Utility.dist(agent.getPos(),other.getPos());

      if(d > 0 && d < this.seperation){
        // calculate opposing vector for other agent
        let opp = new SAT.Vector(agent.getPos().x-other.getPos().x,agent.getPos().y-other.getPos().y);

        opp.normalize();
        opp.scale(1/d);
        steer.add(opp);
      }
    }

    steer.scale(1/this.agents.length-1);

    return steer;


    if(steer.len() > 0){
      steer.normalize();
      steer.scale(agent.getSpeed()*2);
    }

  }

  update(deltaTime){

    diagnostic.updateLine("---- Agents",this.agents.length);

    if(input.isDown("H")) this.toggleDrawDebugPath()

    if(input.isDown("J")) this.toggleDrawDebugVision();

    for(var agent = this.agents.length - 1 ; agent >= 0 ; agent--) {

      let a = this.agents[agent];

      if(!a.getAlive()){
        this.agents.splice(agent,1);
        continue;
      } else {

        let sep = this.seperateAgent(a);

        // applying seperation calculation
        a.applyImpulse(sep);

        // update agent internals
        a.update(deltaTime);

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
