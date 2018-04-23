class Level {

  constructor(world,worldsize,levelsize,player,grid){

    this.worldreference = world;

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(worldsize.x,worldsize.y);

    this.levelState = LevelState.RUNNING;

    // setting grid size variable
    this.gridSize = grid;

    // size of level in terms of grid units
    this.levelSize = new SAT.Vector(levelsize.x*grid,levelsize.y*grid);

    // level count down timer
    this.timer = new LevelTimer(30000,-1,false,this.levelSize,null);

    // background render stuff
    this.background = new Level_Background(this.levelSize);

    // grid array for pathfinding
    this.grid = new Grid(this.levelSize.x,this.levelSize.y,grid);

    // collision manager
    this.CollisionManager = new CollisionManager(this);

    // particle system
    this.ParticleSystem = new ParticleSystem();

    // creating player and setting position to center of canvas
    this.player = new Player(player.x,player.y);

    this.player.setLevel(this);

    // manager
    this.agents = new AgentManager(this);

    // manager for handling pickup related events
    this.pickups = new PickupManager(this.player);

    // hud map
    this.hudmap = new HUDMap(this.worldSize,this.levelSize);

    this.hud = new HUD(this,this.timer);

    // array for storing walls
    this.walls = [];

    // creating new camera objext
    this.camera = new CameraShudder(0,0,CW,CH,this.worldSize.x,this.worldSize.y);

    // set camera focus
    this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));

    this.colour = new PulseColour(new Colour().random());

    this.music = new LevelMusic();

    this.floors = [];

    // astar search tick cooldown
    this.pfCoolDown = 1;
    this.pfCoolDownCounter = 0;

    input.setCallBack(InputKeys.GODMODE,'levelgodmode',(function(){

      console.log("Gode Mode Set To: " + !this.player.getInvincibility())
      this.player.setInvincibility(!this.player.getInvincibility());

    }).bind(this));

    input.setCallBack(InputKeys.TOGGLETHEME,'levelthemetoggle',(function(){
      gameTheme = gameTheme === LightTheme ? DarkTheme : LightTheme;
      this.floor.setHex(gameTheme['FLOOR']);

    }).bind(this));

    // pause incrmeneting time through the use of a trap
    input.setCallBack(InputKeys.PAUSE,'timerpause',(function(){
      if(!this.timer.paused){
        this.timer.pauseTimer();
      } else if(this.timer.paused){
        this.timer.unpauseTimer();
      }
    }).bind(this));

  }

  // method to set up initial level settings
  levelStart(){
    this.pickups.setLevelReady(true);
  }

  // this method runs only once per level switch ( does not fire on restart )
  levelInit(){
    this.music.play();
  }

  update(deltaTime){

    this.colour.step();
    // this.colour.step(- (1/2500 * this.player.getLife() ) + 1/20);

    // if(input.isDown(InputKeys.SHIFT)){
    //
    //   input.mouseFocusable.pos.x -= this.player.x
    //   input.mouseFocusable.pos.y -= this.player.y
    //
    //   this.camera.setFocus(input.mouseFocusable,new SAT.Vector(CW/2,CH/2));
    // } else {
    //   this.camera.setFocus(this.player,new SAT.Vector(CW/2,CH/2));
    // }

    this.camera.update(deltaTime);

    this.background.update(deltaTime);

    for(let floor of this.floors){
      floor.update(deltaTime);
    }

    this.timer.update(deltaTime);

    for(var i = 0 ; i < this.walls.length ; i++)
      this.walls[i].update(deltaTime);

    // update player
    this.player.update(deltaTime);

    this.pickups.update(deltaTime,this.player);

    this.agents.update(deltaTime);

    this.ParticleSystem.update(deltaTime);

    this.CollisionManager.checkAll();

    this.grid.update();

    // rolling back positions of out of bound playerIsShooting
    this.agents.checkOutOfBounds();

    // checking player movement exceeded level boundaries or entered obstacle
    if(this.grid.isOutsideBounds(this.player.getPos()) || this.grid.isWall(this.grid.getGridVector(this.player.getPos()))) {
      this.player.rollBackPosition();
    }

    this.updateLevelState();

    this.hud.update(deltaTime);

  }

  draw(){

    this.colour.getColour().a = 0.4

    Draw.fillCol(this.colour.getColour())

    Draw.rect(0,0,CW,CH);

    let camera = this.camera.getOffset();

    for(let floor of this.floors){
      floor.draw(camera);
    }

    // drawing the virtual world bounds
    // Draw.fillCol(this.floor);
    // Draw.rect(this.gridSize-camera.x,this.gridSize-camera.y,this.levelSize.x-this.gridSize,this.levelSize.y-this.gridSize);

    this.background.draw(camera);

    for(var wall = 0 ; wall < this.walls.length ; wall++){
      this.walls[wall].draw(camera,false);
    }

    for(var wall = 0 ; wall < this.walls.length ; wall++){
      this.walls[wall].draw(camera,true);
    }

    this.grid.draw(camera);

    this.ParticleSystem.draw(camera);

    this.pickups.draw(camera);

    this.player.draw(camera);

    this.agents.draw(camera);

    this.timer.draw(camera);

    this.hud.draw(camera);


  }

  // method that creates new wall obstacle
  addWall(x,y,w,h,id,visible){
    // creating new wall and pushing to new array
    this.walls.push(new Wall(x,y,w,h,this.gridSize,id,visible));

    // adding obstacles to a* star map
    this.grid.addObstacles(x,y,w,h);
  }


  addDeadSpace(x,y,w,h){
    this.grid.addDeadSpace(x,y,w,h);
  }

  addFloor(x,y,w,h,id,visible){
    // creating new wall and pushing to new array
    this.floors.push(new Floor(x,y,w,h,this.gridSize,id,visible));
  }

  addAgent(x,y,type,weapon,patrol,team){
    this.agents.addAgent(x,y,type,weapon,patrol,team);
  }

  addPickup(x,y,type){
    this.pickups.newPickup(x,y,type);
  }

  updateLevelState(){

    if(!this.player.getAlive()){
      this.levelState = LevelState.PLAYER_DEAD;
    }

    if(this.agents.getLiveAgents() <= 0){
      this.levelState = LevelState.ENEMY_DEAD;
    }

    if(this.timer.isEnded()){
      this.levelState = LevelState.TIMEOUT;
    }

  }

  getLevelState(){
    return this.levelState;
  }

}
