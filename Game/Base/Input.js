class Input {

  constructor(mmoveC,mdownC,kdownC){

    this.pressedKeys = {};

    this.singleClickedKeys = {};

    this.currentKey = null;

    this.mouse = {x:0,y:0,click:false,button:"null"}

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

    document.addEventListener('mousedown', (function(e){
        this.mouseDownEvent(e);
    }).bind(this));

    document.addEventListener('mouseup', (function(e){
        this.mouseUpEvent(e);
    }).bind(this));


  }

  mouseMoveEvent(e){

    this.mouse.x = e.offsetX;
    this.mouse.y = e.offsetY;

  }

  mouseDownEvent(e){

    //TODO : Add single click logic ( add a system for checking something has only been clicked once rather than checking if down )



    switch (e.button) {
        case 0:
            this.mouse.click = true;
            this.mouse.button = "LEFT";
        break;
        case 1:
            console.log('Middle button clicked.');
            this.mouse.click = true;
            this.mouse.button = "MIDDLE";
        break;
        case 2:
            console.log('Right button clicked.');
            this.mouse.click = true;
            this.mouse.button = "RIGHT";
        break;
    }



  }

  mouseUpEvent(e){

    this.mouse.click = false;
    this.mouse.button = "NULL";

  }

  keyboardEvent(event, status) {

      var code = event.keyCode;
      var key;

      // add specific keycodes here if need be
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

      this.pressedKeys[key] = status;

      if(typeof this.keyboardCallback === 'function'){
        this.keyboardCallback(key);
      }

  }

  isDown(key){
    return this.pressedKeys[key.toUpperCase()];
  }

  isClicked(key){
    return this.singleClickedKeys[key.toUpperCase()].down;
  }


}
