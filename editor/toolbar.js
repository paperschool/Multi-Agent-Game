var ButtonType = {
  WALL:"1",
  PLAYER:"2",
  ENEMY:"3",
  PICKUP:"4",
  FLOOR:"5"
}


class ToolBar extends Rectangle {

  constructor(h){

    super(0,height-h,width,h);

    this.setColour(new Colour(80,80,80,1))

    this.buttons = [];

    this.margin = 20;

  }

  resizeBar(){
    this.getSize().x = width;
    this.getSize().y = height;

    this.resizeButtons();

  }

  resizeButtons(){

    let s = (this.size.x / this.buttons.length) - this.margin*2

    for(var button = 0 ; button < this.buttons.length ; button++){
      this.buttons[button]
        .setSize(
          createVector(
            (this.size.x / this.buttons.length) - this.margin*2,
            (this.size.y - (2*this.margin))
          )
        );

      this.buttons[button]
        .setPos(
          createVector(
            this.pos.x + this.margin + ((s+this.margin)*button),
            this.pos.y + this.margin
          )
        )
    }

  }

  addButton(type){

    switch (type) {
      case ButtonType.WALL:
        this.buttons.push(new Wall_Button(0,0,0,0));
        break;
      case ButtonType.FLOOR: break;
      case ButtonType.PLAYER: break;
      case ButtonType.ENEMY: break;
      case ButtonType.PICKUP: break;
      default:

    }

    this.resizeButtons();

  }

  update(){
    super.update();
  }

  draw(){
    super.draw();

    for(var button = 0 ; button < this.buttons.length ; button++){
      this.buttons[button].draw();
    }

  }

}

class Button extends Rectangle {

  constructor(x,y,w,h){
    super(x,y,w,h);

    this.getColour().randomGrey();

  }

  update(){
    super.update();
  }

  draw(){
    super.draw();
  }

}

class Wall_Button extends Button {

  constructor(x,y,w,h){
    super(x,y,w,h);

    this.setColour(new Colour(255,100,100,1));

  }

  update(){
    super.update()
  }

  draw(){
    super.draw();
  }

}
