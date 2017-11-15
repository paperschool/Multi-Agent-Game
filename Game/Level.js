

class Level {

  constructor(worldsize,levelsize,playerpos,grid){

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(worldsize.x,worldsize.y);

    // setting grid size variable
    this.gridSize = grid;

    // size of level in terms of grid units
    this.levelSize = new SAT.Vector(levelsize.x*grid,levelsize.y*grid);

    // creating player and setting position to center of canvas
    this.player = new Player(playerpos.x*this.gridSize,playerpos.y*this.gridSize);

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
    this.pfCoolDown = 20;
    this.pfCoolDownCounter = 0;


  }


  update(deltaTime){

    // update player
    this.player.update(deltaTime);

    var r = new SAT.Response();

    for(var wall = 0 ; wall < this.walls.length ; wall++){

      // checking horizontal vector first
      if(SAT.testPolygonPolygon(this.player.playerCol, this.walls[wall].wall,r)) {
        // console.log(this.walls[wall].id +  " collision: " + r.overlapV.x + " : " + r.overlapV.y);
        this.walls[wall].colliding = true;
        r.overlapV.scale(1.001)
        this.player.pos.sub(r.overlapV);
      }

      r.clear();

      this.walls[wall].update(deltaTime);

    }


    this.pickups.update(this.player);



    this.hudmap.player.set(this.player.pos);

    // this.pfCoolDownCounter++;
    // if(this.pfCoolDownCounter === this.pfCoolDown){
    //   for(var i = 0 ; i < 1 ; i++)
    //     this.grid.search(
    //       new SAT.Vector(Math.floor(this.player.pos.x/this.gridSize),Math.floor(this.player.pos.y/this.gridSize)),
    //       new SAT.Vector(3,3)
    //     )
    //   this.pfCoolDownCounter = 0;
    // }

  }

  draw(camera){

    // drawing the virtual world bounds
    // Draw.fill(150,150,150);
    // Draw.rect(-camera.x,-camera.y,this.worldSize.x,this.worldSize.y);

    // drawing the level world bounds
    Draw.fill(250,240,240,0.8);
    Draw.rect(-camera.x,-camera.y,this.levelSize.x,this.levelSize.y);

    for(var wall = 0 ; wall < this.walls.length ; wall++){
      this.walls[wall].draw(camera);
    }

    this.player.draw(camera);


    this.pickups.draw(camera);


    // this.grid.draw(camera);

    this.hudmap.player.set(this.player.pos);
    this.hudmap.draw();

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
