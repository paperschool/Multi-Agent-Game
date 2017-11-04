class Sprite {

  constructor(file,width,height,x,y,fps){

    this.src = file;
    this.img = null;

    this.pos = {x:x,y:y};

    // tick based fps
    this.fps = fps;
    this.fpsC = 0;

    this.loaded = false;

    this.multiLayered = false

    this.width = width;
    this.height = height;

    this.frameCX = 0;
    this.frameCY = 0;

    this.frame = 0;
    this.frames = 0;

    this.load();

  }

  setFps(fps){  this.fps = fps; }

  setPos(x,y) { this.pos.x = x; this.pos.y = y}

  load(){
    this.img = new Image();

    this.img.src = this.src;

    this.img.onload = (function() {

      // informing state that image is ready for rendering
      this.loaded = true;

      // calculating number of horizontal and vertical frames
      this.frameCX = Math.floor(this.img.width / this.width);
      this.frameCY = Math.floor(this.img.height / this.height);

      // calculating total frame count of animation
      this.frames = this.frameCY*this.frameCX;

    }).bind(this);
  }

  draw(){

    var r,c;

    if(this.loaded){

      if(this.fpsC >= this.fps){
        this.frame = (this.frame >= this.frames-1 ? 0 : this.frame+=1);
        this.fpsC = 0;
      }

      this.fpsC++;

      r = Utility.linRowPosArr(this.frame,this.frameCX);
      c = Utility.linColPosArr(this.frame,this.frameCX);

      Draw.save();

      Draw.translate(mousePos.x,mousePos.x);

      // Draw.rotate(Utility.Radians((360/this.frames) * this.frame));

      Draw.imageCrop(this.img,c*this.width,r*this.height,this.width,this.height,this.pos.x-this.width/2,this.pos.y-this.height/2,this.width,this.height);

      Draw.restore();

      console.log(c*this.width,r*this.height);

       // since the context is rotated, the image will be rotated also
      //  game.ctx.drawImage(this.i,-this.i.width/2,-this.i.height/2);


    }






  }

}
