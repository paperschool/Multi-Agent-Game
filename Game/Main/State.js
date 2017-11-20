

class StartState {

  constructor(game){

    //
    this.game = game;

    // input class with input events and tailored callback info
    // this.input = new Input(this.keyEvent.bind(this),this.keyEvent.bind(this),this.keyEvent.bind(this));

  }

  tick(deltaTime,shouldDraw){

    if(input.isDown("SPACE")) this.game.setState(1);

    Draw.fill(51,51,51,0.05);
    Draw.rect(0,0,CW,CH);

    for(var i = 0 ; i < Math.floor(Utility.Random(30,70)) ; i++){
      switch(Math.floor(Utility.Random(0,4))){
        case 0: Draw.line(0,Utility.Random(0,CH),input.mouse.x,input.mouse.y,Utility.Random(0.5,3),"#4274f4"); break;
        case 1: Draw.line(Utility.Random(0,CW),0,input.mouse.x,input.mouse.y,Utility.Random(0.5,3),"#6541f4"); break;
        case 2: Draw.line(CW,Utility.Random(0,CH),input.mouse.x,input.mouse.y,Utility.Random(0.5,3),"#6541f4"); break;
        case 3: Draw.line(Utility.Random(0,CW),CH,input.mouse.x,input.mouse.y,Utility.Random(0.5,3),"#f441cd"); break;
      }
    }

    if(Utility.Random(0,1) < 0.5){
      Draw.fill(255,255,255);
      Draw.text(50,"pixelated","center",new SAT.Vector(CW/2,200),"PRESS SPACE TO START");
    } else {
      Draw.fill(240,240,240);
      Draw.text(50,"pixelated","center",new SAT.Vector(Utility.Random(-10,10)+(CW/2),Utility.Random(-10,10)+200),"PRESS SPACE TO START");
    }

  }

}

class PlayState {

  constructor(){

    // defining world object
    this.world = new World(5000,5000);

  }

  tick(deltaTime,shouldDraw){

    // updating and updating world
    this.world.update(deltaTime);

    if(shouldDraw)
      this.world.draw();

  }

}

class PauseState {

  constructor(){

  }

  tick(deltaTime){
    // updating and updating world
    this.world.update(deltaTime);
    this.world.draw();
  }

  update(){

  }

  draw(){

  }

}

class GameOverState {

  constructor(){
  }

  tick(deltaTime){
  }

}

class VictoryState {

  constructor(){
  }

  tick(deltaTime){
  }

}
