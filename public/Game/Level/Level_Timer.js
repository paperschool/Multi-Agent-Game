class LevelTimer {

  constructor(duration,direction = -1,size){

    this.duration = duration;

    this.direction = direction;

    this.timeString = "00 : 00 : 00 : 0000"

    this.size = new SAT.Vector(size.x,size.y);

    this.endTime = Date.now() + duration;

  }

  update(deltaTime){
  }

  draw(camera){

    // Draw.fill(0,0,0,(this.isEnded() ? 0.0 : 0.9));
    Draw.fillHex(gameTheme['TIMER']);

    Draw.text(150,"cherry","center",new SAT.Vector((this.size.x/2)-camera.x,(this.size.y/2)-camera.y),this.getFormatTime());

  }

  getPercentageComplete(){

    return (1.0 / this.duration) * (this.endTime - Date.now());

  }

  getFormatTime(){

    let time = new Date(this.endTime - Date.now());

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
    return Date.now() >= this.endTime;
  }

}
