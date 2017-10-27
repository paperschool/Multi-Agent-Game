class Wall {

  constructor(x,y,w,h,grid){

    this.gridSize = grid;

    this.pos = new SAT.Vector(x*this.gridSize,y*this.gridSize);

    this.size = new SAT.Vector(w*this.gridSize,h*this.gridSize);

    this.wall = new SAT.Polygon(
      new SAT.Vector(this.pos.x,this.pos.y),
      [
        new SAT.Vector(this.pos.x,this.pos.y),
        new SAT.Vector(this.pos.x,this.pos.y + this.size.y),
        new SAT.Vector(this.pos.x + this.size.x,this.pos.y + this.size.y),
        new SAT.Vector(this.pos.x + this.size.x,this.pos.y)
      ]
    )

  }

  update(){
    // this.pos.add(new SAT.Vector(1,1));
  }

  draw(){

    Draw.fill(51,51,51,1.0);

    // drawing rectangle at tile position (vector position * grid size to allign with grid), and drawing over x,y tiles.
    Draw.polygon(this.wall.getPoints());

  }

}
