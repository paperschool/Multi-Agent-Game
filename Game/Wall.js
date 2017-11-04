class Wall {

  constructor(x,y,w,h,grid,offset,id){

    // size of grid
    this.gridSize = grid;

    // position wall would be on virtual world
    this.pos = new SAT.Vector(x*this.gridSize,y*this.gridSize);

    // the distance from top corner of canvas to virtual world top left
    this.offset = offset;

    // size of wall based off of grid size units
    this.size = new SAT.Vector(w*this.gridSize,h*this.gridSize);

    // id
    this.id = id;

    // building colider
    this.rebuildCollider();

    // collision state of wall
    this.colliding = false;

  }

  rebuildCollider(){
    this.wall = new SAT.Polygon(
      new SAT.Vector(this.pos.x + this.offset.x,this.pos.y + this.offset.y),
      Draw.normalisedAARect(this.size.x,this.size.y)
    )
  }

  // setting offset to a value + current offset
  setLocalOffset(offset){
    this.offset.add(offset);
  }

  // setting offset to a new value entirely
  setWorldOffset(offset){
    this.offset.set(offset.x,offset.y);
  }

  update(){
    // rebuilding collider
    this.rebuildCollider();
  }

  draw(){

    Draw.fill(51,51,51,1.0);
    // drawing rectangle at tile position (vector position * grid size to allign with grid), and drawing over x,y tiles.
    Draw.polygon(Draw.axisAlignedRect(this.pos.x+this.offset.x,this.pos.y+this.offset.y,this.size.x,this.size.y));

    Draw.fill(255,255,255);
    Draw.text(20,"serif","center",new SAT.Vector(this.pos.x+this.offset.x+20,this.pos.y+this.offset.y+20),this.id);


  }

}
