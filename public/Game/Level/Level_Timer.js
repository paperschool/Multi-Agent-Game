class LevelTimer {

  constructor(duration,direction = -1,size){

    this.direction = direction;

    // time timer should tick for
    this.duration = duration;

    // time timer was created at
    this.startTime = Date.now();

    // time timer should end (DEPRECIATED)
    this.endTime = Date.now() + duration;

    // time string for rendering time
    this.timeString = "00:00:00:0000";

    this.timeHour = "00";
    this.timeMinute = "00";
    this.timeSecond = "00";
    this.timeMillis = "0000";

    // time string for time out rendering
    this.defaultString = "00:00:00:0000";

    // time accumulated during a pause state
    this.pauseTime = -1;

    // boolean to track if game paused or not
    this.paused = false;

    // size of timer?
    this.size = new SAT.Vector(size.x,size.y);

    // position
    // this.pos = new SAT.Vector(x,y);

  }

  pauseTimer(){
    this.pauseTime = Date.now();
    this.paused = true;
  }

  unpauseTimer(){
    this.duration = this.duration + (Date.now() - this.pauseTime);
    this.pauseTime = 0;
    this.paused = false;
  }

  update(deltaTime){

    if(!this.paused){
      this.getFormatTime();
    }


  }

  draw(camera){

    // Draw.fill(0,0,0,(this.isEnded() ? 0.0 : 0.9));
    Draw.fillHex(gameTheme['TIMER']);

    // if(this.isEnded() && !this.paused){
    //   Draw.text(150,"wdata","center",new SAT.Vector((this.size.x/2)-camera.x,(this.size.y/2)-camera.y),this.defaultString);
    // } else {
    //   Draw.text(150,"wdata","center",new SAT.Vector((this.size.x/2)-camera.x,(this.size.y/2)-camera.y),this.timeString);
    // }

    // if(this.isEnded() && !this.paused){
    //   Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-camera.x,(this.size.y/2)-camera.y),'00');
    //   Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-camera.x + 140,(this.size.y/2)-camera.y),'00');
    //   Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-camera.x + 280,(this.size.y/2)-camera.y),'00');
    // } else {
    //   Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-camera.x,(this.size.y/2)-camera.y),this.timeMinute);
    //   Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-camera.x + 220,(this.size.y/2)-camera.y),this.timeSecond);
    //   Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-camera.x + 440,(this.size.y/2)-camera.y),this.timeMillis);
    // }

    if(this.isEnded() && !this.paused){
      Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2),(this.size.y/2)-camera.y),'00');
      Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2) + 220,150),'00');
      Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2) + 440,150),'00');
    } else {

      Draw.fill(51,51,51);

      Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-330 + 10,160),this.timeMinute);
      Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-330 + 230,160),this.timeSecond);
      Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-330 + 450,160),this.timeMillis);

      Draw.fillHex(gameTheme['TIMER']);

      Draw.fill(255,255,255);

      Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-330 + 0,150),this.timeMinute);
      Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-330 + 220,150),this.timeSecond);
      Draw.text(150,"wdata","left",new SAT.Vector((this.size.x/2)-330 + 440,150),this.timeMillis);

    }


  }

  getPercentageComplete(){
    return (1.0 / this.duration) * (this.endTime - Date.now());
  }

  getFormatTime(){

    let time = new Date(this.startTime - Date.now() + this.duration);

    // hour = (hour > 9 ? hour : "0" + hour);
    this.timeMinute = (time.getMinutes()  > 9 ? time.getMinutes() : "0" + time.getMinutes());
    this.timeSecond = (time.getSeconds()  > 9 ? time.getSeconds() : "0" + time.getSeconds());
    this.timeMillis = (time.getMilliseconds() > 99 ? "0" + time.getMilliseconds() : time.getMilliseconds() > 9 ? "00" + time.getMilliseconds() : "000" + time.getMilliseconds());

    // this.timeString = hour + ":" + min + ":" + sec;
    this.timeString =  this.timeMinute + ":" + this.timeSecond + ":" + this.timeMillis;

    return this.timeString;

  }

  // this multiplies by direction to ensure that the >= will
  // always hold.
  isEnded(){
    // return Date.now() >= this.endTime + this.pauseTime;
    return Date.now() - this.startTime >= this.duration;
  }

}
