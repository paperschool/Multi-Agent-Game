

class World {

  constructor(w,h){

    this.size = new SAT.Vector(w,h)

    this.gridSize = 20;

    this.level = new Level(this.size.x/this.gridSize,this.size.y/this.gridSize,this.gridSize);

    this.angle = 0;

    // // this.i = new Sprite("assets/sprite.png",6,256,256);
    // this.i = [
    //   new Sprite("assets/runningcat.png",512,256,0,0,2),
    //   new Sprite("assets/sprite.png",265,256,0,256,2),
    //   new Sprite("assets/explosion_1.png",50,128,100,400,5)
    // ];


  }

  update(deltaTime){
    this.level.update();
  }

  draw(){


    Draw.clear(0,0,1000,1000);

    Draw.fill(51,255,255,1.0);
    Draw.rect(0,0,this.size.x,this.size.y);

    this.level.draw();




  }

}
