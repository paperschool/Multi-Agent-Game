class Utility {
  static Now(){
    let d = new Date();
    return d.getSeconds();
  }
  static Random(min,max){
    return Math.random() * (max - min) + min;
  }

  static Degrees(radian){
    return radian*180.0/Math.PI;
  }

  static Radians(degree){
    return radian*Math.PI/180;
  }

  static VectorAngle(v1,v2){
    let d = Utility.Dot(v1,v2);
    let m = Utility.Mag(v1) * Utility.Mag(v2);
    return Utility.Degrees(Math.cos(d/m));
  }

  static Dot(v1,v2){
    return (v1.x*v2.x)+(v1.y*v2.y);
  }

  static Mag(v1){
    return Math.sqrt((v1.x*v1.x)+(v1.y*v1.y));
  }

  static Set(v,x,y){
    v.x = x;
    v.y = y;
    return v;
  }

  }


class Draw {

  static checkGame(){
    return (game !== null);
  }

  static clear(x,y,w,h){
    if(Draw.checkGame()){
      game.ctx.clearRect(x,y,w,h);
    }
  }

  static line(x1,y1,x2,y2){
    if(Draw.checkGame()){
      game.ctx.beginPath();
      game.ctx.moveTo(x1,y1);
      game.ctx.lineTo(x2,y2);
      Draw.stroke();
    }
  }

  static rect(x,y,w,h){
    if(Draw.checkGame()){
      game.ctx.fillRect(x,y,w,h);
    }
  }

  static stroke(){
    if(Draw.checkGame()){
      game.ctx.stroke();
    }
  }

  static fill(r,g,b){
    if(Draw.checkGame()){
      game.ctx.fillStyle = 'rgb('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+')';
    }
  }

  static fill(r,g,b,a){
    if(Draw.checkGame()){
      game.ctx.fillStyle = 'rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+','+Math.floor(a)+')';
    }
  }

  static save(){
    if(Draw.checkGame()){
      game.ctx.save();
    }
  }


  static restore(){
    if(Draw.checkGame()){
      game.ctx.restore();
    }
  }



  static rotate(angle){
    if(Draw.checkGame()){
      game.ctx.rotate(Utility.Degrees(angle));
    }
  }

}
