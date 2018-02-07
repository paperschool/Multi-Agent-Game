

class Level {

  constructor(world,worldsize,levelsize,player,grid){

    this.worldreference = world;

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(worldsize.x,worldsize.y);

    // setting grid size variable
    this.gridSize = grid;

    // size of level in terms of grid units
    this.levelSize = new SAT.Vector(levelsize.x*grid,levelsize.y*grid);

    this.timer = new Level_Timer(10000,0,-1);

    this.background = new Level_Background(this.levelSize);

    // grid array for pathfinding
    this.grid = new Grid(this.levelSize.x,this.levelSize.y,grid);

    // collision manager
    this.CollisionManager = new CollisionManager(this);

    // particle system
    this.ParticleSystem = new ParticleSystem();

    // creating player and setting position to center of canvas
    this.player = new Player(player.x,player.y);

    // manager
    this.agents = new AgentManager(this);

    // manager for handling pickup related events
    this.pickups = new PickupManager();

    // hud map
    this.hudmap = new HUDMap(this.worldSize,this.levelSize);

    // array for storing walls
    this.walls = [];

    // astar search tick cooldown
    this.pfCoolDown = 1;
    this.pfCoolDownCounter = 0;

  }

  update(deltaTime){

    this.background.update(deltaTime);

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

  }

  draw(camera){

    // drawing the virtual world bounds
    Draw.fillCol(new Colour(240,240,240,0.3));
    Draw.rect(this.gridSize-camera.x,this.gridSize-camera.y,this.levelSize.x-this.gridSize,this.levelSize.y-this.gridSize);

    // this.timer.draw(camera);

    this.background.draw(camera);

    Draw.fill(0,0,0,0.5);
    Draw.text(300,"aldo","center",new SAT.Vector((this.levelSize.x/2)-camera.x,(this.levelSize.y/2)-camera.y),this.timer.getFormatTime());

    for(var wall = 0 ; wall < this.walls.length ; wall++){
      this.walls[wall].draw(camera);
    }

    this.grid.draw(camera);

    this.hudmap.player.set(this.player.pos);

    this.hudmap.draw(camera);

    this.ParticleSystem.draw(camera);

    this.pickups.draw(camera);

    this.player.draw(camera);

    this.agents.draw(camera);

  }

  // method that creates new wall obstacle
  addWall(x,y,w,h,id){

    // creating new wall and pushing to new array
    this.walls.push(new Wall(x,y,w,h,this.gridSize,id));

    // adding obstacles to a* star map
    this.grid.addObstacles(x,y,w,h);

  }

  addAgent(x,y,type,weapon,patrol){
    this.agents.addAgent(x,y,type,weapon,patrol);
  }

  addPickup(x,y,type){
    this.pickups.newPickup(x,y,type);
  }

}
