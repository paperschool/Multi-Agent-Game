
class Grid {

  constructor(x,y,gs){

    this.levelSize = new SAT.Vector(x/gs,y/gs);

    this.gridSize = gs;

    ////////////////////////

    this.pathMesh = []

    for(var y = 0 ; y < this.levelSize.y ; y++){
      let row = [];
      for(var x = 0 ; x < this.levelSize.x ; x++){
        row.push(1);
      }
      this.pathMesh.push(row);
    }

    this.graph = new Graph(this.pathMesh,{ diagonal: true });

    this.result = [];

  }

  rebuildMesh(){
    this.graph = new Graph(this.pathMesh,{ diagonal: true });
  }

  // this method will parse a non-grid normalised vector to a grid-normalised vector by rounding to a grid unit then dividing to that grid unit
  getGridVector(pos){
    return new SAT.Vector(Utility.roundTo(pos.x,this.gridSize)/this.gridSize,Utility.roundTo(pos.y,this.gridSize)/this.gridSize);
  }

  checkGraphBound(bound){
    if(typeof this.graph.grid[bound.y] !== 'undefined'){
      if(typeof this.graph.grid[bound.y][bound.x] !== 'undefined'){
        return true;
      }
    }
    return false;
  }

  addObstacle(position){
    if(this.checkGraphBound(position)){
      this.graph.grid[position.y][position.x].closed = true;
      this.pathMesh[position.y][position.x] = 1;
     }
  }

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

  getPath(){
    return this.result;
  }

  draw(camera){

      for(var y = 0 ; y < this.graph.grid.length ; y++){
        for(var x = 0 ; x < this.graph.grid[y].length ; x++){

          let offsetPos = new SAT.Vector(-camera.x + (x*this.gridSize),-camera.y + (y*this.gridSize));

          // ignore drawing any squares that fall off screen
          if((offsetPos.x < 0 || offsetPos.x > CW) || (offsetPos.y < 0 || offsetPos.y > CH)){
            continue;
          }

          if(this.graph.grid[x][y].closed){
            Draw.stroke(1,"#000000");
          } else {
            Draw.stroke(1,"#FF0000");
          }
          if(this.graph.grid[x][y].visted){
            Draw.stroke(1,"#0000FF");
          }
          Draw.rectOutline(offsetPos.x,offsetPos.y,this.gridSize,this.gridSize);
        }

    }
  }

}
