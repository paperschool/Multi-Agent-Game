class Level_Timer {

  constructor(start,max,direction = -1){

    this.start = start;
    this.current = start;
    this.max = max;
    this.direction = direction;

    this.timeString = "00 : 00 : 00 : 0000"

  }

  update(deltaTime){
    this.current += this.direction * deltaTime;
    // this.getFormatTime();
  }

  getFormatTime(){

    var currentTime = new Date()
        , timeElapsed = new Date(currentTime - this.start)
        , hour = timeElapsed.getUTCHours()
        , min = timeElapsed.getUTCMinutes()
        , sec = timeElapsed.getUTCSeconds()
        , ms = timeElapsed.getUTCMilliseconds();


    hour = (hour > 9 ? hour : "0" + hour);
    min  = (min  > 9 ? min : "0" + min);
    sec  = (sec  > 9 ? sec : "0" + sec);
    // ms   = (ms   > 99 ? "0" + ms : ms > 9 ? "00" + ms : "000" + ms);

    this.timeString = hour + " : " + min + " : " + sec;


    return this.timeString;

  }

  // this multiplies by direction to ensure that the >= will
  // always hold.
  isEnded(){
    return this.current * this.direction >= this.max
  }

}
