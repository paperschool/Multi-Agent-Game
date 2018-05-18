
class Component {

  constructor(id){

    this.id = id;

    this.start = null;

    this.mid = createVector();

    this.end = null;

    this.visible = true;

    this.colour = {r:255,g:255,b:255,a:255};

    this.colour2 = {r:255,g:255,b:255,a:255};

    this.colour2.r = 255;
    this.colour2.g = 0;
    this.colour2.b = 0;
    this.colour2.a = 150;

    this.highlighted = false;

  }

  setStart(s){
    this.start = createVector(s.x,s.y);
  }

  setEnd(e){
    this.end = createVector(e.x,e.y);
  }

  // order start and end so it always increases outward
  normalise(){

    if(this.end !== null){
      if(this.end.x < this.start.x){
        let tx = this.end.x;
        this.end.x = this.start.x
        this.start.x = tx;
      }

      if(this.end.y < this.start.y){
        let ty = this.end.y;
        this.end.y = this.start.y
        this.start.y = ty;
      }
    }

  }

  // checking cursor
  within(singleton = false){

    if(activeTool !== -1) return false

    let c = cursor.get();

    if(singleton){

      return c.x === this.start.x && c.y === this.start.y;

    } else {

      if(this.end === null) return false;

      return c.x > this.start.x - gridSize &&
             c.x < this.end.x   + gridSize*wallThickness &&
             c.y > this.start.y - gridSize &&
             c.y < this.end.y   + gridSize*wallThickness

    }

  }

  get(){}

  update(){
    this.highlighted = this.within();
  }

  draw(){}

}

class Enemy extends Component {

  constructor(id,pos,type,weapon){

    super(id);

    this.start = createVector(pos.x,pos.y);

    this.type = type;

    this.weapon = weapon;

  }

  get(offset){

    let enemy = {
      'x':(this.start.x / gridSize) - offset.x,
      'y':(this.start.y / gridSize) - offset.y,
      'type':this.type,
      'weapon':this.weapon
    };

    return enemy;

  }

  update(){
    this.highlighted = this.within(true);
  }

  draw(){
    fill(0,255,255);
    rect(this.start.x-camera.x,this.start.y-camera.y,gridSize,gridSize);
  }

}

class Team extends Enemy {

  constructor(id,pos,type,weapon,team){

    super(id,pos,type,weapon);

    this.team = team;

    this.type = 'multiagent'

  }

  get(offset){

    let enemy = super.get(offset);

    enemy['type'] = this.type;
    
    enemy['team'] = this.team;

    return enemy;

  }

  update(){
    this.highlighted = this.within(true);
  }

  draw(){
    fill(0,255,255);
    rect(this.start.x-camera.x,this.start.y-camera.y,gridSize,gridSize);
  }

}

class Patrol extends Enemy {

  constructor(id,pos,type,weapon){

    super(id,pos,type,weapon);

    this.type = 'patrol';

    // patrol
    this.points = [];

    this.loop = true;

    this.direction = 1;

  }

  setLoop(loop){
    this.loop = loop;
  }

  setDirection(direction){
    this.loop = direction;
  }

  addPatrolPoint(point){
    this.points.push(point);
  }

  get(offset){

    let enemy = super.get(offset);

    enemy['patrol'] = {
      'loop' : this.loop,
      'direction' : this.direction,
      'points' : []
    };

    for( let patrol of this.points ){
      enemy['patrol']['points'].push(
        {
          'x':(patrol.x / gridSize) - offset.x,
          'y':(patrol.y / gridSize) - offset.y,
        }
      );
    }

    return enemy;

  }

  update(){
    this.highlighted = this.within(true);
  }

  draw(){
    super.draw();

    if(this.points.length <= 1) return;

    for(let p = 0 ; p < this.points.length ; p++){

      let from = this.points[ p ];
      let to   = this.points[ ( p + 1 ) % this.points.length];

      stroke(255,100,100);
      strokeWeight(2);
      line(
        (from.x+gridSize/2)-camera.x,
        (from.y+gridSize/2)-camera.y,
        (to.x+gridSize/2)-camera.x,
        (to.y+gridSize/2)-camera.y
      );

    }

  }

}

class Player extends Component {

  constructor(id,pos){
    super(id);

    this.start = createVector(pos.x,pos.y);

  }

