
class State {

  constructor(level,changeState){
    this.level = level;

    this.changeState = changeState;

  }

  setLevel(level){
    this.level = level;
  }

  setup(){}

}


class StartState extends State{

  constructor(level,changeState){

    super(level,changeState);

    this.colour = new PulseColour(new Colour().random());

  }

  update(deltaTime){

    // change this to be for something else
    if(input.isDown("SPACE")) this.changeState(GameState.LEVEL_SWITCH_STATE);

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

  constructor(level,changeState,reloadLevel,nextLevel) {

    super(level,changeState);

    this.reloadLevel = reloadLevel;

    this.nextLevel = nextLevel;

    this.colour = new PulseColour(new Colour().random());

  }

  update(deltaTime){

    if(input.isDown("PAUSE")) this.changeState(GameState.PAUSE_STATE);

    this.colour.step();

    this.level.update(deltaTime);

    if(this.level.getLevelState() === LevelState.PLAYER_DEAD ||
       this.level.getLevelState() === LevelState.TIMEOUT ){
       this.changeState(GameState.GAMEOVER_STATE);
      // this.reloadLevel();
    }

    if(this.level.getLevelState() === LevelState.ENEMY_DEAD){
      this.changeState(GameState.LEVEL_SWITCH_STATE);
      // this.nextLevel();
    }

  }

  draw(){

    this.level.draw();

  }

}


class GameOverState extends State {

  constructor(level,changeState,reloadLevel,nextLevel){

    super(level,changeState);

    this.reloadLevel = reloadLevel;

    this.nextLevel = nextLevel;

    this.setup();

  }

  setup(){

    this.timer = new LevelTimer(1000,-1,{ x:CW, y:CH });

  }

  update(deltaTime){

    if(this.timer.isEnded()) this.changeState(GameState.PLAY_STATE);

  }

  draw(){

    Draw.fill(51,51,51,0.5);
    Draw.rect(0,0,CW,CH);

    Draw.fill(255,0,0);
    Draw.text(150,"techno-hideo","center",new SAT.Vector(Utility.Random(-4,4)+(CW/2),Utility.Random(-4,4)+CH/2),"GAMEOVER");

  }

}

class VictoryState extends State {

  constructor(level,changeState){
    super(level,changeState);
  }

  update(deltaTime){

  }

  draw(){

    Draw.fill(0,0,0);
    Draw.rect(0,0,CW,CH);

    Draw.fill(255,240,240);
    Draw.text(100,"techno-hideo","center",new SAT.Vector(Utility.Random(-10,10)+(CW/2),Utility.Random(-10,10)+CH/2),"Victory Screen !");

  }

}

class PauseState extends State {

  constructor(level,changeState){
    super(level,changeState);
  }

  update(deltaTime){

    if(input.isDown("PAUSE")) this.changeState(GameState.PLAY_STATE);

  }

  draw(){

    Draw.fill(51,51,51);
    Draw.text(100,"techno-hideo","center",new SAT.Vector(Utility.Random(-10,10)+(CW/2),Utility.Random(-10,10)+CH/2),"PAUSED");
    Draw.rect(Utility.Random(-10,10)+(CW/2) - 670,(CH/2)-100,1330,20);
    Draw.rect(Utility.Random(-10,10)+(CW/2) - 670,(CH/2)+30,1330,20);


  }

}

class LevelSwitchState extends State {

  constructor(level,changeState){

    super(level,changeState);

    this.setup();

  }

  setup(){

    this.timer = new LevelTimer(1000,-1,new SAT.Vector(100,100));

  }

  update(deltaTime){

    if(this.timer.isEnded()) this.changeState(GameState.PLAY_STATE);

  }

  draw(){


    Draw.fill(255,255,255,this.timer.getPercentageComplete());
    Draw.rect(0,0,CW,CH);

    this.timer.draw({x:-CW/2,y:-CH/2});

  }

}
