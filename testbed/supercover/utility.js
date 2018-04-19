class Utility {

  // returns current time in seconds
  static Now(){
    let d = new Date();
    return d.getSeconds();
  }

  static pow(val){
    return val*val
  }

  static Map(value,oldmin,oldmax,newmin,newmax){
    return (((value - oldmin) * (newmax - newmin)) / (oldmax - oldmin)) + newmin;
  }


  // returns a random int between @min and @max
  static Random(min,max){
    return Math.random() * (max - min) + min;
  }

  // converts @radian to degrees
  static Degrees(radian){
    return radian*180.0/Math.PI;
  }

  // converts @degree to radians
  static Radians(degree){
    return degree*Math.PI/180;
  }

  // takes two vectors (@v1, @v2) and calculates the angle between them
  static VectorAngle(v1,v2){
    let d = Utility.Dot(v1,v2);
    let m = Utility.Mag(v1) * Utility.Mag(v2);
    return Utility.Degrees(Math.cos(d/m));
  }

  // takes two vectors (@v1,@v2) and calculates the dot product
  static Dot(v1,v2){
    return (v1.x*v2.x)+(v1.y*v2.y);
  }

  // takes a single vector (@v1) and calculates the magnitude
  static Mag(v1){
    return Math.sqrt((v1.x*v1.x)+(v1.y*v1.y));
  }

  // takes a vector @v and two ints @x and @y
  static Set(v,x,y){
    v.x = x;
    v.y = y;
    return v;
  }

  // takes two vectors (@v1,@v2) and calculates the angle between them
  static angle(v1,v2){
    return Math.atan2((v2.y-v1.y),(v2.x-v1.x));
  }

  // takes an index and a column count and calculates the column position
  static linColPosArr(index,cc){
    return (index%cc);
  }

  // takes an index and a column count and returns the row position
  static linRowPosArr(index,cc){
    return Math.floor(index/cc);
  }

  static dist(v1,v2){
    return Math.sqrt(Utility.pow(v2.x-v1.x)+Utility.pow(v2.y-v1.y));
  }

  static roundTo(value,round)
  {
    return Math.floor((value+1)/round)*round;
  }


}
