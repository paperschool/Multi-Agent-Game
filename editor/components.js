class Enemy {

  constructor(id,pos,type,weapon){
    this.id = id;
    this.pos = createVector(pos.x,pos.y);
    this.type = type;
    this.weapon = weapon;
    this.points = [];
    this.loop = false;
    this.direction = 1;
  }

  setLoop(loop){
    this.loop = loop;
  }

  setDirection(direction){
    this.loop = direction;
  }

  addPatrolPoint(x,y){
    this.points.push({'x':x,'y':y});
  }

  get(){

    let enemy = {
      'x':this.pos.x / gridSize,
      'y':this.pos.y / gridSize,
      'type':this.type,
      'weapon':this.weapon
    };

    if(this.type === 'patrol'){

      enemy['patrol'] = {
        'loop' : this.loop,
        'direction' : this.direction,
        'points' : []
      };

      for(let p = 0 ; p < this.points.length ; p++){
        enemy['patrol']['points'].push(this.points[p]);
      }
    }

    return enemy;

  }

  draw(){
    fill(0,255,255);
    rect(this.pos.x,this.pos.y,gridSize,gridSize);
  }

}

class Player {

  constructor(id,pos){
    this.id = id;
    this.pos = createVector(pos.x,pos.y);
  }

  get(){
    let player = {
      'x'   : this.pos.x / gridSize,
      'y'   : this.pos.y / gridSize
    };

    return player;

  }

  draw(){
    fill(255,0,255);
    rect(this.pos.x,this.pos.y,gridSize,gridSize);
  }

}

class Pickup {

  constructor(id,pos,type){
    this.id = id;
    this.pos = createVector(pos.x,pos.y);
    this.type = type;
  }

  get(){
    let pickup = {
      'x'   : this.pos.x / gridSize,
      'y'   : this.pos.y / gridSize,
      'type': this.type
    };

    return pickup;

  }

  draw(){
    fill(255,255,0);
    rect(this.pos.x,this.pos.y,gridSize,gridSize);
  }

}

class Wall {

  constructor(id){
    this.id = id;
    this.startPos = null;
    this.endPos = null;
    this.midPos = createVector(0,0);
    this.direction = 0; // 1 === horizontal, 2 === vertical
  }

  start(s){
    this.startPos = createVector(s.x,s.y);
  }

  end(e){
    this.endPos = createVector(e.x,e.y);
  }

  single(){
    if(this.endPos === null) return false

    let c = cursor.get();

    return (this.startPos.x === this.endPos.x && this.startPos.y === this.endPos.y) ||
           (this.startPos.x === c.x && this.startPos.y === c.y);
  }

  alignment(){

    if(this.startPos === null) return true;

    let c = cursor.get();
    return this.startPos.x === c.x || this.startPos.y === c.y
  }

  // order start and end so it always increases outward
  normalise(){

    if(this.endPos.x < this.startPos.x){
      let tx = this.endPos.x;
      this.endPos.x = this.startPos.x
      this.startPos.x = tx;
    }

    if(this.endPos.y < this.startPos.y){
      let ty = this.endPos.y;
      this.endPos.y = this.startPos.y
      this.startPos.y = ty;
    }

  }

  get(){
    let wall = {
      'id':this.id,
      'x':this.startPos.x === 0 ? 0 : this.startPos.x / gridSize,
      'y':this.startPos.y === 0 ? 0 : this.startPos.y / gridSize,
      'w':this.endPos.x - this.startPos.x === 0 ? wallThickness : ((this.endPos.x-this.startPos.x) / gridSize) + 1,
      'h':this.endPos.y - this.startPos.y === 0 ? wallThickness : ((this.endPos.y-this.startPos.y) / gridSize) + 1,
    };
    return wall;
  }

  update(){
    if(this.startPos != null && this.endPos != null){
      this.midPos.x = this.startPos.x + Math.abs((this.startPos.x - this.endPos.x)/2);
      this.midPos.y = this.startPos.y + Math.abs((this.startPos.y - this.endPos.y)/2);
    }
  }

  draw(){

    fill(255,255,255,200);

    if(this.startPos != null){
      rect(this.startPos.x,this.startPos.y,gridSize*wallThickness,gridSize*wallThickness);
    }

    if(this.startPos != null && this.endPos === null && this.alignment()){
      fill(255,255,255,100);

      rect(
        this.startPos.x,
        this.startPos.y,
        (cursor.get().x-this.startPos.x)+(gridSize*wallThickness),
        (cursor.get().y-this.startPos.y)+(gridSize*wallThickness)
      )
    }

    if(this.endPos != null){
      rect(this.endPos.x,this.endPos.y,gridSize*wallThickness,gridSize*wallThickness);

    }

    if(this.startPos != null && this.endPos != null){

      rect(
        this.startPos.x,
        this.startPos.y,
        (this.endPos.x-this.startPos.x)+(gridSize*wallThickness),
        (this.endPos.y-this.startPos.y)+(gridSize*wallThickness)
      )

      textSize(30);
      textAlign(CENTER);
      fill(255,0,0);
      text(this.id,this.midPos.x+(gridSize*wallThickness)/2,this.midPos.y+(gridSize*wallThickness));


    }

  }

}
