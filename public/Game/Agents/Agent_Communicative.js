
class Agent_Communicative extends Agent {

  constructor(x,y,environment,team){

    super(x,y,environment);

    this.type = AgentType.MULTIAGENT;

    // storing reference to agent manager
    this.setManager(environment.agents);

    // storing team index
    this.setTeam(team);

    // behaviour tree for agent which sets slicing mode to this abstraction
    this.behaviour = new Multi_Agent_Behaviour(this);

  }

  getManager(){
    return this.manager;
  }

  getTeam(){
     return this.team;
  }

  setManager(manager){
    this.manager = manager;
  }

  setTeam(team){
    this.team = team;
  }

  // message broadcast
  broadcast(type){

    let message = {
      'type':type,
      team:this.getTeam(),
      payload:{}
    }

    switch(type){
      case AgentMessageType.PLAYER_SEEN: break;
      case AgentMessageType.PLAYER_FIRED: break;
      case AgentMessageType.FRIEND_DEAD:  break;
      default: break;
    }

    this.manager.broadcast(message);

  }

  receive(message){
    switch(message){
      case AgentMessageType.PLAYER_SEEN:
        this.alertAgent();
        this.setLastKnownPlayerPosition();
      case AgentMessageType.PLAYER_FIRED: // this should include triangulation logic
      case AgentMessageType.FRIEND_DEAD:
        this.alertAgent(); break;
      default: break;
    }
  }

  update(deltaTime){
    super.update(deltaTime)
  }

  draw(camera){
    super.draw(camera)
  }


}
