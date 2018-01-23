
class Grid {

  constructor(x,y,gs){

    this.levelSize = new SAT.Vector(x/gs,y/gs);

    this.gridSize = gs;

    ////////////////////////

    this.EMPTY = 1
    this.WALL  = 0
    this.MARGIN = 1000;

    this.pathMesh = []

    this.pathMeshInverted = [];

    for(var y = 0 ; y < this.levelSize.y ; y++){
      let row = [];
      let rowi = [];
      for(var x = 0 ; x < this.levelSize.x ; x++){
        row.push(this.EMPTY);
        rowi.push(this.EMPTY);
      }
      this.pathMesh.push(row);
      this.pathMeshInverted.push(rowi);
    }

    // this is the object that will hold the aStar search area
    this.graph = []

    // this array will return the path
    this.result = [];

    // Debug
    this.lineofsight = [];

    // draw grid switch boolean
    this.drawDebugGrid = false;

  }

  // recreating graph array to fresh search area.
  rebuildMesh(){
    this.graph = new Graph(this.pathMeshInverted,{ diagonal: true });
  }

  // this method will parse a non-grid normalised vector to a grid-normalised vector by rounding to a grid unit then dividing to that grid unit
  getGridVector(pos){
    return new SAT.Vector((Utility.roundTo(pos.x,this.gridSize)/this.gridSize),(Utility.roundTo(pos.y,this.gridSize)/this.gridSize));
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


    // this method will query the obstacle grid to determine if that position is
  // an obstacle or not
  isObstacle(position){
    // return this.graph.grid[position.y][position.x].closed === true;
    return this.pathMesh[position.y][position.x] === this.WALL
  }

  // converts the grid array at position.x/.y to an obstacle.
  addObstacle(position,weight = 0){

    if(!this.checkGraphBound(position)) return;

    if(this.pathMesh[position.y][position.x] !== this.WALL || weight === this.WALL){
      // this.graph.grid[position.y][position.x].closed = true;
      this.pathMesh[position.y][position.x] = weight;
      // temp object designed for astar library
      this.pathMeshInverted[position.x][position.y] = weight;
     }
  }

  // this adds virtual obstacles to the a* map using wall dimensions as discrete obstacles
  addObstacles(x,y,w,h){

    var margin = 4;

    // iterating across wall dimensions to add obstacles to path finding grid
    for(var obly = -margin + y ; obly < y + h + margin ; obly++)
      for(var oblx = -margin + x ; oblx < x + w + margin ; oblx++){
        if(oblx >= x && oblx < x + w && obly >= y && obly < y + h){

          this.addObstacle(new SAT.Vector(oblx,obly),this.WALL);

        } else {

          // let obstacleWeight = (Math.abs(margin - Math.abs(w-oblx))*10) + (Math.abs(margin - Math.abs(h-obly))*10)
          // console.log(obstacleWeight)

          this.addObstacle(new SAT.Vector(oblx,obly),this.MARGIN);
        }
      }
  }

  // this method will take a non grid vector and determine if it
  // sit in a grid normalised obstacle position
  isObstacleNonGrid(position){
    this.isObstacle(this.getGridVector(position));
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
  getRandomNonObstacleGridPosition(startPos){

    // fetching a random position from the grid
    let pos = this.getRandomGridPosition();

    // looping until a position is found that isnt an obstacle
    while(this.isObstacle(pos)){
      // updating position variable to new position
      pos = this.getRandomGridPosition();
    }

    return pos;
  }

  // returning a random non-obstacle position that can be routed to
  // as wander logic will break if outside of map bounds
  getRoutableRandomNonObstacleGridPosition(start){

      let p = this.getRandomNonObstacleGridPosition();

      let _start = this.getGridVector(start);

      let s = this.searchGrid(_start,p);

      while(s.length === 0 || s === null || typeof s === 'undefined'){
        p = this.getRandomNonObstacleGridPosition();
        s = this.searchGrid(_start,p);
      }

      return p;

  }

  // this method simply wraps the get random non obstacle method except it
  // returns a position which is scaled to the map size rather then a grid cell
  getRandomNonObstacleMapPosition(){

    let p = this.getRandomNonObstacleGridPosition();

    // returning a map normalised position in the center of the selected grid cell
    return new SAT.Vector((p.x*this.gridSize) + (this.gridSize/2),(p.y*this.gridSize) + (this.gridSize/2))
  }


  getRoutableRandomNonObstacleMapPosition(start){

    let p = this.getRoutableRandomNonObstacleGridPosition(start);

    return new SAT.Vector((p.x*this.gridSize) + (this.gridSize/2),(p.y*this.gridSize) + (this.gridSize/2))

  }

  // SEARCHING METHODS

  // performing a star search on grid using non grid normalised positions,
  // therefore a preprocessing step requires the map positions to be normalised
  searchMap(start,end){
    // normalising start and end positions to grid prior to searching grid
    return this.searchGrid(this.getGridVector(start),this.getGridVector(end));

  }

  // performing a star search on grid using grid normalised positions
  searchGrid(start,end){

    if(!this.checkGraphBound(start)) return;

    if(!this.checkGraphBound(end)) return;

    this.start  = this.graph.grid[start.x][start.y];
    this.end    = this.graph.grid[end.x][end.y];

    this.result = astar.search(this.graph, this.start, this.end, { heuristic: astar.heuristics.diagonal });

    return this.result;

  }

  // from and to are assumed to be non normalised
  requestSearchPath(from,to){

    let path = this.searchMap(from,to);

    let cleanPath = [];

    if(path){
      // create a simpler path object
      for(var i = 0 ; i < path.length ; i++)
        cleanPath.push(
          new SAT.Vector(
            // setting results to invert (search x/y => global y/x grid) and setting
            // the focus to the center of the grid square
            (path[i].x*this.gridSize) + this.gridSize/2,
            (path[i].y*this.gridSize) + this.gridSize/2
          )
        );
    }

    return cleanPath;
  }

  // Purpose of his function is to determine if the line between an
  // enemy and a player is obstructed by an obstacle on the grid.
  // A evolved version of bresenham's line cover algorithm to also add squares
  // that might have been overlooked, code taken from:
  // https://www.redblobgames.com/grids/line-drawing.html
  // the algorithm has been modified to detect obstacle potential
  lineOfSight(start,end,returnPath){

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

    returnPath.push({x:p.x,y:p.y,ok:true,success:false})

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

        returnPath.push({x:p.x,y:p.y,ok:true,success:false})

        // after new position has been calculated check if position lays on
        // obstacle position, if true, the method will return false denoting
        // no line of sight
        if(this.isObstacle(p)){
          returnPath[returnPath.length-1].ok = false;
          success = false;
        }

      }


      // return true as no obstacle has been found yet or false for
      // the opposite, for debugging purposes, the algorithm is allowed to continue
      // till it reaches the end point to build a full render

      if(success){
        returnPath[0].success = true;
        return returnPath
      } else {
        // if another search has passed this test,
        // then nullifying that success would be an error
        if(returnPath[0].success !== true)
          returnPath[0].success = false;
        return returnPath
      }

  }

  // UPDATE AND DRAW METHODS

  update(){

    this.lineofsight = []

    // this.rebuildMesh();

    // checking input for render options
    if(input.isDown("G")) this.toggleDrawDebugGrid();

  }

  toggleDrawDebugGrid(){
    this.drawDebugGrid ^= true;
  }

  draw(camera){

    this.drawGrid(camera);
    // this.drawSearchGrid(camera);

  }

  drawSearchGrid(camera){

    if(!this.drawDebugGrid) return;

    for(var x = 0 ; x < this.pathMeshInverted.length ; x++){
      for(var y = 0 ; y < this.pathMeshInverted[x].length ; y++){
        // calculated offset position taking camera offset into consideration
        let offsetPos = new SAT.Vector(-camera.x + (x*this.gridSize),-camera.y + (y*this.gridSize));

        // ignore drawing any squares that fall off screen
        if((offsetPos.x < 0 || offsetPos.x > CW) || (offsetPos.y < 0 || offsetPos.y > CH)){
          continue;
        }

        if(this.pathMeshInverted[x][y] === 0){
          Draw.stroke(0.5,"#FF0000");
        } else {
          Draw.stroke(0.5,"#000000");
        }
        Draw.rectOutline(offsetPos.x,offsetPos.y,this.gridSize,this.gridSize);

        Draw.fillCol(new Colour(0))
        Draw.text(9,"mono","right",new SAT.Vector(offsetPos.x+(this.gridSize/2),offsetPos.y+(this.gridSize/2)),x);
        Draw.text(9,"mono","right",new SAT.Vector(offsetPos.x+(this.gridSize/2),offsetPos.y+(this.gridSize/2)+9),y);


      }
    }

  }

  drawGrid(camera){


    if(!this.drawDebugGrid) return;

    for(var y = 0 ; y < this.pathMesh.length ; y++){
      for(var x = 0 ; x < this.pathMesh[y].length ; x++){
        // calculated offset position taking camera offset into consideration
        let offsetPos = new SAT.Vector(-camera.x + (x*this.gridSize),-camera.y + (y*this.gridSize));

        // ignore drawing any squares that fall off screen
        if((offsetPos.x < 0 || offsetPos.x > CW-this.gridSize) || (offsetPos.y < 0 || offsetPos.y > CH-this.gridSize) || this.pathMesh[y][x] === this.EMPTY){
          continue;
        }

        if(this.pathMesh[y][x] === 0)

        Draw.fillCol(new Colour(200,Utility.Map(this.pathMesh[y][x],0,200,0,255),0,0.5));

        Draw.rect(offsetPos.x,offsetPos.y,this.gridSize,this.gridSize);
        Draw.fillCol(new Colour(0))

        // Draw.text(9,"mono","right",new SAT.Vector(offsetPos.x+(this.gridSize/2),offsetPos.y+(this.gridSize/2)),x);
        // Draw.text(9,"mono","right",new SAT.Vector(offsetPos.x+(this.gridSize/2),offsetPos.y+(this.gridSize/2)+9),y);

      }
    }

  }

}
