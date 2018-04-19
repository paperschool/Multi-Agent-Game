
var grid;

var start,end;

var raycast;

function setup(){

  createCanvas(innerWidth, innerHeight);

  angleMode(DEGREES)

  frameRate(1)

  grid = new Grid(20,20);

  start = new Cell(floor(random(0,grid.gridSize.x)),floor(random(0,grid.gridSize.y)),grid.size.x,grid.size.y,3);

  end   = new Cell(floor(random(0,grid.gridSize.x)),floor(random(0,grid.gridSize.y)),grid.size.x,grid.size.y,4);

  raycast = new Ray(start,end);

}

function draw(){

  noStroke();

  background(51,51,51,150)

  grid.draw();

  raycast.draw();

  start.draw();

  end.draw();

  strokeWeight(4);
  stroke(255, 204, 0);

  line(
    start.getCenter().x,
    start.getCenter().y,
      end.getCenter().x,
      end.getCenter().y
  )
  noStroke();

  start = new Cell(floor(random(0,grid.gridSize.x)),floor(random(0,grid.gridSize.y)),grid.size.x,grid.size.y,3);

  end   = new Cell(floor(random(0,grid.gridSize.x)),floor(random(0,grid.gridSize.y)),grid.size.x,grid.size.y,4);

  raycast = new Ray(start,end);

}

// bad name but kinda accurate
class Ray {

  constructor(start,end){
    this.start = start;
    this.end   = end;
    this.path = [];
  }

  bresenham(){

    console.log("Calculating Path: ")

    let c = 100;

    this.path = [];

    // Start coord
    let x0 = this.start.pos.x;
    let y0 = this.start.pos.y;

    // End coord
    let x1 = this.end.pos.x;
    let y1 = this.end.pos.y;

    // Delta values (Length of x and y)
    let dx = Math.abs(x0 - x1);
    let dy = Math.abs(y0 - y1);

    // Whether the x and y axis go in the positive or negative direction
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;

    // Positive - the x axis rises faster than the height
    // Negative - the y axis rises faster that the length
    let err = dx-dy

    // While not at the final point
    while(!((x0===x1) && (y0===y1))) {
      // Paint cell at current position
      this.path.push(new Cell(x0, y0,grid.size.x,grid.size.y, 2));

      // Does something probably
      let e2 = 1 * err;
      console.log("e2: " + e2);

      if(e2 > -dy) {
        err -= dy;
        x0 += sx;
      }

      if(e2 <  dx) {
        err += dx;
        y0 += sy;
      }
    }

    console.log("Calculated Path: ")

  }

  // A evolved version of bresenham's line cover algorithm to also add squares
  // that might have been overlooked, code taken from:
  // https://www.redblobgames.com/grids/line-drawing.html
  // the algorithm has been modified to detect obstacle potential
  supercover_line(p0, p1) {

      this.path = [];

      let dx = p1.x-p0.x
      let dy = p1.y-p0.y;

      let nx = Math.abs(dx)
      let ny = Math.abs(dy);

      let sign_x = (dx > 0 ? 1 : -1)
      let sign_y = (dy > 0 ? 1 : -1)

      let p = {x:p0.x,y:p0.y};

      this.path.push(new Cell(p.x, p.y, 2));

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
          this.path.push(new Cell(p.x, p.y,grid.size.x,grid.size.y, 2));
        }

  }


  draw(){

    // this.bresenham();

    this.supercover_line(this.start.pos,this.end.pos);

    for(var cell = 0 ; cell < this.path.length ; cell++){
      let x = this.path[cell].pos.x
      let y = this.path[cell].pos.y

      this.path[cell].draw();

      if(grid.grid[y][x].state === 0){
          fill(255,100,100);
          ellipse(this.path[cell].getCenter().x,this.path[cell].getCenter().y,this.path[cell].size.x,this.path[cell].size.y);
      }

    }
  }

}

class Grid {

  constructor(w,h){

    this.size = createVector(w,h)

    this.gridSize = createVector(
      Math.round(width / (this.size.x)),
      Math.round(height / (this.size.y))
    );

    this.gridSize.x -= 1;
    this.gridSize.y -= 1;

    this.grid = [];

    // building grid
    for(var y  = 0 ; y < this.gridSize.y ; y++){
      let row = [];
      for(var x  = 0 ; x < this.gridSize.x ; x++){
        row.push(new Cell(x,y,this.size.x,this.size.y,random(0,10) <= 1 ? 0 : 1));
      }
      this.grid.push(row);
    }

  }

  isObstacle(x,y){
    return (this.grid[y][x].state)
  }

  draw(){
    for(var y  = 0 ; y < this.grid.length ; y++)
      for(var x  = 0 ; x < this.grid[y].length ; x++)
        this.grid[y][x].draw();


  }


}

class Cell {

  constructor(x,y,w,h,obstacle){

    this.pos = createVector(x,y);

    this.state = obstacle;

    this.size = createVector(w,h);
  }

  getCenter(){
    return new p5.Vector(
      this.pos.x + (this.pos.x*this.size.x) + (this.size.x/2),
      this.pos.y + (this.pos.y*this.size.y) + (this.size.y/2),
    )
  }

  draw(col = null){


    if(col === null){
      switch (this.state) {
        case 0:  fill(101);         break;
        case 1:  fill(220);         break;
        case 2:  fill(150,150,250); break;
        case 3:  fill(150,250,150); break;
        case 4:  fill(250,150,150); break;
        default: fill(101);
      }
    } else {
      fill(col.r,col.g,col.b,col.a)
    }


    rect(this.pos.x + (this.pos.x*this.size.x),this.pos.y + (this.pos.y*this.size.y),this.size.x,this.size.y)

  }

}
