class World {

  constructor(x,y){

    // creating new camera objext
    this.camera = new Camera(0,1,1,0,0,0);

    this.grid = new Grid(0,0,50,20,30);

  }

  update(delta){

    if(input.isDown("UP")){
      this.camera.updateFocus(new LEV(0,-10));
    }

    if(input.isDown("DOWN")){
      this.camera.updateFocus(new LEV(0,10));
    }

    if(input.isDown("LEFT")){
      this.camera.updateFocus(new LEV(-10,0));
    }

    if(input.isDown("RIGHT")){
      this.camera.updateFocus(new LEV(10,0));
    }

    this.camera.update();

    this.grid.update(delta);

  }

  draw(){

    Draw.fill(51,51,51);
    Draw.rect(0,0,CW,CH);

    this.grid.draw(this.camera.getOffset());

  }

}

class Grid {

  constructor(x,y,w,h,u){

    this.pos = new LEV(x,y);

    this.size = new LEV(w,h);

    this.unit = u;

    this.margin = 2;

  }

  getBoardSize(){
    return new LEV(this.size.x*this.unit,this.size.y*this.unit)
  }

  posToGrid(camera,pos){

    return new LEV(
      (Utility.roundTo(pos.x-camera.x,this.unit)),
      (Utility.roundTo(pos.y-camera.y,this.unit))
    );
  }

  highlightGrid(){

  }

  update(deltaTime){

  }

  draw(camera){

    for(var y = 0 ; y < this.size.y ; y++){
      for(var x = 0 ; x < this.size.x ; x++){
        Draw.fill(220,220,220);
        Draw.rect(
          this.pos.x + (this.unit * x) - camera.x,
          this.pos.y + (this.unit * y) - camera.y,
          this.unit,
          this.unit
        );

        Draw.fill(170,170,170);
        Draw.rect(
          this.pos.x + (this.unit * x) + this.margin -camera.x,
          this.pos.y + (this.unit * y) + this.margin -camera.y,
          this.unit - this.margin*2,
          this.unit - this.margin*2
        );

      }
    }

    let highlighted = this.posToGrid(camera,input.mouse);

    console.log(highlighted);

    Draw.fill(100,100,255);
    Draw.rect(highlighted.x,highlighted.y,this.unit,this.unit);

  }

}
