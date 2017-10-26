
class Level {

  constructor(){

    this.walls = [];

    this.addWall(new Wall(0,0,500,50));

    this.addWall(new Wall(0,0,50,500));

    this.addWall(new Wall(450,0,50,500));

    this.addWall(new Wall(0,450,500,50));


  }

  addWall(wall){
    this.walls.push(wall);
  }

  update(){}

  draw(){
    for(var i = 0 ; i < this.walls.length ; i++){
      this.walls[i].draw();
    }
  }

}

class Wall {

  constructor(x,y,w,h){

    this.pos = new SAT.Vector(x,y);

    this.size = new SAT.Vector(w,h);

    this.wall = new SAT.Box(this.pos,this.size);

  }

  update(){
  }

  draw(){

    Draw.fill(51,51,51,1.0);
    Draw.rect(this.pos.x,this.pos.y,this.size.x,this.size.y);

    Draw.fill(100,100,100,1.0);
    Draw.rect(this.pos.x + 5,this.pos.y + 5,this.size.x - 10,this.size.y - 10);

  }

}
