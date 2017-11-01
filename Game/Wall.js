class Wall {

  constructor(x,y,w,h,grid,offset){

    this.gridSize = grid;

    this.pos = new SAT.Vector(x*this.gridSize,y*this.gridSize);

    this.pos.add(offset);

    this.size = new SAT.Vector(w*this.gridSize,h*this.gridSize);

    this.wall = new SAT.Polygon(
      new SAT.Vector(this.pos.x,this.pos.y),
      Draw.normalisedAARect(this.size.x,this.size.y)
    )

    this.colliding = false;

  }

  // increasing position of object by some vector
  setOffset(offset){
    this.pos.add(offset);
  }

  update(){
    this.wall = new SAT.Polygon(
      new SAT.Vector(this.pos.x,this.pos.y),
      Draw.normalisedAARect(this.size.x,this.size.y)
    )
  }

  draw(){

    if(this.colliding){
      Draw.fill(255,51,51,1.0);
    } else {
      Draw.fill(51,51,51,1.0);
    }

    // drawing rectangle at tile position (vector position * grid size to allign with grid), and drawing over x,y tiles.
    Draw.polygon(Draw.axisAlignedRect(this.pos.x,this.pos.y,this.size.x,this.size.y));

    Draw.fill(100,0,0);
    Draw.circle(this.wall.pos.x,this.wall.pos.y,2,2);

  }

}
