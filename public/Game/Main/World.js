class World {

  constructor(w,h){

    // variable to store
    this.CURRENT_STATE = GameState.START_STATE;

    // state object array
    this.states = [
      new StartState(null,this.setState.bind(this)),
      new PlayState(null,this.setState.bind(this),this.reloadLevel.bind(this),this.nextLevel.bind(this)),
      new GameOverState(null,this.setState.bind(this),this.reloadLevel.bind(this),this.nextLevel.bind(this)),
      new VictoryState(null,this.setState.bind(this)),
      new PauseState(null,this.setState.bind(this)),
      new LevelSwitchState(null,this.setState.bind(this))
    ];

    // performing set up on the current state
    this.states[this.CURRENT_STATE].setup();

    // size of the virtual world (that needs to be projected to the canvas)
    this.size = new SAT.Vector(w,h)

    // size of grid squares for calculating / etc
    this.gridSize = 20;

    // array of level seed data
    this.levelData = new Array(0);

    // current level object
    this.levels = null;

    // counter to track number of levels requested
    this.requestedLevelCount = 0;

    // setting up ajax level loader
    this.levelManager = new LevelManager();

    // Main Sequence Levels
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/1.json",0,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/2.json",1,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/3.json",2,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/4.json",3,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/5.json",4,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/6.json",5,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/7.json",6,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/8.json",7,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/9.json",8,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/PatrolLevels/10.json",9,this.addLevelData.bind(this));

    this.levelManager.loadLevel("Game/Assets/Levels/Demo/reactive.json",0,this.addLevelData.bind(this));
    this.levelManager.loadLevel("Game/Assets/Levels/Demo/team.json",1,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/Demo/patrol.json",2,this.addLevelData.bind(this));

    // index of current level
    this.currentLevel = -1;

    // registering input call backs for state switching purposes (pause -> play or play -> pause)
    input.setCallBack(InputKeys.PAUSE,'worldpause',(function(){

      if(this.CURRENT_STATE === GameState.PAUSE_STATE){

        this.CURRENT_STATE = GameState.PLAY_STATE;

        sound.play(SoundLabel.STATE_PLAY);

      } else if(this.CURRENT_STATE === GameState.PLAY_STATE){

        this.CURRENT_STATE = GameState.PAUSE_STATE;

        sound.play(SoundLabel.STATE_PAUSED);

      }

    }).bind(this));

    // registering input call backs for state switching purposes (gameover -> play)
    input.setCallBack(InputKeys.REPLAY,'worldrestart',(function(){

      if(this.CURRENT_STATE === GameState.GAMEOVER_STATE){
        this.setState(GameState.PLAY_STATE);
      }

    }).bind(this));

    // registering input call backs for state switching purposes (start -> play or victory -> start)
    input.setCallBack(InputKeys.SPACE,'worldstart',(function(){

      if(this.levelManager.levelsLoaded()) {

        if(this.CURRENT_STATE === GameState.START_STATE){

          sound.stopAll();
          this.setState(GameState.LEVEL_SWITCH_STATE);

        } else if (this.CURRENT_STATE === GameState.VICTORY_STATE){

          sound.stopAll();
          this.setState(GameState.START_STATE);

        }

      }

    }).bind(this));

  }

  addLevelData(data,index){
    this.levelData[index] = data;
  }

  addLevel(data){

    // level variable
    let newLevel = null;

    // create new Level;
    newLevel = new Level(
        this,
        this.size,
        data.level.size,
        {x: data.level.player.x *this.gridSize,y:data.level.player.y *this.gridSize },
        this.gridSize
      );


    if(data.level.deadspaces){
      // create all deadspace within level
      for(var deadspace = 0 ; deadspace < data.level.deadspaces.length ; deadspace++){
        newLevel.addDeadSpace(
          data.level.deadspaces[deadspace].x,
          data.level.deadspaces[deadspace].y,
          data.level.deadspaces[deadspace].w,
          data.level.deadspaces[deadspace].h,
          deadspace,
          data.level.deadspaces[deadspace].visible
        )
      }
    }

    if(data.level.floors){
      // create all floors within level
      for(var floor = 0 ; floor < data.level.floors.length ; floor++){
        newLevel.addFloor(
          data.level.floors[floor].x,
          data.level.floors[floor].y,
          data.level.floors[floor].w,
          data.level.floors[floor].h,
          floor,
          data.level.floors[floor].visible
        )
      }
    }

    // create all walls within level
    for(var wall = 0 ; wall < data.level.walls.length ; wall++){
      newLevel.addWall(
        data.level.walls[wall].x,
        data.level.walls[wall].y,
        data.level.walls[wall].w,
        data.level.walls[wall].h,
        wall,
        data.level.walls[wall].visible
      )
    }

    // do a final build of the graph object ready for astar searching
    newLevel.agents.grid.rebuildMesh();

    // add enemy agents
    for(var agent = 0 ; agent < data.level.enemy.length ; agent++){
    // for(var agent = 0 ; agent < 0 ; agent++){

      let patrol = null;

      let team = null;

      switch (data.level.enemy[agent].type) {
        case AgentType.GENERIC: break;
        case AgentType.FOLLOW: break;
        case AgentType.WANDERING: break;
        case AgentType.PATROL:

          let pdata = data.level.enemy[agent].patrol;

          patrol = new Patrol(pdata.loop,pdata.direction);

          for(var point = 0 ; point < pdata.points.length ; point++){
            patrol.addPoint(pdata.points[point]);
          }

          break;

        case AgentType.MULTIAGENT:
          team = data.level.enemy[agent].team;
          break;
        case AgentType.DELIBERATIVE: break;
        default: break;
      }

      newLevel.addAgent(
        data.level.enemy[agent].x*this.gridSize,
        data.level.enemy[agent].y*this.gridSize,
        data.level.enemy[agent].type,
        data.level.enemy[agent].weapon,
        patrol,
        team
      );

    }

    // add world pickups
    for(var pickup = 0 ; pickup < data.level.pickups.length ; pickup++){
      newLevel.addPickup(
        data.level.pickups[pickup].x*this.gridSize,
        data.level.pickups[pickup].y*this.gridSize,
        data.level.pickups[pickup].type
      )
    }

    return newLevel;

  }

  // method invoked when a level needs to be restarted
  reloadLevel(){

    // nulling level
    this.level = null;

    // re creating level from file
    this.level = this.addLevel(this.levelData[this.currentLevel])

    // setting current states level to the current level
    this.states[GameState.PLAY_STATE].setLevel(this.level);

    // resetting play state
    this.CURRENT_STATE = GameState.PLAY_STATE;

  }

  nextLevel(){

    // setting game victory state
    if(this.currentLevel+1 === this.levelData.length){

      this.setState(GameState.VICTORY_STATE);
      this.currentLevel = -1;

    } else {

      // incrementing current level
      this.currentLevel++;

      // setting up new level
      this.level = this.addLevel(this.levelData[this.currentLevel])

      // setting level in state
      this.states[GameState.PLAY_STATE].setLevel(this.level);

      // setting state to switch state for count down
      this.CURRENT_STATE = GameState.LEVEL_SWITCH_STATE;

      // running intial update for safety
      this.level.update(0);

      // initialising level
      this.level.levelInit();

    }

  }


  update(deltaTime){

    // setting up level when start state is first loaded in
    if(this.levelManager.levelsLoaded() && this.CURRENT_STATE === GameState.START_STATE){
      this.states[this.CURRENT_STATE].setReady();
    }

    // updating current state of generator
    this.states[this.CURRENT_STATE].update(deltaTime);

  }

  draw() {

    // drawing to screen depending on state rendering specific layers  as required
    if(this.CURRENT_STATE === GameState.PAUSE_STATE){
      this.states[GameState.PLAY_STATE].draw();
      this.states[GameState.PAUSE_STATE].draw();
    } else if(this.CURRENT_STATE === GameState.LEVEL_SWITCH_STATE) {
      this.states[GameState.PLAY_STATE].draw();
      this.states[GameState.LEVEL_SWITCH_STATE].draw();
    } else if (this.CURRENT_STATE === GameState.GAMEOVER_STATE) {
      this.states[GameState.PLAY_STATE].draw();
      this.states[GameState.GAMEOVER_STATE].draw();
    } else {
      this.states[this.CURRENT_STATE].draw();
    }

  }

  setState(state){


    // switching to level switch state
    if(state === GameState.LEVEL_SWITCH_STATE){

      // setting up next level while count down operates
      this.nextLevel();
      this.states[this.CURRENT_STATE].setup();


    } else if (state === GameState.PLAY_STATE && this.CURRENT_STATE === GameState.GAMEOVER_STATE) {

      // reloading level due to gameover
      this.reloadLevel();
      this.states[this.CURRENT_STATE].setup();

    } else {

      // remaining default behavuour
      this.CURRENT_STATE = state;
      this.states[this.CURRENT_STATE].setup();

    }

  }

}
