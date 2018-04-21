
class Floor extends Rectangle {

  constructor(x,y,w,h,grid,id,visibility){

    super(x*grid,y*grid,w*grid,h*grid);

    // size of grid
    this.gridSize = grid;

    // id
    this.id = id;

    this.visibility = visibility;

    this.setColour(new Colour(255,255,255));

  }

  update(){}

  draw(camera){
    if(this.visibility) {
      super.draw(new SAT.Vector(camera.x+1,camera.y+1));
    }

  }

}
