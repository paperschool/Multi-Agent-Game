

class World {

  constructor(w,h){

    // size of the virtual world (that needs to be projected to the canvas)
    this.size = new SAT.Vector(w,h)

    // size of grid squares for calculating / etc
    this.gridSize = 20;

    // level array
    this.levels = [];

    this.levelManager = new LevelManager();

    this.levelManager.loadLevel("levels/1.json",this.addLevel.bind(this));

    this.currentLevel = -1;
    this.levelCount = 0;

    this.p1 = new SAT.Vector(200,300);
    this.p2 = new SAT.Vector(600,600)

  }

  addLevel(data){
    this.levelCount++;
    this.currentLevel = 0;
    this.levels.push(
      new Level(
        this.size,
        data.level.size,
        data.level.player,
        this.gridSize
      )
    );

    for(var wall = 0 ; wall < data.level.walls.length ; wall++){
      this.levels[this.levelCount-1].addWall(
        data.level.walls[wall].x,
        data.level.walls[wall].y,
        data.level.walls[wall].w,
        data.level.walls[wall].h,
        wall
      )
    }

  }

  update(deltaTime){
      // if(this.currentLevel >= 0)
      //   this.levels[this.currentLevel].update();
      //
      //
      //




  }

  draw(){

    Draw.clear(0,0,this.size.x,this.size.y);

    Draw.fill(this.phaser,200,100,1.0);

    Draw.fill(51,51,51);

    Draw.rect(0,0,this.size.x,this.size.y);

    // if(this.currentLevel >= 0)
    //   this.levels[this.currentLevel].draw();


    Draw.fill(250,250,250);

    Draw.circle(this.p1.x,this.p1.y,4);
    Draw.line(this.p1.x,this.p1.y,this.p1.x,this.p1.y+100,2,"#FFFFFF");
    Draw.line(this.p1.x,this.p1.y,this.p1.x+100,this.p1.y,2,"#FFFFFF");


    Draw.circle(this.p2.x,this.p2.y,4);
    Draw.line(this.p2.x,this.p2.y,this.p2.x,this.p2.y+100,2,"#FFFFFF");
    Draw.line(this.p2.x,this.p2.y,this.p2.x+100,this.p2.y,2,"#FFFFFF");


  }

}
