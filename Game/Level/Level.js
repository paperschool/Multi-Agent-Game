

class Level {

  constructor(worldsize,levelsize,playerpos,grid){

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(worldsize.x,worldsize.y);

    // setting grid size variable
    this.gridSize = grid;

    // size of level in terms of grid units
    this.levelSize = new SAT.Vector(levelsize.x*grid,levelsize.y*grid);

    // collision manager
    this.CollisionManager = new CollisionManager(this);

    // particle system
    this.ParticleSystem = new ParticleSystem();

    // creating player and setting position to center of canvas
    this.player = new Player(playerpos.x*this.gridSize,playerpos.y*this.gridSize);

    //
    this.agents = new AgentManager(this,this.gridSize);

    // manager for handling pickup related events
    this.pickups = new PickupManager();

    this.enemy = [];

    // hud map
    this.hudmap = new HUDMap(this.worldSize,this.levelSize);

    // array for storing walls
    this.walls = [];

    // astar search tick cooldown
    this.pfCoolDown = 1;
    this.pfCoolDownCounter = 0;

  }

  update(deltaTime){

    for(var i = 0 ; i < this.walls.length ; i++)
      this.walls[i].update(deltaTime);

    if(this.player.weapon)
      for(var i = 0 ; i < this.player.weapon.bullets.length ; i++)
          this.player.weapon.bullets[i].update(deltaTime);

    // update player
    this.player.update(deltaTime);

    this.pickups.update(deltaTime,this.player);

    this.agents.update(deltaTime);

    this.ParticleSystem.update(deltaTime);

    this.CollisionManager.checkAll();

  }

  draw(camera){

    // drawing the virtual world bounds
    Draw.fill(100,100,100,1)
    Draw.rect(-camera.x,-camera.y,this.levelSize.x,this.levelSize.y);

    for(var wall = 0 ; wall < this.walls.length ; wall++){
      this.walls[wall].draw(camera);
    }

    this.hudmap.player.set(this.player.pos);

    this.hudmap.draw(camera);

    this.ParticleSystem.draw(camera);

    this.pickups.draw(camera);

    this.agents.draw(camera);

    this.player.draw(camera);

  }

  // method that creates new wall obstacle
  addWall(x,y,w,h,id){

    // creating new wall and pushing to new array
    this.walls.push(new Wall(x,y,w,h,this.gridSize,id));

    // adding obstacles to a* star map
    this.agents.addObstacle(x,y,w,h);

  }

  addAgent(x,y,type){
    this.agents.addAgent(x,y,type);
  }

  addPickup(x,y,type){
    this.pickups.newPickup(x,y,type);
  }

}
