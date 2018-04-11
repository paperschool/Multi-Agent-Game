
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

    this.titleOffset = 0;

    this.secondaryOffset = 0;

  }

  crazyText(
    text,
    sizeMax,
    repMax,
    offsetX = 0,
    offsetY = 0,
    shudder = 3,
    offsetMagnitude = 10
  ){

    // let offsetMagnitude = 10;

    for(var i = 0 ; i < repMax ; i++){

      // Draw.fillCol(Utility.Gradient(i,repMax,0.3,0.3,0.3,0,2,4,127,127));
      Draw.fillCol(Utility.Gradient(i,repMax,0.3,0.3,0.3,0,2,4,127,127));

      Draw.text(
        Utility.Map(i,0,repMax,0,sizeMax),
        "crt",
        "center",
        new SAT.Vector(
          Math.cos(Utility.Radians(i+this.titleOffset))*offsetMagnitude+Utility.Random(-shudder,shudder)-(offsetX*i)+(Utility.Map(i,0,repMax,input.mouse.x,CW/2)),
          Math.sin(Utility.Radians(i+this.titleOffset))*offsetMagnitude+Utility.Random(-shudder,shudder)+(offsetY*i)+(Utility.Map(i,0,repMax,input.mouse.y,CH/2))
        ),
        text
      );

    }

  }

  update(deltaTime){

    // change this to be for something else
    // if(input.isDown(InputKeys.SPACE)) this.changeState(GameState.LEVEL_SWITCH_STATE);

    this.colour.step();

    this.colour.getColour().a = 0.4;

    this.titleOffset = this.titleOffset < 360 ? this.titleOffset+5 : 0;

    this.secondaryOffset += 1;
  }

  draw(){

    Draw.fill(51,51,51,0.1);

    Draw.rect(0,0,CW,CH);

    // for(var l = 0 ; l < 200 ; l++){
    //   Draw.stroke(1,Utility.Gradient(l,200,0.3,0.3,0.3,0,1,1,127,127).getHex());
    //   Draw.line(Utility.Random(-CW,CW*2),Utility.Random(-CH,CH*2),Utility.Random(-CW,CW*2),Utility.Random(-CH,CH*2));
    // }

    this.crazyText('Hotline Valley',100,100,0,-2,4,50);
    this.crazyText('PRESS SPACE TO START',40,100,0,2.5,4,50);

    //
    // let shudder = 3;
    //
    // let repMax = 200;
    //
    // let offsetX = 0;
    // let offsetY = 2;
    //
    // let offsetMagnitude = 10;
    //
    // for(var i = 0 ; i < repMax ; i++){
    //
    //   // Draw.fillCol(Utility.Gradient(i,repMax,0.3,0.3,0.3,0,2,4,127,127));
    //   Draw.fillCol(Utility.Gradient(i,repMax,0.3,0.3,0.3,0,2,4,127,127));
    //
    //   Draw.text(
    //     Utility.Map(i,0,repMax,0,80),
    //     "crt",
    //     "center",
    //     new SAT.Vector(
    //       Math.cos(Utility.Radians(i+this.titleOffset))*offsetMagnitude+Utility.Random(-shudder,shudder)-(offsetX*i)+(CW/2),
    //       Math.sin(Utility.Radians(i+this.titleOffset))*offsetMagnitude+Utility.Random(-shudder,shudder)+(offsetY*i)+(CH/2)
    //     ),
    //     "PRESS SPACE TO START"
    //   );
    //
    // }

    // for(var i = 0 ; i < Utility.RandomInt(50,100) ; i++){
    //   switch(Math.floor(Utility.Random(0,4))){
    //     case 0: Draw.line(0,Utility.Random(0,CH),CW/2,(CH/2 - 20) ,Utility.Random(0.5,3),this.colour.getColour().getHex()); break;
    //     case 1: Draw.line(Utility.Random(0,CW),0,CW/2,(CH/2 - 20) ,Utility.Random(0.5,3),this.colour.getColour().getHex()); break;
    //     case 2: Draw.line(CW,Utility.Random(0,CH),CW/2,(CH/2 - 20),Utility.Random(0.5,3),this.colour.getColour().getHex()); break;
    //     case 3: Draw.line(Utility.Random(0,CW),CH,CW/2,(CH/2 - 20),Utility.Random(0.5,3),this.colour.getColour().getHex()); break;
    //   }
    // }
    //
    // if(Utility.Random(0,1) < 0.5){
    //   Draw.fill(255,255,255);
    //   Draw.text(100,"techno-hideo","center",new SAT.Vector(CW/2,CH/2),"PRESS SPACE TO START");
    //   Draw.rect((CW/2) - 670,(CH/2)-100,1330,20);
    //   Draw.rect((CW/2) - 670,(CH/2)+30,1330,20);
    // } else {

    //   Draw.rect(Utility.Random(-10,10)+(CW/2) - 670,(CH/2)-100,1330,20);
    //   Draw.rect(Utility.Random(-10,10)+(CW/2) - 670,(CH/2)+30,1330,20);
    // }
    //

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

    this.colour.step();

    this.level.update(deltaTime);

    if(this.level.getLevelState() === LevelState.PLAYER_DEAD ||
       this.level.getLevelState() === LevelState.TIMEOUT ){

       this.changeState(GameState.GAMEOVER_STATE);


       sound.play(SoundLabel.STATE_GAMEOVER_1);
       sound.play(SoundLabel.STATE_GAMEOVER_2);

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

    // this.timer = new LevelTimer(1000,-1,{ x:CW, y:CH });

    // input.setCallBack(InputKeys.REPLAY,(function(){
    //   this.changeState(GameState.PLAY_STATE);
    // }).bind(this));

  }

  update(deltaTime){

  }

  draw(){

    Draw.fill(51,51,51,0.5);
    Draw.rect(0,0,CW,CH);

    Draw.fill(255,0,0);
    Draw.text(150,"techno-hideo","center",new SAT.Vector(Utility.Random(-4,4)+(CW/2),Utility.Random(-4,4)+CH/2),"GAMEOVER");
    Draw.text(50,"techno-hideo","center",new SAT.Vector(Utility.Random(-4,4)+(CW/2),100+Utility.Random(-4,4)+CH/2),"PRESS R TO CONTINUE");

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

  update(deltaTime){}

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
