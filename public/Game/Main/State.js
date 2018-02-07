
class State {

  constructor(game){
    this.game = game;
  }

  changeState(state = GameState.START_STATE){
    this.game.setState(state);
  }

}


class StartState extends State{

  constructor(game){
    super(game);

    this.colour = new PulseColour(new Colour().random());

  }

  update(deltaTime){

    // change this to be for something else
    if(input.isDown("SPACE")) this.changeState(GameState.PLAY_STATE);

    this.colour.step();

    this.colour.getColour().a = 0.4;

  }

  draw(){

    Draw.fill(0,0,0,0.1);
    Draw.rect(0,0,CW,CH);

    for(var i = 0 ; i < Utility.RandomInt(50,100) ; i++){
      switch(Math.floor(Utility.Random(0,4))){
        case 0: Draw.line(0,Utility.Random(0,CH),CW/2,(CH/2 - 20) ,Utility.Random(0.5,3),this.colour.getColour().getHex()); break;
        case 1: Draw.line(Utility.Random(0,CW),0,CW/2,(CH/2 - 20) ,Utility.Random(0.5,3),this.colour.getColour().getHex()); break;
        case 2: Draw.line(CW,Utility.Random(0,CH),CW/2,(CH/2 - 20),Utility.Random(0.5,3),this.colour.getColour().getHex()); break;
        case 3: Draw.line(Utility.Random(0,CW),CH,CW/2,(CH/2 - 20),Utility.Random(0.5,3),this.colour.getColour().getHex()); break;
      }
    }

    if(Utility.Random(0,1) < 0.5){
      Draw.fill(255,255,255);
      Draw.text(100,"techno-hideo","center",new SAT.Vector(CW/2,CH/2),"PRESS SPACE TO START");
      Draw.rect((CW/2) - 670,(CH/2)-100,1330,20);
      Draw.rect((CW/2) - 670,(CH/2)+30,1330,20);
    } else {
      Draw.fill(240,240,240);
      Draw.text(100,"techno-hideo","center",new SAT.Vector(Utility.Random(-10,10)+(CW/2),Utility.Random(-10,10)+CH/2),"PRESS SPACE TO START");
      Draw.rect(Utility.Random(-10,10)+(CW/2) - 670,(CH/2)-100,1330,20);
      Draw.rect(Utility.Random(-10,10)+(CW/2) - 670,(CH/2)+30,1330,20);
    }
  }

}

class PlayState extends State{

  constructor(game){

    super(game);

    this.game = game;

    this.colour = new PulseColour(new Colour().random());

  }

  update(deltaTime){

    if(input.isDown("PAUSE")) this.changeState(GameState.PAUSE_STATE);

    this.colour.step();

    if(this.game.currentLevel >= 0)
      this.game.levels[this.game.currentLevel].update(deltaTime);

  }

  draw(camera){

    this.colour.getColour().a = 0.4

    Draw.fillCol(this.colour.getColour())

    Draw.rect(0,0,CW,CH);

    if(this.game.currentLevel >= 0)
      this.game.levels[this.game.currentLevel].draw(camera);

  }

}

class PauseState extends State {

  constructor(game){
    super(game);

  }

  update(deltaTime){

    if(input.isDown("PLAY")) this.changeState(GameState.PAUSE_STATE);

  }

  draw(camera){

  }

}

class GameOverState extends State {

  constructor(game){
    super(game);
  }

  tick(deltaTime){
  }

}

class VictoryState extends State {

  constructor(game){
    super(game);
  }

  tick(deltaTime){
  }

}
