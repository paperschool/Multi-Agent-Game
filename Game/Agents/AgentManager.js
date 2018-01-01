class AgentManager {

  constructor(level,grid){

    this.level = level;

    this.grid = new Grid(this.level.levelSize.x,this.level.levelSize.y,grid);

    this.gridSize = this.grid.gridSize;

    this.agents = [];

    this.drawDebugPath = false;
    this.drawDebugGrid = false;
    this.drawDebugVision = false;

  }

  toggleDrawDebugGrid(){
    this.drawDebugGrid ^= true;;
  }

  toggleDrawDebugPath(){
    this.drawDebugPath ^= true;;
  }

  toggleDrawDebugVision(){
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
        this.grid.addObstacle(new SAT.Vector(y + oby,x + obx));

  }

  addAgent(x,y,type){

    console.log(" > AGENT MANAGER : Agent: " + type + " added!");

    switch (type) {
      case AgentType.GENERIC  :
        // passing reference to level implies agent has access to all level information
        this.agents.push(new Agent(x,y,this.level));
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


    for(var agent = this.agents.length - 1 ; agent >= 0 ; agent--) {
      if(!this.agents[agent].getAlive()){

        // this.grid.rebuildMesh();

        this.agents.splice(agent,1);
        continue;
      } else {
        this.agents[agent].setPath(this.requestSearchPath(
            this.agents[agent].getPos(),
            this.level.player.getPos())
        );
        this.agents[agent].update(deltaTime);
      }


    }

  }

  draw(camera){

    if(this.drawDebugGrid)
      this.grid.draw(camera);

    for(var agent = 0 ; agent < this.agents.length ; agent++){

      if(this.drawDebugPath){
        for(var node = 0 ; node < this.agents[agent].getPath().length ; node++){
          Draw.fill(100,100,100,0.5);
          Draw.rect(-camera.x + (this.agents[agent].getPath()[node].x),-camera.y + (this.agents[agent].getPath()[node].y),this.gridSize,this.gridSize)
        }
      }

      this.agents[agent].draw(camera);
    }

  }



}
