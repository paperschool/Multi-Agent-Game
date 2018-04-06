
class Colour {

  constructor(r = 255,g = 255,b = 255,a = 1.0){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  getR(){
    return this.r;
  }

  getG(){
    return this.g;
  }

  getB(){
    return this.b;
  }

  getA(){
    return this.a;
  }

  setR(r){
    this.r = r;
  }

  setG(g){
    this.g = g;
  }

  setB(b){
    this.b = b;
  }

  setA(a){
    this.a = a;
  }

  getHexComponent(v){
    return
  }

  getHex(){
    return "#" + ((1 << 24) + (Math.floor(this.r) << 16) + (Math.floor(this.g) << 8) + Math.floor(this.b)).toString(16).slice(1);
  }

  getRGBA(){
    return 'rgba('+Math.floor(this.r)+','+Math.floor(this.g)+','+Math.floor(this.b)+','+this.a+')';
  }

  random(min = 0,max = 255){
      this.r = Math.floor(Utility.Random(min,max));
      this.g = Math.floor(Utility.Random(min,max));
      this.b = Math.floor(Utility.Random(min,max));
    return this;
  }

  randomR(min = 0,max = 255){
      this.r = Math.floor(Utility.Random(min,max));
      this.g = 0;
      this.b = 0;
    return this;
  }

  randomG(min = 0,max = 255){
      this.r = 0;
      this.g = Math.floor(Utility.Random(min,max));
      this.b = 0;
    return this;
  }

  randomG(min = 0,max = 255){
      this.r = 0;
      this.g = 0;
      this.b = Math.floor(Utility.Random(min,max));
    return this;
  }

  randomRGB(r,g,b){
    this.r = (r ? Math.floor(Utility.Random(0,255)) : 0);
    this.g = (g ? Math.floor(Utility.Random(0,255)) : 0);
    this.b = (b ? Math.floor(Utility.Random(0,255)) : 0);
    return this
  }

  randomRGBLock(min = 0,max = 255,r,g,b){
    let c = Math.floor(Utility.Random(min,max));
    this.r = (r ? c : 0);
    this.g = (g ? c : 0);
    this.b = (b ? c : 0);
    return this
  }

  randomGrey(min = 0,max = 255){
      let grey = Math.floor(Utility.Random(min,max))
      this.r = grey;
      this.g = grey;
      this.b = grey;
    return this;
  }

  setColour(colour){
    this.r = colour.r || 255;
    this.g = colour.g || 255;
    this.b = colour.b || 255;
    this.a = colour.a || 1.0;
    return this;
  }

  setRGBA(r,g,b,a){
    this.r = r || 255;
    this.g = g || 255;
    this.b = b || 255;
    this.a = a || 1.0;
  }

  setDefault(def = DefaultColours.ASPHALT){
    this.setHex(def + "FF");
  }

  setHex(hex = "#ffffff"){
    this.r = hex.substring(1,3) || 255;
    this.g = hex.substring(3,5) || 255;
    this.b = hex.substring(5,7) || 255;
    this.a = 1.0;
  }

}

class PulseColour {

  constructor(base){

    this.base = base;

    this.cr = 0;

    this.cg = 0;

    this.cb = 0;

  }

  step(inc = 0.01){

    this.cr+=inc;
    this.cg+=inc;
    this.cb+=inc;

    if(this.cr >= 2*Math.PI) this.cr = 0;
    if(this.cb >= 2*Math.PI) this.cg = 0;
    if(this.cg >= 2*Math.PI) this.cb = 0;

    this.base.r = Utility.Map(Math.sin(this.cr),-1,1,0,255);
    this.base.g = Utility.Map(Math.sin(this.cg*2),-1,1,0,255);
    this.base.b = Utility.Map(Math.sin(this.cb*4),-1,1,0,255);

  }

  getColour(){
    return this.base;
  }

}
