class World {

  constructor(w,h){

    // variable to store
    this.CURRENT_STATE = GameState.START_STATE;

    // state object array
    this.states = [
      new StartState(this),
      new PlayState(this),
      new GameOverState(this),
      new VictoryState(this)
    ];

    // size of the virtual world (that needs to be projected to the canvas)
    this.size = new SAT.Vector(w,h)

    // size of grid squares for calculating / etc
    this.gridSize = 20;

    // level array
    this.levels = [];

    this.levelManager = new LevelManager();

    // creating new camera objext
    this.camera = new Camera(0,0,CW,CH,w,h);

    this.levelManager.loadLevel("Game/Assets/Levels/1.json",this.addLevel.bind(this));

    this.currentLevel = -1;

    this.levelCount = 0;

  }

  addLevel(data){

    this.levelCount++;

    this.currentLevel = 0;

    // create new Level;
    this.levels.push(
      new Level(
        this,
        this.size,
        data.level.size,
        {x: data.level.player.x *this.gridSize,y:data.level.player.y *this.gridSize },
        this.gridSize
      )
    );

    // create all walls within level
    for(var wall = 0 ; wall < data.level.walls.length ; wall++){
      this.levels[this.levelCount-1].addWall(
        data.level.walls[wall].x,
        data.level.walls[wall].y,
        data.level.walls[wall].w,
        data.level.walls[wall].h,
        wall
      )
    }

    // do a final build of the graph object ready for astar searching
    this.levels[this.levelCount-1].agents.grid.rebuildMesh();

    // add enemy agents
    for(var agent = 0 ; agent < data.level.enemy.length ; agent++){

      let patrol = null;

      if('patrol' in data.level.enemy[agent]){
        let pdata = data.level.enemy[agent].patrol;

        patrol = new Patrol(pdata.loop,pdata.direction);

        for(var point = 0 ; point < pdata.points.length ; point++){
          patrol.addPoint(pdata.points[point]);
        }

      }

      this.levels[this.levelCount-1].addAgent(
        data.level.enemy[agent].x*this.gridSize,
        data.level.enemy[agent].y*this.gridSize,
        data.level.enemy[agent].type,
        data.level.enemy[agent].weapon,
        patrol
      )
    }

    // add world pickups
    for(var pickup = 0 ; pickup < data.level.pickups.length ; pickup++){
      this.levels[this.levelCount-1].addPickup(
        data.level.pickups[pickup].x*this.gridSize,
        data.level.pickups[pickup].y*this.gridSize,
        data.level.pickups[pickup].type
      )
    }

    // set camera focus
    this.camera.setFocus(this.levels[this.levelCount-1].player,new SAT.Vector(CW/2,CH/2));
    // this.camera.setFocus(this.levels[this.levelCount-1].agents.agents[0],new SAT.Vector(CW/2,CH/2));


  }

  update(deltaTime){

    this.states[this.CURRENT_STATE].update(deltaTime);

    this.camera.update(deltaTime);

  }

  draw() {

    this.states[this.CURRENT_STATE].draw(this.camera.getOffset());

  }


  setState(state){
    this.CURRENT_STATE = state;
  }

}
