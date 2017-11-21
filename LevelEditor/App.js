
// object that stores game
var game = null;

// global mouse position object
var input = null

// canvas size and width
var CW = 0,CH = 0;


document.addEventListener('DOMContentLoaded', (function(){

  // settting canvas dimensions based on DOM inner width/height
  CW = window.innerWidth;
  CH = window.innerHeight;

  // Input Object instantiation
  input = new Input();

  // instantiating game object
  game = new Main();

}), false);

class Main {

  constructor(){

    // define canvas
  	this.canvas = document.getElementById("game_canvas");

  	// define canvas context
  	this.ctx = this.canvas.getContext("2d");

    // setting canvas context height and width for rendering
    this.ctx.canvas.width = CW;
    this.ctx.canvas.height = CH;

    // Begin game loop with loop object instantiation
    this.gameLoop = new MainLoop(120.0,60.0,this.update.bind(this),this.draw.bind(this));

    // this.gameLoop = MainLoop.setUpdate(this.update.bind(this)).setDraw(this.draw.bind(this)).setEnd(this.end.bind(this)).start();
    this.world = new World();

  }

  update(deltaTime){
    this.world.update(deltaTime);
  }

  draw(deltaTime){
    this.world.draw();
  }

  end(){

  }


  // method that runs everytime game loop returns tick
  tick(deltaTime,shouldDraw){

  }
}

class MainLoop {


  constructor(sps,fps,updateCallback,drawCallback){

      // this value represents the number of phsical updates per second
      this.sps = 1000.0 / sps;

      // fps as a value over 1 second ( 1000 miliseconds / '30' fps ) = 33.3 ms before next tick
      this.fps = 1000.0 / fps;

      // variable to store time of current tick
      this.now;

      // variable to store time of last tick
      this.lastTime = Date.now();

      // call back to run on tick fire
      this.updateCallback = updateCallback;
      this.drawCallback = drawCallback;

      // tick total
      this.totalTick = 0;

      this.totalFrames = 0;

      this.deltaTime = 0;

      this.ticking = true;

      this.tick();


  }

  // recursive tick call back
  tick(){

    // requesting next frame
    window.requestAnimationFrame(this.tick.bind(this));

    this.totalTick++;

    // getting current time
    this.now = Date.now();

    // setting delta as current time minus previous time in seconds
    this.deltaTime = this.now - this.lastTime;

    // checking if delta time is greater then fps requirement
    if(this.deltaTime > this.sps){

      this.lastTime = this.now - (this.deltaTime % this.sps);

      this.updateCallback(this.deltaTime);

      if(this.deltaTime > this.fps){
        this.drawCallback();
      }


    }

  }

  getNow(){
    return window.performance.now();
  }

}

class LEV {

  constructor(x = 0,y = 0,z = 0){

    this.x = x;
    this.y = y;
    this.z = z;

  }

  set(other){
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
  }

  mul(other){
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
  }

  div(other){
    this.x /= other.x;
    this.y /= other.y;
    this.z /= other.z;
  }

  add(other){
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }

  sub(other){
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
  }

}
