

class World {

  constructor(w,h){

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

    this.p1 = new SAT.Vector(200,300);

    this.p2 = new SAT.Vector(600,600);

  }

  addLevel(data){

    this.levelCount++;

    this.currentLevel = 0;

    // create new Level;
    this.levels.push(
      new Level(
        this.size,
        data.level.size,
        data.level.player,
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

    // add world pickups
    for(var pickup = 0 ; pickup < data.level.pickups.length ; pickup++){
      this.levels[this.levelCount-1].addPickup(
        data.level.pickups[pickup].x,
        data.level.pickups[pickup].y,
        data.level.pickups[pickup].type
      )
    }

    // set camera focus
    this.camera.setFocus(this.levels[this.levelCount-1].player,new SAT.Vector(CW/2,CH/2));


  }

  update(deltaTime){

      if(this.currentLevel >= 0)
        this.levels[this.currentLevel].update(deltaTime);

      this.camera.update();


  }

  draw(){
    Draw.fill(100,100,222);
    Draw.rect(0,0,this.size.x,this.size.y);

    // Draw.clear(-200,-200,this.size.x,200);

    // Draw.fill(51,51,51);
    // Draw.rect(0,0,this.size.x,this.size.y);

    if(this.currentLevel >= 0)
      this.levels[this.currentLevel].draw(this.camera.getOffset());


    diagnostic.draw();

  }

}
