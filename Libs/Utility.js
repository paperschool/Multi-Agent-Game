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
    return degree*Math.PI/180;
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

  static angle(v1,v2){
    return Math.atan2((v2.y-v1.y),(v2.x-v1.x));
  }

  static linColPosArr(index,cc){
    return (index%cc);
  }

  static linRowPosArr(index,cc){
    return Math.floor(index/cc);
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

  static polygonQuadNorm(w, h,angle){
    return Draw.polygonQuad(0,0,w,h,angle);
  }


  // TODO: Calculate correct offset width and height from those angles
  static polygonQuad(x, y, w, h,angle) {

    // create point array
    var points = [];

    // long vs short side ratio
    var ratio  = (w > h ? w/h : h/w);

    var width  = ((360.0 / (ratio + 1.0)) * ratio)/4.0;
    var height = (360.0 / (ratio + 1.0))/4.0;

    points.push(new SAT.Vector(
      w*Math.cos(Utility.Radians(-width)+Utility.Radians(angle))+x,
      w*Math.sin(Utility.Radians(-width)+Utility.Radians(angle))+y
    ));

    points.push(new SAT.Vector(
      w*Math.cos(Utility.Radians(width)+Utility.Radians(angle))+x,
      w*Math.sin(Utility.Radians(width)+Utility.Radians(angle))+y
    ));

    points.push(new SAT.Vector(
      w*Math.cos(Utility.Radians(180-width)+Utility.Radians(angle))+x,
      w*Math.sin(Utility.Radians(180-width)+Utility.Radians(angle))+y
    ));

    points.push(new SAT.Vector(
      w*Math.cos(Utility.Radians(180+width)+Utility.Radians(angle))+x,
      w*Math.sin(Utility.Radians(180+width)+Utility.Radians(angle))+y
    ));

    return points;

  }

  static normalisedAARect(w,h){
    return Draw.axisAlignedRect(0,0,w,h)
  }

  static axisAlignedRect(x,y,w,h){

    var points = [];

    points.push(new SAT.Vector(x,y));
    points.push(new SAT.Vector(x+w,y));
    points.push(new SAT.Vector(x+w,y+h));
    points.push(new SAT.Vector(x,y+h));

    return points;

  }

  static polygonPoints(x, y, radius, sides,angle) {

    // check if polygon is possible
    if (sides < 3) return;

    // create point array
    var points = [];

    // calculate inner angle of vertex (2PI divided into side count)
    var a = ((Math.PI * 2)/sides);

    // iterating over side count
    for (var i = 0; i < sides; i++) {
      // calculating x and y points at ofset for polygon
      points.push({x:radius*Math.cos((a*i)+Utility.Radians(angle))+x,y:radius*Math.sin((a*i)+Utility.Radians(angle))+y});
    }

    return points;

  }

  static image(i,x,y){
    if(Draw.checkGame()){
        game.ctx.drawImage(i,x,y);
    }
  }

  // this SO explains the logic https://stackoverflow.com/a/4200413
  static imageCrop(image, cropX, cropY, cropW, cropH, placeX, placeY, placeW, placeH){
    if(Draw.checkGame()){
        game.ctx.drawImage(image, cropX, cropY, cropW, cropH, placeX, placeY, placeW, placeH);
    }
  }

  // Drawing Polygon from points with undefined fill style
  static polygonOutline(points){
    if(Draw.checkGame()){
      for(var i = 0 ; i < points.length-1 ; i++){
        Draw.line(points[i].x,points[i].y,points[i+1].x,points[i+1].y,2);
      }
      Draw.line(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y,2);
    }
  }

  // Drawing Polygon from points with undefined fill style
  static polygon(points){
    if(Draw.checkGame()){
      game.ctx.beginPath();
      game.ctx.moveTo(points[0].x,points[0].y);
      for(var i = 1 ; i < points.length ; i++){
        game.ctx.lineTo(points[i].x,points[i].y);
      }
      game.ctx.closePath();
      game.ctx.fill();
    }
  }

  static line(x1,y1,x2,y2,w = 1){
    if(Draw.checkGame()){
      game.ctx.beginPath();
      game.ctx.moveTo(x1,y1);
      game.ctx.lineWidth = w;
      game.ctx.lineTo(x2,y2);
      Draw.stroke();
    }
  }

  // static line(x1,y1,x2,y2){
  //   if(Draw.checkGame()){
  //     game.ctx.beginPath();
  //     game.ctx.moveTo(x1,y1);
  //     game.ctx.lineTo(x2,y2);
  //     Draw.stroke();
  //   }
  // }

  static circle(x,y,r){
    if(Draw.checkGame()){
      game.ctx.beginPath();
      game.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      game.ctx.fill();
    }
  }

  static rectOutline(x,y,w,h){
    if(Draw.checkGame()){
      game.ctx.stroke();
      game.ctx.strokeRect(x,y,w,h);
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

  static fill(r,g,b,a = 1.0){
    if(Draw.checkGame()){
      game.ctx.fillStyle = 'rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+','+Math.floor(a)+')';
    }
  }

  static save(){
    if(Draw.checkGame()){
      game.ctx.save();
    }
  }

  static translate(x,y){
    if(Draw.checkGame()){
      game.ctx.translate(x,y);
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
