

class Level {

  constructor(x,y,grid){

    this.levelSize = new SAT.Vector(60,40);

    this.worldSize = new SAT.Vector(x,y);

    this.gridSize = grid;

    this.player = new Player(200,200,50);

    this.offset = new SAT.Vector(200,200);

    this.walls = [];

    // top wall
    this.addWall(0,0,20,1);

    this.addWall(0,0,1,20);

    this.addWall(19,0,1,20);

    this.addWall(0,19,20,1);

  }

  addWall(x,y,w,h){
    let wall = new Wall(x,y,w,h,this.gridSize);
    this.walls.push(wall);
  }

  collisionDetection(){
    for(var wall = 0 ; wall < this.walls.length ; wall++){

      Draw.fill(200,0,0);

      if(SAT.testPolygonCircle(this.walls[wall].wall,new SAT.Circle(new SAT.Vector(10,10), 20))){
          console.log(this.colliding);
          Draw.fill(200,200,50);
      }
      Draw.circle(mousePos.x,mousePos.y,20);

      // this.player.checkCollision(this.walls[wall].wall);
    }
  }

  update(deltaTime){
    this.player.update(deltaTime);
  }

  draw(){

    // for(var y = 0 ; y < this.levelSize.y ; y++){
    //   for(var x = 0 ; x < this.levelSize.x ; x++){
    //       this.drawTile(x*this.gridSize,y*this.gridSize,this.gridSize);
    //   }
    // }

    for(var wall = 0 ; wall < this.walls.length ; wall++){
      this.walls[wall].update();
      this.walls[wall].draw();
    }

    this.player.draw();

    this.collisionDetection();

  }

  drawTile(x,y,size){
    Draw.fill(230,230,230,1.0);
    Draw.rect(x,y,size,size);
    Draw.fill(50,50,50,1.0);
    Draw.rect(x+1,y+1,size-2,size-2);
  }


}
