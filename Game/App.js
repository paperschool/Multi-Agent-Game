
var game = null;
var mousePos = null;

window.onload =  (function(){

  mousePos = new SAT.Vector(0,0);

  game = new Game(500,500);

});


class Game {

  constructor(canvasW,canvasH){

    // Canvas Dimensions
    this.canvasWidth = canvasW;
    this.canvasHeight = canvasH;

    // define canvas
  	this.canvas = document.getElementById("game_canvas");
  	// define canvas context
  	this.ctx = this.canvas.getContext("2d");

    // defining world object
    this.world = new World(this.canvasWidth,this.canvasHeight);

    this.gameLoop = new GameLoop(30.0,Utility.Now(),this.tick.bind(this));

  }

  tick(deltaTime){
    // console.log("Ticking: " + deltaTime*1000);


    this.world.draw();

  }
}

class GameLoop {

  constructor(fps,lastTime,callBack){

      this.fps = fps/1000;
      this.lastTime = lastTime;
      this.callBack = callBack;

      this.tick();
  }

  tick(){
    var now = Date.now();
    var deltaTime = (now - this.lastTime) / 1000.0;

    if(deltaTime >= this.fps){
      this.lastTime = now;
      if(typeof this.callBack == "function") {
        this.callBack(deltaTime);
      }
    }
    window.requestAnimationFrame(this.tick.bind(this));
  }

}
