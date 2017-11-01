

class World {

  constructor(w,h){

    // size of the virtual world (that needs to be projected to the canvas)
    this.size = new SAT.Vector(w,h)

    // size of grid squares for calculating / etc
    this.gridSize = 20;

    // level object that stores all aspects about the current level
    this.level = new Level(this.size.x,this.size.y,this.gridSize);

    this.levelManager = new LevelManager();

    this.levelManager.loadLevel("levels/1.json");

    // // this.i = new Sprite("assets/sprite.png",6,256,256);
    // this.i = [
    //   new Sprite("assets/runningcat.png",512,256,0,0,2),
    //   new Sprite("assets/sprite.png",265,256,0,256,2),
    //   new Sprite("assets/explosion_1.png",50,128,100,400,5)
    // ];

    this.phaseShift = -1;
    this.phaser = 0;

  }

  update(deltaTime){
    this.level.update();
  }

  draw(){

    Draw.clear(0,0,this.size.x,this.size.y);

    Draw.fill(this.phaser,200,100,1.0);
    Draw.rect(0,0,this.size.x,this.size.y);

    this.level.draw();

    this.phaser += this.phaseShift;

    if(this.phaser < 0) this.phaseShift = 1;
    if(this.phaser > 255) this.phaseShift = -1;

  }

}
