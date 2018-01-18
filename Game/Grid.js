
class Grid {

  constructor(x,y,gs){

    this.levelSize = new SAT.Vector(x/gs,y/gs);

    this.gridSize = gs;

    ////////////////////////

    this.pathMesh = []
    this.pathMeshInverted = [];

    for(var y = 0 ; y < this.levelSize.y ; y++){
      let row = [];
      for(var x = 0 ; x < this.levelSize.x ; x++){
        row.push(1);
      }
      this.pathMesh.push(row);
      this.pathMeshInverted.push(row);
    }

    // this is the object that will hold the aStar search area
    this.graph = []

    // this array will return the path
    this.result = [];

    // Debug
    this.lineofsight = [];

  }

  // recreating graph array to fresh search area.
  rebuildMesh(){
    this.graph = new Graph(this.pathMeshInverted,{ diagonal: true });
  }

  // this method will parse a non-grid normalised vector to a grid-normalised vector by rounding to a grid unit then dividing to that grid unit
  getGridVector(pos){
    return new SAT.Vector(Utility.roundTo(pos.x,this.gridSize)/this.gridSize,Utility.roundTo(pos.y,this.gridSize)/this.gridSize);
  }

  // this will return false if the position exceeds the search grid
  checkGraphBound(position){
    if(typeof this.pathMesh[position.y] !== 'undefined'){
      if(typeof this.pathMesh[position.y][position.x] !== 'undefined'){
        return true;
      }
    }
    return false;
  }

  // converts the grid array at position.x/.y to an obstacle.
  addObstacle(position){
    if(this.checkGraphBound(position)){
      // this.graph.grid[position.y][position.x].closed = true;
      this.pathMesh[position.y][position.x] = 0;
      this.pathMeshInverted[position.x][position.y] = 0;
     }
  }

  // this method will query the obstacle grid to determine if that position is
  // an obstacle or not
  isObstacle(position){
    // return this.graph.grid[position.y][position.x].closed === true;
    return this.pathMesh[position.y][position.x] === 0
  }

  // this method will take two nongrid positions and determine if they are
  // within the same grid position
  isAtMapPosition(p1,p2){
    return this.getGridVector(p1).x === this.getGridVector(p2).x &&
           this.getGridVector(p1).y === this.getGridVector(p2).y;
  }

  // this method will take two grid positions and determine if they are
  // identical
  isAtGridPosition(p1,p2){
    return p1.x === p2.x && p1.y === p2.y;
  }

  // returning full search path
  getPath(){
    return this.result;
  }

  // returns a random grid cell from the map
  getRandomGridPosition(){
    // get random position
    return {
      x:Utility.RandomInt(0,this.pathMesh.length-1),
      y:Utility.RandomInt(0,this.pathMesh[0].length-1)
    }
  }

  // returns a random NON-OBSTACLE grid cell from the map
  getRandomNonObstacleGridPosition(){

    // fetching a random position from the grid
    let pos = this.getRandomGridPosition();

    // looping until a position is found that isnt an obstacle
    while(this.isObstacle(pos)){
      // updating position variable to new position
      pos = this.getRandomGridPosition();
    }

    return pos;
  }

  // this method simply wraps the get random non obstacle method except it
  // returns a position which is scaled to the map size rather then a grid cell
  getRandomNonObstacleMapPosition(){

    let p = this.getRandomNonObstacleGridPosition();

    // returning a map normalised position in the center of the selected grid cell
    return new SAT.Vector(p.x*(this.gridSize/2),p.y*(this.gridSize/2))
  }

  // SEARCHING METHODS

  // Purpose of his function is to determine if the line between an
  // enemy and a player is obstructed by an obstacle on the grid.
  // A evolved version of bresenham's line cover algorithm to also add squares
  // that might have been overlooked, code taken from:
  // https://www.redblobgames.com/grids/line-drawing.html
  // the algorithm has been modified to detect obstacle potential
  lineOfSight(start,end){

    // failed boolean
    let success = true;

    // calculating seperated delta of axis
    let dx = end.x-start.x
    let dy = end.y-start.y;

    // calculating absolute delta
    let nx = Math.abs(dx)
    let ny = Math.abs(dy);

    // calculating seperated sign of delta
    let sign_x = (dx > 0 ? 1 : -1)
    let sign_y = (dy > 0 ? 1 : -1)

    // creating new point
    let p = {x:start.x,y:start.y};

    this.lineofsight.push({x:p.x,y:p.y,ok:true})

    // iterating until ix or iy < nx or ny
    for (var ix = 0, iy = 0; ix < nx || iy < ny;) {

        if ((0.5+ix) / nx == (0.5+iy) / ny) {

          // next step is diagonal
          // increment position to next cell by gradient value
          p.x += sign_x;
          p.y += sign_y;

          // increment x and y direction
          ix++;
          iy++;

        } else if ((0.5+ix) / nx < (0.5+iy) / ny) {

            // next step is horizontal
            p.x += sign_x;
            // increment only horizontal direction
            ix++;

        } else {

            // next step is vertical
            p.y += sign_y;
            // increment only horizontal direction
            iy++;

        }

        this.lineofsight.push({x:p.x,y:p.y,ok:true})

        // after new position has been calculated check if position lays on
        // obstacle position, if true, the method will return false denoting
        // no line of sight
        if(this.isObstacle(p)){
          this.lineofsight[this.lineofsight.length-1].ok = false;
          success = false;;
        }

      }


      // return true as no obstacle has been found yet or false for
      // the opposite
      if(success){
        return true;
      } else {
        return false;
      }

  }

  // searching from start position to end position using a Star search;
  search(start,end){

    // normalising to grid shape
    start = this.getGridVector(start);

    end   = this.getGridVector(end);

    if(!this.checkGraphBound(start)) return;

    if(!this.checkGraphBound(end)) return;

    this.start  = this.graph.grid[start.x][start.y];
    this.end    = this.graph.grid[end.x][end.y];

    this.result = astar.search(this.graph, this.start, this.end, { heuristic: astar.heuristics.diagonal });

    return this.result;

  }

  update(){
    this.lineofsight = []
  }

  // UPDATE AND DRAW METHODS

  draw(camera){

    for(var y = 0 ; y < this.pathMesh.length ; y++){
      for(var x = 0 ; x < this.pathMesh[y].length ; x++){
        // calculated offset position taking camera offset into consideration
        let offsetPos = new SAT.Vector(-camera.x + (x*this.gridSize),-camera.y + (y*this.gridSize));

        // ignore drawing any squares that fall off screen
        if((offsetPos.x < 0 || offsetPos.x > CW) || (offsetPos.y < 0 || offsetPos.y > CH)){
          continue;
        }

        if(this.pathMesh[y][x] === 0){
          Draw.stroke(0.5,"#FF0000");
        } else {
          Draw.stroke(0.5,"#000000");
        }
        // if(this.graph.grid[x][y].visted){
        //   Draw.stroke(0.5,"#0000FF");
        // }

        Draw.rectOutline(offsetPos.x,offsetPos.y,this.gridSize,this.gridSize);

      }
    }

  }

}
