
class Grid {

  constructor(x,y,gs){

    this.levelSize = new SAT.Vector(x,y);

    this.offset = new SAT.Vector(0,0);

    this.drawGrid = true;
    this.drawPath = true;

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

    // resetting path
    this.pathMesh = [];

    this.result = [];

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
    if(this.checkGraphBound(position)) this.graph.grid[position.y][position.x].closed = true;

  }

  setOffset(offset){
    this.offset.set(offset.x,offset.y);
  }

  search(start,end){

    if(!this.checkGraphBound(start)) return;

    if(!this.checkGraphBound(end)) return;


    this.start  = this.graph.grid[start.x][start.y];
    this.end    = this.graph.grid[end.x][end.y];
    this.result = astar.search(this.graph, this.start, this.end, { heuristic: astar.heuristics.diagonal });

  }

  getPath(){
    return this.result;
  }

  draw(){

    if(this.drawGrid) {
      for(var y = 0 ; y < this.graph.grid.length ; y++){
        for(var x = 0 ; x < this.graph.grid[y].length ; x++){
          if(this.graph.grid[x][y].closed){
            Draw.stroke(1,"#000000");
          } else {
            Draw.stroke(1,"#FF0000");
          }
          if(this.graph.grid[x][y].visted){
            Draw.stroke(1,"#0000FF");
          }
          Draw.rectOutline(this.offset.x + (x*this.gridSize),this.offset.y + (y*this.gridSize),this.gridSize,this.gridSize);
        }
      }
    }

    if(this.drawPath){
      for(var node = 0 ; node < this.result.length ; node++){
        Draw.fill(51,51,51);
        Draw.rect(this.offset.x + (this.result[node].x*this.gridSize),this.offset.y + (this.result[node].y*this.gridSize),this.gridSize,this.gridSize)
      }
    }


  }

}
