class Grid {

  constructor(x,y,gs){
    this.levelSize = new SAT.Vector(x,y);
    this.offset = new SAT.Vector(0,0);
    this.isDisplayed = true
    this.gridSize = gs;
  }

  setOffset(offset){
    this.offset.add(offset);
  }

  draw(){

    if(!this.isDisplayed) return;

    for(var y = 0 ; y < this.levelSize.y ; y++){
      for(var x = 0 ; x < this.levelSize.x ; x++){
          this.drawTile(this.offset.x + (x*this.gridSize),this.offset.y + (y*this.gridSize),this.gridSize);
      }
    }
  }

  drawTile(x,y,size){

    Draw.fill(50,50,50,1.0);
    Draw.rect(x,y,size,size);
    Draw.fill(51,255,255,1.0);
    Draw.rect(x+0.5,y+0.5,size-1,size-2);
  }

}
