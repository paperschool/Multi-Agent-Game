

class Level {

  constructor(x,y,grid){

    // size of world in virtual pixels (offscreen and onscreen)
    this.worldSize = new SAT.Vector(x,y);

    // setting grid size variable
    this.gridSize = grid;

    // size of level in terms of grid units
    this.levelSize = new SAT.Vector(100*grid,100*grid);

    // creating player and setting position to center of canvas
    this.player = new Player(CW/2,CH/2,50,this.levelSize);

    this.player.worldPosition.set(this.levelSize.x/2,this.levelSize.y/2);

    // current cumulative offset vector (history of movements)
    this.worldOffset = new SAT.Vector((CW/2) - this.player.worldPosition.x,(CH/2) - this.player.worldPosition.y);

    // offset vector that is applied for translations (current offset velocity of player)
    this.offset = new SAT.Vector(0,0);

    // grid for debug/rendering (maybe path finding)
    this.grid = new Grid(this.levelSize.x,this.levelSize.y,grid);

    // input class with input events and tailored callback info
    this.input = new Input(this.mouseMoveEvent.bind(this),this.mouseDownEvent.bind(this),this.keyEvent.bind(this));

    // hud map
    this.hudmap = new HUDMap(this.worldSize,this.levelSize);

    // array for storing walls
    this.walls = [];

    // top wall
    for(var i = 0 ; i < 100 ; i++){
      var pos = new SAT.Vector(Utility.Random(0,100),Utility.Random(0,100));
      this.addWall(pos.x,pos.y,5,5);
    }


  }


  update(deltaTime){

    this.player.checkWorldBounds(this.worldSize,this.levelSize);

    this.player.update(deltaTime);

    this.hudmap.player.set(this.player.worldPosition.x,this.player.worldPosition.y);

    // returning calculated player position as vector to offset level
    this.setLevelProjectionOffset(this.player.vel)

    for(var wall = 0 ; wall < this.walls.length ; wall++){
      // this.walls[wall].setTranslation(this.worldOffset);

      this.walls[wall].setOffset(this.player.vel);
      this.walls[wall].update();

      this.player.checkCollision(this.walls[wall]);
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

    this.hudmap.player.set(this.player.worldPosition.x,this.player.worldPosition.y);
    this.hudmap.draw();

  }

  // method that creates new wall obstacle
  addWall(x,y,w,h){
    // creating new wall and pushing to new array
    this.walls.push(new Wall(x,y,w,h,this.gridSize,this.worldOffset));
  }

  // setting the rendering offset based of player position`
  setLevelProjectionOffset(offset){
    this.worldOffset.add(offset.mul({x:-1,y:-1}));
  }

  ///////////////////////
  // event handling /////
  keyEvent(key) {
    var type = "KEYBOARD";
    this.player.input(type,key);
  }

  mouseMoveEvent(e){
    // console.log(e);
    // this.pos.x = e.x;
    // this.pos.y = e.y;
  }

  mouseDownEvent(e){
    // console.log(e);
  }


}
