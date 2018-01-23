
var g = null;

var gx = 20;
var gy = 20;

var tool = null;

var toolh = 200;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  recalcBounds();

}

function recalcBounds(){

}

function setup(){

  createCanvas(innerWidth,innerHeight);

  g = new Grid(gx,gy);


}

function draw(){

  background(51);

  noStroke();

  g.update();


}

class Grid {

  constructor(x,y){

    this.grid = [];

    this.size = createVector(x,y);

    this.gridSize = 40;

    this.setup();

  }

  setup(){

    for(var y = 0 ; y < this.size.y ; y++){

      var row = [];

      for(var x = 0 ; x < this.size.x ; x++){

        row.push(new Cell(x*this.gridSize,y*this.gridSize,this.gridSize));

      }

      this.grid.push(row);
    }

  }

  update(){

    for(var y = 0 ; y < this.size.y ; y++){
      for(var x = 0 ; x < this.size.x ; x++){
        this.grid[y][x].update();
        this.grid[y][x].draw();
      }
    }

  }

  // draw(){
  //   for(var y = 0 ; y < this.size.y ; y++){
  //     for(var x = 0 ; x < this.size.x ; x++){{
  //       this.grid[y][x].update();
  //       this.grid[y][x].draw();
  //     }
  //   }
  // }

}


class Cell extends Rectangle {

  constructor(x,y,s){

    super(x,y,s,s)

    this.getColour().random()

  }

  update(){

    super.update();

  }

  draw(){
    super.draw();
  }

}
