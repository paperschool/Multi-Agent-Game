class Agent_Patrol extends Agent {

  constructor(x,y,environment,patrol){
    super(x,y,environment)

    this.patrol = null;

    this.patrolSet = false;

    this.setPatrolPath(patrol);

    this.choosePatrolPoint();

    this.setAgentPathfindingFocus(AgentPathFindingFocus.PATROL);

    // behaviour tree for agent which sets slicing mode to this abstraction
    this.setBehaviour(new Patrol_Agent_Behaviour(this));

  }

  // this method will update the internal focus position state
  setAgentPathfindingFocus(focus = AgentPathFindingFocus.PATROL){

    // console.log("Calling Patrol Agent Focus Method")

    // checking if focus state has changed
    if(this.pathfindingFocus !== focus){
      this.focusChanged = true;
      this.pathfindingFocus = focus;
    }

    switch(this.pathfindingFocus){
      case AgentPathFindingFocus.PLAYER:     this.setFocusPosition(this.getPlayerPosition());   break;
      case AgentPathFindingFocus.NEARPLAYER: this.setFocusPosition(this.getPlayerPosition());   break;
      case AgentPathFindingFocus.OLDPLAYER:  this.setFocusPosition(this.getLastKnownPlayerPosition()); break;
      case AgentPathFindingFocus.PATROL:     /* this.setFocusPosition(this.nonPlayerFocusPosition); */  break;
      case AgentPathFindingFocus.WANDER:     /* this.setFocusPosition(this.nonPlayerFocusPosition); */  break;
      default: break;
    }

  }

  choosePatrolPoint(){
    this.setFocusPosition(
      this.grid.centerCellMap(this.patrol.getNextPoint())
    );
  }

  setPatrolPath(patrol){
    this.patrol = patrol;
    this.patrolSet = true;
  }

  update(deltaTime){
    super.update(deltaTime)
  }

  draw(camera){
    super.draw(camera);
  }

}

class Patrol {

  constructor(loop, direction = 1){

    this.points = []

    this.point = 0;

    this.loop = loop

    this.direction = direction;

  }

  addPoint(point){
    this.points.push(point);
  }

  getNextPoint(){

    if(this.point === this.points.length-1 || (this.point === 0 && this.direction === -1)){

      if(this.loop){
        this.point = -1;
      } else {
        this.direction *= -1;
      }
    }

    this.point+=this.direction;
    return this.points[this.point];

  }

}