  get(offset){
    let player = {
      'x'   : (this.start.x / gridSize) - offset.x,
      'y'   : (this.start.y / gridSize) - offset.y
    };

    return player;

  }

  update(){
    this.highlighted = this.within(true);
  }

  draw(){
    fill(255,0,255);
    rect(this.start.x-camera.x,this.start.y-camera.y,gridSize,gridSize);
  }

}

class Pickup extends Component {

  constructor(id,pos,type){

    super(id);

    this.type = type;

    this.start = createVector(pos.x,pos.y);

  }

  get(offset){
    let pickup = {
      'x'   : (this.start.x / gridSize) - offset.x,
      'y'   : (this.start.y / gridSize) - offset.y,
      'type': this.type
    };

    return pickup;

  }

  update(){
    this.highlighted = this.within(true);
  }

  draw(){
    fill(255,255,0);
    rect(this.start.x-camera.x,this.start.y-camera.y,gridSize,gridSize);
  }

}

class Wall extends Component {

  constructor(id){

    super(id);

    this.visible = true;

    this.direction = 0;

    // COLOURS
    this.colour.r = 255;
    this.colour.g = 255;
    this.colour.b = 255;
    this.colour.a = 255;

  }

  single(){

    if(this.end === null) return false;

    return (this.start.x === this.end.x     && this.start.y === this.end.y) ||
           (this.start.x === cursor.get().x && this.start.y === cursor.get().y);
  }

  alignment(){

    if(this.start === null) return true;

    return this.start.x === cursor.get().x || this.start.y === cursor.get().y

  }

  get(offset){
    let wall = {
      'id':this.id,
      'visible':this.visible,
      'x':this.start.x === 0 ? 0 : (this.start.x / gridSize) - offset.x,
      'y':this.start.y === 0 ? 0 : (this.start.y / gridSize) - offset.y,
      'w':this.end.x - this.start.x === 0 ? wallThickness : ((this.end.x-this.start.x) / gridSize) + 1,
      'h':this.end.y - this.start.y === 0 ? wallThickness : ((this.end.y-this.start.y) / gridSize) + 1
    };
    return wall;
  }

  update(){

    super.update();

    if(this.start != null && this.end != null){
      this.mid.x = this.start.x + Math.abs((this.start.x - this.end.x)/2);
      this.mid.y = this.start.y + Math.abs((this.start.y - this.end.y)/2);
    }
  }

  draw(){

    fill(255,255,255,150);

    if(this.start != null){
      rect(this.start.x-camera.x,this.start.y-camera.y,gridSize*wallThickness,gridSize*wallThickness);
    }

    if(this.start != null && this.end === null && this.alignment()){
      fill(255,255,255,100);

      rect(
        this.start.x-camera.x,
        this.start.y-camera.y,
        (cursor.get().x-this.start.x)+(gridSize*wallThickness),
        (cursor.get().y-this.start.y)+(gridSize*wallThickness)
      )
    }

    if(this.end != null){
      rect(this.end.x-camera.x,this.end.y-camera.y,gridSize*wallThickness,gridSize*wallThickness);

    }

    if(this.start != null && this.end != null){

      if(this.highlighted){
        fill(this.colour2.r,this.colour2.g,this.colour2.b,this.colour2.a);
      } else {
        fill(this.colour.r,this.colour.g,this.colour.b,this.colour.a);
      }

      rect(
        this.start.x-camera.x,
        this.start.y-camera.y,
        (this.end.x-this.start.x)+(gridSize*wallThickness),
        (this.end.y-this.start.y)+(gridSize*wallThickness)
      )

      textSize(30);
      textAlign(CENTER);
      fill(255,0,0);
      text(this.id,this.mid.x-camera.x+(gridSize*wallThickness)/2,this.mid.y-camera.y+(gridSize*wallThickness));

    }

  }

}

class Floor extends Component{

  constructor(id){

    super(id);

    // COLOURS
    this.colour.r = 100;
    this.colour.g = 100;
    this.colour.b = 255;
    this.colour.a = 150;

  }

  get(offset){
    let floor = {
      'id':this.id,
      'visible':this.visible,
      'x':this.start.x === 0 ? 0 : (this.start.x / gridSize) - offset.x,
      'y':this.start.y === 0 ? 0 : (this.start.y / gridSize) - offset.y,
      'w':((this.end.x-this.start.x) / gridSize) + 1,
      'h':((this.end.y-this.start.y) / gridSize) + 1
    };
    return floor;
  }

