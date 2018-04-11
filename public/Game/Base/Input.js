class Input {

  constructor(mmoveC,mdownC,kdownC){

    this.pressedKeys = {};

    this.singlePressedKeys = {};

    this.buildKeyPressObject();

    this.singleClickedKeys = {};

    this.clickListeners = [];

    this.currentKey = null;

    this.mouse = {x:0,y:0,click:false,button:"null"}

    this.mouseFocusable = {pos:{x:this.mouse.x,y:this.mouse.y}}

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

  buildKeyPressObject(){
    for(let key in InputKeys){
      this.singlePressedKeys[key] = {
        isPressed:false,
        isDown:false,
        callBacks:[]
      }
    }
  }

  setCallBack(key,callback){
    this.singlePressedKeys[key].callBacks.push(callback);
  }

  mouseMoveEvent(e){

    this.mouse.x = e.offsetX;

    this.mouse.y = e.offsetY;

    this.mouseFocusable = {pos:{x:this.mouse.x,y:this.mouse.y}}

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

      // calling single press check function

      // add specific keycodes here if need be
      switch(code) {
      case 16:
          key = InputKeys.SHIFT; break;
      case 32:
          key = InputKeys.SPACE; break;
      case 38:
      case 87:
          key = InputKeys.UP; break;
      case 37:
      case 65:
          key = InputKeys.LEFT; break;
      case 39:
      case 68:
          key = InputKeys.RIGHT; break;
      case 40:
      case 83:
          key = InputKeys.DOWN; break;
      case 80:
      case 27:
          key = InputKeys.PAUSE; break;
      case 71:
          key = InputKeys.DEBUG_GRID; break; // G
      case 72:
          key = InputKeys.DEBUG_AGENT_VISION; break; // H
      case 74:
          key = InputKeys.DEBUG_AGENT_PATH; break; // J
      case 82:
          key = InputKeys.REPLAY; break;
      case 84:
          key = InputKeys.TOGGLETHEME; break;
      case 88:
          key = InputKeys.GODMODE; break;
      default:
          // Convert ASCII codes to letters
          return;
      }

      this.singlePressedKeys[key].isDown = status;

      if(this.singlePressedKeys[key].isDown && !this.singlePressedKeys[key].isPressed){
        this.singlePressedKeys[key].isPressed = true;

        for(let c = 0 ; c < this.singlePressedKeys[key].callBacks.length; c++){
          this.singlePressedKeys[key].callBacks[c]();
        }
      }

      if(!this.singlePressedKeys[key].isDown && this.singlePressedKeys[key].isPressed){
        this.singlePressedKeys[key].isPressed = false;
      }

  }

  isDown(key){
    return this.singlePressedKeys[key].isDown;
  }


}
