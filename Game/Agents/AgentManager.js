class AgentManager {

  constructor(level,grid){

    this.level = level;

    this.grid = new Grid(this.level.levelSize.x,this.level.levelSize.y,grid);

    this.gridSize = this.grid.gridSize;

    this.agents = [];

    this.drawDebugPath        = false;
    this.drawDebugGrid        = false;
    this.drawDebugVision      = false;
    this.drawDebugLineOfSight = false;

  }

  toggleDrawDebugGrid(){
    this.drawDebugGrid ^= true;;
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

  // this adds virtual obstacles to the a* map
  addObstacle(x,y,w,h){

    var margin = 1;

    // iterating across wall dimensions to add obstacles to path finding grid
    for(var oby = -margin ; oby < h + margin ; oby++)
      for(var obx = -margin ; obx < w + margin ; obx++)
        this.grid.addObstacle(new SAT.Vector(x + obx,y + oby));

  }

  addAgent(x,y,type){

    console.log(" > AGENT MANAGER : Agent: " + type + " added!");

    switch (type) {
      case AgentType.GENERIC  :
        // passing reference to level implies agent has access to all level information
        this.agents.push(new Agent(x,y,this));
        break;
      case AgentType.FOLLOW   : break;
      case AgentType.WANDERING: break;
      case AgentType.TRACE    : break;
      default:
    }
  }

  // from and to are assumed to be non normalised
  requestSearchPath(from,to){

    let path = this.grid.search(from,to);

    let cleanPath = [];

    if(path){
      // create a simpler path object
      for(var i = 0 ; i < path.length ; i++)
        cleanPath.push(
          new SAT.Vector(
            (path[i].x*this.gridSize) + this.gridSize/2,
            (path[i].y*this.gridSize) + this.gridSize/2
          )
        );
    }

    return cleanPath;
  }

  update(deltaTime){

    diagnostic.updateLine("---- Agents",this.agents.length);

    // checking input for render options
    if(input.isDown("G")) this.toggleDrawDebugGrid();

    if(input.isDown("H")) this.toggleDrawDebugPath();

    if(input.isDown("J")) this.toggleDrawDebugVision();

    this.grid.update();

    for(var agent = this.agents.length - 1 ; agent >= 0 ; agent--) {
      if(!this.agents[agent].getAlive()){


        this.agents.splice(agent,1);
        continue;
      } else {
        // update path finding path
        this.agents[agent].setPath(
          // request new search from agent position to agent focus position
          this.requestSearchPath(
            this.agents[agent].getPos(),
            this.agents[agent].getFocusPosition()
          )
        );
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

    if(this.drawDebugLineOfSight){
      for(var cell = 0 ; cell < this.grid.lineofsight.length ; cell++){

        (this.grid.lineofsight[cell].ok ? Draw.fill(100,255,100) : Draw.fill(255,100,100) );

        Draw.circle(
          (this.grid.lineofsight[cell].x*this.gridSize + this.gridSize/2)-camera.x,
          (this.grid.lineofsight[cell].y*this.gridSize + this.gridSize/2)-camera.y,
          this.gridSize/8
        )

      }
    }

    if(this.drawDebugGrid)
      this.grid.draw(camera);

  }
}
