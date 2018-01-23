// object that stores game
var game = null;

// global mouse position object
var input = null

// canvas size and width
var CW = 0,CH = 0;

// diagnostic output text
var diagnostic = null

var chart = null;

document.addEventListener('DOMContentLoaded', (function(){

  // settting canvas dimensions based on DOM inner width/height
  CW = window.innerWidth;
  CH = window.innerHeight;

  // setup diagnostic input
  diagnostic = new DiagnosticHUD(0,0);

  chart = new Chart(50,400,200,0,60);

  // Input Object instantiation
  input = new Input();

  // create mouse position vector
  mousePos = new SAT.Vector(0,0);

  // instantiating game object
  game = new Game();

}), false);

class Game {

  constructor(){

    // define canvas
  	this.canvas = document.getElementById("game_canvas");

  	// define canvas context
  	this.ctx = this.canvas.getContext("2d");

    // setting canvas context height and width for rendering
    this.ctx.canvas.width = CW;
    this.ctx.canvas.height = CH;

    // Various state index
    this.START_STATE    = 0;
    this.PLAY_STATE     = 1;
    this.GAMEOVER_STATE = 2;
    this.VICTORY_STATE  = 3;

    // variable to store
    this.CURRENT_STATE = this.PLAY_STATE;

    // state object array
    this.states = [
      new StartState(this),
      new PlayState(this),
      new GameOverState(this),
      new VictoryState(this)
    ];

    // Begin game loop with loop object instantiation
    this.gameLoop = new GameLoop(120.0,60.0,this.update.bind(this),this.draw.bind(this));


  }

  setState(state){
    this.CURRENT_STATE = state;
  }

  update(deltaTime){
    this.states[this.CURRENT_STATE].update(deltaTime/15);
  }

  draw(deltaTime){
    this.states[this.CURRENT_STATE].draw();
    chart.draw();
    diagnostic.draw();
  }

  end(){

  }

  // method that runs everytime game loop returns tick
  tick(deltaTime,shouldDraw){

  }
}

class GameLoop {


  constructor(sps,fps,updateCallback,drawCallback){

      console.log(" > GAME LOOP Started. ");

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

      // if(this.totalTick % 120 === 0)
      //   console.log("FRAME: " + this.deltaTime);

      // setting previous tick to the current tick time
      diagnostic.updateLine("------- SPS",Math.floor(1000.0 / this.sps));
      diagnostic.updateLine("Current SPS",Math.floor(1000.0 / this.deltaTime));
      diagnostic.updateLine("Total Frame",this.totalTick);

      // running callback with delta time
      //   calling return call back with new delta time
        // if(typeof this.callBack == "function") {}

      this.updateCallback(this.deltaTime);

      if(this.deltaTime > this.fps){

        this.drawCallback();

        chart.addSample(1000.0 / this.deltaTime)

        diagnostic.updateLine("------- FPS",Math.floor(1000.0 / this.fps));
        diagnostic.updateLine("Current FPS",Math.floor(1000.0 / this.deltaTime));
      }


    }

  }

  getNow(){
    return window.performance.now();
  }


}
