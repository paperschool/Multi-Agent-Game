
function windowResized(){
  resizeCanvas(innerWidth,innerHeight);
}

let zigzagup = null;
let zigzagdown = null;
let zigzagleft = null;
let zigzagright = null;

let origin = null;

function setup(){

  can = createCanvas(innerWidth,innerHeight);

  can.parent("editor_canvas")

  origin = createVector(0,0);

  zigzagleft = new ZigZag(width/2,height/2,0);
  zigzagright = new ZigZag(width/2,height/2,1);
  zigzagup = new ZigZag(width/2,height/2,2);
  zigzagdown = new ZigZag(width/2,height/2,3);

}

function draw(){

  noStroke();

  background(51);

  zigzagup.update();
  zigzagup.draw();

  zigzagdown.update();
  zigzagdown.draw();

  zigzagleft.update();
  zigzagleft.draw();

  zigzagright.update();
  zigzagright.draw();

  updateOrigin();

}

function updateOrigin(){

  origin.x = width/2;
  origin.y = height/2;

  let length = width*height;

  strokeWeight(5);
  stroke(255);

  line(origin.x,origin.y,
    origin.x + Math.cos(Math.PI/4) * length,
    origin.y + Math.sin(Math.PI/4) * length
  )

  line(origin.x,origin.y,
    origin.x + Math.cos(3*Math.PI/4) * length,
    origin.y + Math.sin(3*Math.PI/4) * length
  )

  line(origin.x,origin.y,
    origin.x + Math.cos(5*Math.PI/4) * length,
    origin.y + Math.sin(5*Math.PI/4) * length
  )

  line(origin.x,origin.y,
    origin.x + Math.cos(7*Math.PI/4) * length,
    origin.y + Math.sin(7*Math.PI/4) * length
  )

  noStroke();

  fill(255);
  ellipse(this.origin.x,this.origin.y,20);


}

class ZigZag {

  constructor(x,y,d){

    this.line = [];

    this.unit = 5;

    this.range = 100;

    this.direction = d; // 0 -> left, 1 -> right, 2 -> up, 3 -> down

    //////////////

    this.nextDown = false;


  }

  nextLine(increase = false){

    this.line = [];

    let start = origin.copy();

    let birth = this.unit;

    let step = 0;

    for(; step < this.range ; step++){

      if(this.direction === 0 || this.direction === 1){

        start.y = origin.y + (birth*(increase ? step : 1)*(step % 2 ? (this.direction === 0 ? -1 : 1) : (this.direction === 0 ? 1 : -1)));
        this.line.push(createVector(start.x,start.y));

        start.x += this.direction === 0 ? -birth : birth;
        this.line.push(createVector(start.x,start.y));

      } else if(this.direction === 2 || this.direction === 3){

        start.x = origin.x + (birth*(increase ? step : 1)*(step % 2 ? (this.direction === 2 ? 1 : -1) : (this.direction === 2 ? -1 : 1)));
        this.line.push(createVector(start.x,start.y));

        start.y += this.direction === 2 ? -birth : birth;
        this.line.push(createVector(start.x,start.y));

      }

    }

  }

  update(){

    this.unit = map(mouseX,0,width,10,100);
    this.nextLine(true);

    if (keyCode === ENTER  && !this.nextDown) {
      this.nextDown = true;
      this.nextLine();
    }

    if(keyCode !== ENTER && this.nextDown) {
      this.nextDown = false;
    }

  }

  draw(){

    strokeWeight(2);

    switch (this.direction) {
      case 0: stroke(255,0,0); break;
      case 1: stroke(0,255,0); break;
      case 2: stroke(0,0,255); break;
      case 3: stroke(255,255,0); break;
      default:

    }

    if(this.line.length > 0){
      line(
        origin.x,
        origin.y,
        this.line[0].x,
        this.line[0].y
      )

      for(let i = 1 ; i < this.line.length ; i++){

        line(
          this.line[i-1].x,
          this.line[i-1].y,
          this.line[i].x,
          this.line[i].y
        );
      }
    }


  }

}
