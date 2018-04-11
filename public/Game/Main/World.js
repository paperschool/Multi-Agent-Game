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

    this.states[this.CURRENT_STATE].setup();

    // size of the virtual world (that needs to be projected to the canvas)
    this.size = new SAT.Vector(w,h)

    // size of grid squares for calculating / etc
    this.gridSize = 20;

    // array of level seed data
    this.levelData = new Array(0);

    // current level object
    this.levels = null;

    this.levelManager = new LevelManager();

    // this.levelManager.loadLevel("Game/Assets/Levels/1.json",0,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/2.json",1,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/5.json",2,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/6.json",3,this.addLevelData.bind(this));
    // this.levelManager.loadLevel("Game/Assets/Levels/7.json",4,this.addLevelData.bind(this));

    // this.levelManager.loadLevel("Game/Assets/Levels/2.json",0,this.addLevelData.bind(this));

    this.currentLevel = -1;

    input.setCallBack(InputKeys.PAUSE,(function(){
      if(this.CURRENT_STATE === GameState.PAUSE_STATE){
        this.CURRENT_STATE = GameState.PLAY_STATE;
        sound.play(SoundLabel.STATE_PLAY);
      } else if(this.CURRENT_STATE === GameState.PLAY_STATE){
        this.CURRENT_STATE = GameState.PAUSE_STATE;
        sound.play(SoundLabel.STATE_PAUSED);
      }
    }).bind(this));

    input.setCallBack(InputKeys.REPLAY,(function(){
      if(this.CURRENT_STATE === GameState.GAMEOVER_STATE){
        this.setState(GameState.PLAY_STATE);
      }
    }).bind(this));

    input.setCallBack(InputKeys.SPACE,(function(){
      if(this.CURRENT_STATE === GameState.START_STATE){
        sound.stopAll();
        this.setState(GameState.LEVEL_SWITCH_STATE);
      } else if(this.CURRENT_STATE === GameState.VICTORY_STATE){
        sound.stopAll();
        this.setState(GameState.START_STATE);
      }

    }).bind(this));

  }

  addLevelData(data,index){
    this.levelData[index] = data;
  }

  addLevel(data){

    let newLevel = null;

    // create new Level;
    newLevel = new Level(
        this,
        this.size,
        data.level.size,
        {x: data.level.player.x *this.gridSize,y:data.level.player.y *this.gridSize },
        this.gridSize
      );

    // create all walls within level
    for(var wall = 0 ; wall < data.level.walls.length ; wall++){
      newLevel.addWall(
        data.level.walls[wall].x,
        data.level.walls[wall].y,
        data.level.walls[wall].w,
        data.level.walls[wall].h,
        wall
      )
    }

    // do a final build of the graph object ready for astar searching
    newLevel.agents.grid.rebuildMesh();

    // add enemy agents
    for(var agent = 0 ; agent < data.level.enemy.length ; agent++){
    // for(var agent = 0 ; agent < 0 ; agent++){

      let patrol = null;

      if('patrol' in data.level.enemy[agent]){
        let pdata = data.level.enemy[agent].patrol;

        patrol = new Patrol(pdata.loop,pdata.direction);

        for(var point = 0 ; point < pdata.points.length ; point++){
          patrol.addPoint(pdata.points[point]);
        }

      }

      newLevel.addAgent(
        data.level.enemy[agent].x*this.gridSize,
        data.level.enemy[agent].y*this.gridSize,
        data.level.enemy[agent].type,
        data.level.enemy[agent].weapon,
        patrol
      )
    }

    // add world pickups
    for(var pickup = 0 ; pickup < data.level.pickups.length ; pickup++){
      newLevel.addPickup(
        data.level.pickups[pickup].x*this.gridSize,
        data.level.pickups[pickup].y*this.gridSize,
        data.level.pickups[pickup].type
      )
    }

    // this.camera.setFocus(this.levels[this.levelCount-1].agents.agents[0],new SAT.Vector(CW/2,CH/2));

    return newLevel;

  }

  reloadLevel(){

    this.level = this.addLevel(this.levelData[this.currentLevel])

    this.states[GameState.PLAY_STATE].setLevel(this.level);

    this.CURRENT_STATE = GameState.PLAY_STATE;


  }

  nextLevel(){

    // setting game victory state
    if(this.currentLevel+1 === this.levelData.length){

      this.setState(GameState.VICTORY_STATE);

    } else {

      this.currentLevel++;

      this.level = this.addLevel(this.levelData[this.currentLevel])

      this.level.update(0);

      this.states[GameState.PLAY_STATE].setLevel(this.level);

      this.CURRENT_STATE = GameState.LEVEL_SWITCH_STATE;

      this.states[this.CURRENT_STATE].setup();

    }

  }


  update(deltaTime){

    this.states[this.CURRENT_STATE].update(deltaTime);

  }

  draw() {

    // draw game screen with paused overlay
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


    if(state === GameState.LEVEL_SWITCH_STATE){

      this.nextLevel();

    } else if (state === GameState.PLAY_STATE && this.CURRENT_STATE === GameState.GAMEOVER_STATE) {

      this.reloadLevel();

    } else {

      this.CURRENT_STATE = state;

      this.states[this.CURRENT_STATE].setup();

    }


  }

}
