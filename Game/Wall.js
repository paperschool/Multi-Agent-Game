
class Wall extends Rectangle {

  constructor(x,y,w,h,grid,id){

    super(x*grid,y*grid,w*grid,h*grid);

    // size of grid
    this.gridSize = grid;

    // id
    this.id = id;

    // building colider
    this.rebuildCollider();

    // collision state of wall
    this.colliding = false;

  }

  rebuildCollider(){
    this.wall = new SAT.Polygon(
      new SAT.Vector(this.pos.x,this.pos.y),
      Draw.normalisedAARect(this.size.x,this.size.y)
    )
  }

  update(){
    // rebuilding collider
    this.rebuildCollider();
  }

  draw(camera){

    Draw.fill(100,100,222);
    // drawing rectangle at tile position (vector position * grid size to allign with grid), and drawing over x,y tiles.
    Draw.polygon(Draw.axisAlignedRect(this.pos.x-camera.x-1,this.pos.y-camera.y-1,this.size.x,this.size.y));

    Draw.fill(51,51,51);

    Draw.text(20,"serif","center",
      new SAT.Vector
      (
        this.pos.x+(10)-camera.x,
        this.pos.y+(15)-camera.y
      ),
      this.id
    );


  }

}
