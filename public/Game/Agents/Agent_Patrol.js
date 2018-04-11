class Agent_Patrol extends Agent {

  constructor(x,y,environment,patrol){
    super(x,y,environment)

    this.patrol = null;

    this.patrolSet = false;

    this.setPatrolPath(patrol);

    this.choosePatrolPoint();

    this.setAgentPathfindingFocus(AgentPathFindingFocus.PATROL);

    // behaviour tree for agent which sets slicing mode to this abstraction
    this.behaviour = new Patrol_Agent_Behaviour(this);

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
    super.update(deltaTime,false)
    this.behaviour.step();
  }

  draw(camera){
    super.draw(camera);

    if(this.getAlive()){

      Draw.fillHex(gameTheme['ENEMY-PATROL']);
      Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.direction));
    }
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
