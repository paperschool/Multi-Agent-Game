

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

    // creating player and setting position to center of canvas
    this.player = new Player(playerpos.x*this.gridSize,playerpos.y*this.gridSize);

    this.enemy = [];

    for(var i = 0 ; i < 0 ; i++){
      this.enemy.push(new Agent(Utility.Random(100,1000),Utility.Random(100,1000)));
    }


    // manager for handling pickup related events
    this.pickups = new PickupManager();

    // grid for debug/rendering (maybe path finding)
    this.grid = new Grid(this.levelSize.x/grid,this.levelSize.y/grid,grid);

    this.grid.drawGrid = false;

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

    for(var i = 0 ; i < this.enemy.length ; i++){
      this.enemy[i].update(deltaTime);
    }



    this.pickups.update(deltaTime,this.player);

    this.hudmap.player.set(this.player.pos);

    this.CollisionManager.checkAll();

    this.pfCoolDownCounter++;
    if(this.pfCoolDownCounter === this.pfCoolDown){
      for(var i = 0 ; i < 5 ; i++)
        this.grid.search(
          new SAT.Vector(Math.floor(this.player.pos.x/this.gridSize),Math.floor(this.player.pos.y/this.gridSize)),
          new SAT.Vector(3,3)
        )
      this.pfCoolDownCounter = 0;
    }

  }

  draw(camera){

    // drawing the virtual world bounds
    // Draw.fill(150,150,150);
    // Draw.rect(-camera.x,-camera.y,this.worldSize.x,this.worldSize.y);

    // drawing the level world bounds
    // Draw.fillCol(new Colour(Utility.Random(100,200),Utility.Random(100,200),Utility.Random(100,200),0.4));
    Draw.fill(70,70,70,1)
    Draw.rect(-camera.x,-camera.y,this.levelSize.x,this.levelSize.y);

    this.grid.draw(camera);

    this.player.draw(camera);

    for(var i = 0 ; i < this.enemy.length ; i++){
      this.enemy[i].draw(camera);
    }

    for(var wall = 0 ; wall < this.walls.length ; wall++){
      this.walls[wall].draw(camera);
    }

    this.hudmap.player.set(this.player.pos);

    this.hudmap.draw();

    this.pickups.draw(camera);

  }

  // method that creates new wall obstacle
  addWall(x,y,w,h,id){
    // creating new wall and pushing to new array
    this.walls.push(new Wall(x,y,w,h,this.gridSize,id));
    var margin = 2;
    // iterating across wall dimensions to add obstacles to path finding grid
    for(var oby = -margin ; oby < h + margin ; oby++)
      for(var obx = -margin ; obx < w + margin ; obx++)
        this.grid.addObstacle(new SAT.Vector(y + oby,x + obx));

  }

  addPickup(x,y,type){
    this.pickups.newPickup(x,y,type);
  }

}