  update(){

    super.update();

    if(this.start != null && this.end != null){
      this.mid.x = this.start.x-camera.x + Math.abs((this.start.x-camera.x - this.end.x-camera.x)/2);
      this.mid.y = this.start.y-camera.y + Math.abs((this.start.y-camera.y - this.end.y-camera.y)/2);
    }
  }

  draw(){

    fill(255,255,255,150);

    if(this.start != null){
      rect(
        this.start.x-camera.x,
        this.start.y-camera.y,
        gridSize,gridSize);
    }

    if(this.end != null){
      rect(
        this.end.x-camera.x,
        this.end.y-camera.y,
        gridSize,gridSize);
    }

    if(this.start != null && this.end === null){
      fill(255,255,255,100);

      rect(
        this.start.x-camera.x,
        this.start.y-camera.y,
        (cursor.get().x-this.start.x)+(gridSize*wallThickness),
        (cursor.get().y-this.start.y)+(gridSize*wallThickness)
      )
    }

    if(this.start != null && this.end != null){

      if(this.highlighted){
        fill(this.colour2.r,this.colour2.g,this.colour2.b,this.colour2.a);
      } else {
        fill(this.colour.r,this.colour.g,this.colour.b,this.colour.a);
      }

      rect(
        this.start.x-camera.x,
        this.start.y-camera.y,
        (this.end.x-this.start.x)+(gridSize*wallThickness),
        (this.end.y-this.start.y)+(gridSize*wallThickness)
      )

      textSize(30);
      textAlign(CENTER);
      fill(255,0,0);
      text('Floor:' + this.id,this.mid.x-camera.x+(gridSize*wallThickness)/2,this.mid.y-camera.y+(gridSize*wallThickness));

    }

  }

}

class Deadspace extends Component {

  constructor(id){

    super(id);

    // COLOURS
    this.colour.r = 255;
    this.colour.g = 100;
    this.colour.b = 100;
    this.colour.a = 150;

    this.visible = false;

  }

  get(offset){
    let deadspace = {
      'id':this.id,
      'visible':this.visible,
      'x':this.start.x === 0 ? 0 : (this.start.x / gridSize) - offset.x,
      'y':this.start.y === 0 ? 0 : (this.start.y / gridSize) - offset.y,
      'w':((this.end.x-this.start.x) / gridSize) + 1,
      'h':((this.end.y-this.start.y) / gridSize) + 1
    };
    return deadspace;
  }

  update(){

    super.update();

    if(this.start != null && this.end != null){
      this.mid.x = this.start.x + Math.abs((this.start.x - this.end.x)/2);
      this.mid.y = this.start.y + Math.abs((this.start.y - this.end.y)/2);
    }

  }

  draw(){

    fill(255,255,255,150);

    if(this.start != null){
      rect(
        this.start.x-camera.x,
        this.start.y-camera.y,
        gridSize,gridSize);
    }

    if(this.end != null){
      rect(
        this.end.x-camera.x,
        this.end.y-camera.y,
        gridSize,gridSize);
    }

    if(this.start != null && this.end === null){
      fill(255,255,255,100);

      rect(
        this.start.x-camera.x,
        this.start.y-camera.y,
        (cursor.get().x-this.start.x)+(gridSize*wallThickness),
        (cursor.get().y-this.start.y)+(gridSize*wallThickness)
      )
    }

    if(this.start != null && this.end != null){

      if(this.highlighted){
        fill(this.colour2.r,this.colour2.g,this.colour2.b,this.colour2.a);
      } else {
        fill(this.colour.r,this.colour.g,this.colour.b,this.colour.a);
      }

      rect(
        this.start.x-camera.x,
        this.start.y-camera.y,
        (this.end.x-this.start.x)+(gridSize*wallThickness),
        (this.end.y-this.start.y)+(gridSize*wallThickness)
      )

      textSize(30);
      textAlign(CENTER);
      fill(255,0,0);
      text('Deadspace:' + this.id,this.mid.x-camera.x+(gridSize*wallThickness)/2,this.mid.y-camera.y+(gridSize*wallThickness));

    }

  }

}
