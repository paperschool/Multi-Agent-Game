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

    // time string for time out rendering
    this.defaultString = "00:00:00:0000";

    // time accumulated during a pause state
    this.pauseTime = -1;

    // boolean to track if game paused or not
    this.paused = false;

    // size of timer?
    this.size = new SAT.Vector(size.x,size.y);

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

    if(this.isEnded() && !this.paused){
      Draw.text(150,"cherry","center",new SAT.Vector((this.size.x/2)-camera.x,(this.size.y/2)-camera.y),this.defaultString);
    } else {
      Draw.text(150,"cherry","center",new SAT.Vector((this.size.x/2)-camera.x,(this.size.y/2)-camera.y),this.timeString);
    }



  }

  getPercentageComplete(){
    return (1.0 / this.duration) * (this.endTime - Date.now());
  }

  getFormatTime(){

    let time = new Date(this.startTime - Date.now() + this.duration);

    // hour = (hour > 9 ? hour : "0" + hour);
    let min  = (time.getMinutes()  > 9 ? time.getMinutes() : "0" + time.getMinutes());
    let sec  = (time.getSeconds()  > 9 ? time.getSeconds() : "0" + time.getSeconds());
    let ms   = (time.getMilliseconds() > 99 ? "0" + time.getMilliseconds() : time.getMilliseconds() > 9 ? "00" + time.getMilliseconds() : "000" + time.getMilliseconds());

    // this.timeString = hour + ":" + min + ":" + sec;
    this.timeString =  min + ":" + sec + ":" + ms;


    return this.timeString;

  }

  // this multiplies by direction to ensure that the >= will
  // always hold.
  isEnded(){
    // return Date.now() >= this.endTime + this.pauseTime;
    return Date.now() - this.startTime >= this.duration;
  }

}
