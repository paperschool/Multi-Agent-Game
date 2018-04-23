
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

    this.ready = false;

    this.colour = new PulseColour(new Colour().random());

    this.ParticleSystem = new ParticleSystem();

    this.titleOffset = 0;

    this.secondaryOffset = 0;

  }

  setup(){
    sound.play(SoundLabel.START_STATE_MUSIC);
  }

  setReady(){
    this.ready = true;
  }

  update(deltaTime){

    this.colour.step();

    this.colour.getColour().a = 0.8;

    this.titleOffset = this.titleOffset < 360 ? this.titleOffset+4 : 0;

    if(Utility.Random(0,100) < 5){
      this.ParticleSystem.addParticle(
        Utility.Random(100,CW-100),
        Utility.Random(100,CH-100),
        Utility.Random(10,100),
        ParticleType.FIREWORK
      )
    }

    this.ParticleSystem.update(deltaTime);

    this.secondaryOffset += 1;
  }

  draw(){

    Draw.fillCol(this.colour.getColour());

    Draw.rect(0,0,CW,CH);

    this.ParticleSystem.draw({x:0,y:0});

    Draw.gameText(
      'Sillicon',80,50,0,-4,4,50,false,false,this.titleOffset,
      0.3,0.3,0.3,0,0,0,127,127,'wdata'
    );

    Draw.gameText('Hotline Valley',100,100,0,-1,4,50,false,false,this.titleOffset);

    if(this.ready)
      Draw.gameText('PRESS SPACE TO START',40,100,0,2.5,4,50,true,false,this.titleOffset);




  }


}

class PlayState extends State{

  constructor(level,changeState,reloadLevel,nextLevel) {

    super(level,changeState);

    this.reloadLevel = reloadLevel;

    this.nextLevel = nextLevel;

    this.colour = new PulseColour(new Colour().random());

  }

  setup(){
    this.level.levelStart();
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

    this.titleOffset = 0;

  }

  setup(){}

  update(deltaTime){
    this.titleOffset = this.titleOffset < 360 ? this.titleOffset+4 : 0;
  }

  draw(){

    Draw.fill(51,51,51,0.5);
    Draw.fill(51,51,51,0.5);
    Draw.rect(0,0,CW,CH);

    Draw.gameText(
      'GAMEOVER',100,80,0,-2,4,50,false,false,this.titleOffset,
      0.3,0.3,0.3,0,1,2,200,55
    );

    Draw.gameText(
      'PRESS R TO CONTINUE',40,80,0,2.5,4,50,true,false,this.titleOffset,
      0.3,0.3,0.3,0,1,2,200,55
    );

  }

}

class VictoryState extends State {

  constructor(level,changeState){
    super(level,changeState);

    this.ParticleSystem = new ParticleSystem();

    this.titleOffset = 0;

    this.redirectAttempted = false;

  }

  setup(){
    sound.stopAll();
    sound.play(SoundLabel.VICTORY_STATE_MUSIC);

    this.timer = new LevelTimer(2000,-1,false,new SAT.Vector(100,100));
  }

  update(deltaTime){

    // stuff for testing survey redirect
    this.timer.update(deltaTime);

    if(this.timer.isEnded() && !this.redirectAttempted) {
      this.redirectAttempted = true;
      window.location.href = ("https://www.dominicjomaa.com/Dissertation/index.php");
    }

    this.titleOffset = this.titleOffset < 360 ? this.titleOffset-4 : 0;

    if(Utility.Random(0,100) < 5){
      this.ParticleSystem.addParticle(
        Utility.Random(100,CW-100),
        Utility.Random(100,CH-100),
        Utility.Random(10,100),
        ParticleType.FIREWORK
      )
    }

    this.ParticleSystem.update(deltaTime);

  }

  draw(){

    Draw.fill(51,51,51,0.5);
    Draw.rect(0,0,CW,CH);

    this.ParticleSystem.draw({x:0,y:0});

    Draw.gameText(
      'YOU DID IT!',100,80,0,-2,4,100,false,false,this.titleOffset,
      0.3,0.3,0.3,4,2,0,100,155
    );

    Draw.gameText(
      'THANKS FOR PLAYING!',50,80,0,0,4,100,false,false,this.titleOffset,
      0.3,0.3,0.3,4,2,0,100,155
    );

    // hidden for survey jump
    // Draw.gameText(
    //   'PRESS SPACE TO RESTART',40,80,0,2.5,4,100,true,false,this.titleOffset,
    //   0.3,0.3,0.3,4,2,0,100,155
    // );

  }

}

class PauseState extends State {

  constructor(level,changeState){
    super(level,changeState);

  }

  update(deltaTime){}

  draw(){

    Draw.gameText(
      'PAUSED',100,80,0,-2,4,50,false,false,this.titleOffset,
      0.3,0.3,0.3,1,2,4,127,127
    );

    Draw.gameText(
      'PRESS P / ESC TO CONTINUE',40,80,0,2,4,50,true,false,this.titleOffset,
      0.3,0.3,0.3,1,2,4,127,127
    );


  }

}

class LevelSwitchState extends State {

  constructor(level,changeState){

    super(level,changeState);

    this.setup();

  }

  setup(){

    this.timer = new LevelTimer(2000,-1,false,new SAT.Vector(100,100));

    this.hud = new HUD(null,this.timer);

  }

  update(deltaTime){

    this.timer.update(deltaTime);

    if(this.timer.isEnded()) this.changeState(GameState.PLAY_STATE);

  }

  draw(){


    Draw.fill(255,255,255,0.2*Math.log(1-this.timer.getPercentageComplete())+1);
    Draw.rect(0,0,CW,CH);

    this.hud.draw();

  }

}
