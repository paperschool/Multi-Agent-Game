class Input {

  constructor(mmoveC,mdownC,kdownC){
    this.currentKey = null;

    this.mouseMoveCallback = mmoveC;
    this.mouseDownCallback = mdownC;
    this.keyboardCallback  = kdownC;

    document.addEventListener('keydown', (function(e) {
        this.keyboardEvent(e, true);
    }).bind(this));

    document.addEventListener('keyup', (function(e) {
        this.keyboardEvent(e, false);
    }).bind(this));

    document.addEventListener('mousemove', (function(e){
        this.mouseMoveEvent(e);
    }).bind(this));


  }

  mouseMoveEvent(e){
    // console.log(e);
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
    var me = {x:e.offsetX,y:e.offsetY}
    this.mouseMoveCallback(me);
  }

  keyboardEvent(event, status) {

      if(!status){
        key = "NULL";
        return;
      }

      var code = event.keyCode;
      var key;

      switch(code) {
      case 32:
          key = 'SPACE'; break;
      case 38:
      case 87:
          key = 'UP'; break;
      case 37:
      case 65:
          key = 'LEFT'; break;
      case 39:
      case 68:
          key = 'RIGHT'; break;
      case 40:
      case 83:
          key = 'DOWN'; break;
      default:
          // Convert ASCII codes to letters
          key = String.fromCharCode(code);
      }

      this.keyboardCallback(key);
  }




}
