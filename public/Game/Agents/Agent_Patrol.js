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
    this.path = null;
    this.newPath();
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

  constructor(loop = false, direction = 1){

    this.points = []

    this.point = 0;

    this.loop = loop

    this.direction = direction;

  }

  getLength(){
    return this.points.length;
  }

  getLast(){
    return this.poinss[this.points.length -1];
  }

  getPoint(index){
    if(index < 0 || index > this.points.length-1) return null;
    return this.points[index];
  }

  addPoint(point){
    this.points.push(point);
  }

  peekNext(){

    let p = this.point;

    let d = this.direction;

    if(p === p.length-1 || (p === 0 && d === -1)){

      if(this.loop){
        p = -1;
      } else {
        d *= -1;
      }

    }

    p+=d;

    if(!(p < 0 || p > this.points.length-1)) {
      return this.points[p];
    } else {
      return -1;
    }

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
