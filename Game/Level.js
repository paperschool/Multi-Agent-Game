

class Level {

  constructor(worldsize,levelsize,playerpos,grid){

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(worldsize.x,worldsize.y);

    // setting grid size variable
    this.gridSize = grid;

    // size of level in terms of grid units
    this.levelSize = new SAT.Vector(levelsize.x*grid,levelsize.y*grid);

    // creating player and setting position to center of canvas
    this.player = new Player(CW/2,CH/2,50,this.levelSize);

    this.player.worldPosition.set(playerpos.x*grid,playerpos.y*grid);

    // distance from top left corner of screen to top left corner of virtual world
    this.worldOffset = new SAT.Vector((CW/2) - this.player.worldPosition.x,(CH/2) - this.player.worldPosition.y);

    // offset vector that is applied for translations (current offset velocity of player)
    this.offset = new SAT.Vector(0,0);

    // grid for debug/rendering (maybe path finding)
    this.grid = new Grid(this.levelSize.x/grid,this.levelSize.y/grid,grid);

    this.grid.drawGrid = false;

    // input class with input events and tailored callback info
    this.input = new Input(this.mouseMoveEvent.bind(this),this.mouseDownEvent.bind(this),this.keyEvent.bind(this));

    // hud map
    this.hudmap = new HUDMap(this.worldSize,this.levelSize);

    // array for storing walls
    this.walls = [];

    // astar search tick cooldown
    this.pfCoolDown = 10;
    this.pfCoolDownCounter = 0;


  }


  update(deltaTime){

    for(var wall = 0 ; wall < this.walls.length ; wall++){

      this.walls[wall].setWorldOffset(this.worldOffset);
      // this.walls[wall].setOffset(this.player.vel);
      this.walls[wall].update();

    }

    // update player
    this.player.update(deltaTime,this);

    // console.log(Math.floor(this.player.worldPosition.x),Math.floor(this.worldOffset.x));

    this.hudmap.player.set(this.player.worldPosition.x,this.player.worldPosition.y);


    this.pfCoolDownCounter++;
    if(this.pfCoolDownCounter === this.pfCoolDown){
      this.grid.search(
        new SAT.Vector(Math.floor(this.player.worldPosition.x/this.gridSize),Math.floor(this.player.worldPosition.y/this.gridSize)),
        new SAT.Vector(3,3)
      )
      this.pfCoolDownCounter = 0;
    }

  }

  draw(){

    // drawing the virtual world bounds
    Draw.fill(150,150,150);
    Draw.rect(this.worldOffset.x,this.worldOffset.y,this.worldSize.x,this.worldSize.y);

    // drawing the level world bounds
    Draw.fill(250,240,240);
    Draw.rect(this.worldOffset.x,this.worldOffset.y,this.levelSize.x,this.levelSize.y);

    // this.grid.setOffset(this.worldOffset);
    // this.grid.draw();

    for(var wall = 0 ; wall < this.walls.length ; wall++){
      this.walls[wall].draw();
    }

    this.player.draw();
    
    this.grid.setOffset(this.worldOffset)
    this.grid.draw();

    this.hudmap.player.set(this.player.worldPosition.x,this.player.worldPosition.y);
    this.hudmap.draw();

  }

  // method that creates new wall obstacle
  addWall(x,y,w,h,id){

    // creating new wall and pushing to new array
    this.walls.push(new Wall(x,y,w,h,this.gridSize,this.worldOffset,id));

    var margin = 1;

    // iterating across wall dimensions to add obstacles to path finding grid
    for(var oby = -margin ; oby < h + margin ; oby++)
      for(var obx = -margin ; obx < w + margin ; obx++)
        this.grid.addObstacle(new SAT.Vector(y + oby,x + obx));

  }

  // setting the rendering offset based of player position`
  setLevelProjectionOffset(offset){
    // multiplying offset vector by -1 to reverse direction player is moving in (simulate movement)
    this.worldOffset.add(offset.mul({x:-1,y:-1}));
  }



  // event handling ////
  keyEvent(key) {
    var type = "KEYBOARD";

    switch(key){
      case "G": this.grid.drawGrid ^= true; break;
      case "H": this.grid.drawPath ^= true; break;
    }

    this.player.input(type,key);
  }

  mouseMoveEvent(e){}

  mouseDownEvent(e){}


}
