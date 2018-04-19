
var world;

function setup(){

  createCanvas(innerWidth, innerHeight);

  angleMode(DEGREES)

  world = new World();

  print("Setup Complete")

}

function draw(){

  noStroke();

  background(51,51,51,150)

  world.update();

  world.draw();

}

class LifeBar {

  constructor(value){
    this.svalue = value;
    this.value = value;
  }

  set(value){
    this.value = value;
  }

  draw(){

    fill(
      map(this.value,0,this.svalue,255,100),
      map(this.value,0,this.svalue,0,255),
      map(this.value,0,this.svalue,0,100)
    )
    rect(0,height-40,map(this.value,0,this.svalue,0,width),height)
  }

}

class FoodMananger {

  constructor(max){

    this.food = [];

    this.maxFood = max;

  }

  add(){
    if(this.food.length < this.maxFood) {
      if(random(0,5) <= 1)
        this.food.push(new Food());
    }
  }

  update(){

    this.add();

    for(var i = this.food.length-1 ; i >= 0 ; i--){
      this.food[i].update();
      // Check if food has expired and subsequently needs to be deleted
      if(this.food[i].isDead())
        this.food.splice(i,1);
    }
  }

  draw(){

    for(var i = 0 ; i < this.food.length ; i++){

      for(let food of this.food){
        strokeWeight(0.5);
        stroke(map(i,0,this.food.length,0,150),map(i,0,this.food.length,0,150),map(i,0,this.food.length,150,0));
        line(
          food.pos.x,
          food.pos.y,
          this.food[i].pos.x,
          this.food[i].pos.y
        );
      }
    }

      for(let food of this.food){
        food.draw();
      }

  }

  findFarthest(pos){

    // set impossibly high minimum
    let max = 0;

    // food item reference
    let foodItem = null;

    // iterate through all current food items
    for(var i = 0 ; i < this.food.length ; i++) {

      // calculate distance from agent position to food item
      let d = Utility.dist(this.food[i].pos,pos);

      strokeWeight(5);
      stroke(255, 100, 100);
      line(this.food[i].x,this.food[i].y,pos.x,pos.y)
      noStroke();

      // if current item is less then minimum update minimum
      if(max < d) {
        max = d;
        foodItem = this.food[i];
      }

    }

    // returning item of food closest to position
    return foodItem;

  }

  findNearest(pos){

    // set impossibly high minimum
    let min = width*height;

    // food item reference
    let foodItem = null;

    // iterate through all current food items
    for(var i = 0 ; i < this.food.length ; i++) {

      // calculate distance from agent position to food item
      let d = Utility.dist(this.food[i].pos,pos);

      strokeWeight(5);
      stroke(255, 100, 100);
      line(this.food[i].x,this.food[i].y,pos.x,pos.y)
      noStroke();

      // if current item is less then minimum update minimum
      if(min > d) {
        min = d;
        foodItem = this.food[i];
      }

    }

    // returning item of food closest to position
    return foodItem;

  }

}

class Food {

  constructor(){

    this.size = random(10,30)

    this.pos = createVector(
      random(this.size,width-this.size),
      random(this.size,height-this.size)
    );

    this.slife = random(40,70);

    this.life = this.slife

    this.value = map(this.size,10,30,10,100);

    this.consumptionRate = random(0.01,1);

    this.col = color(255,255,255);

  }

  isDead(){
    return this.life <= 0;
  }

  consume(){

    this.col = color(255,100,100
    // ,map(this.life,0,this.slife,0,255
    );

    this.life-=this.consumptionRate

    return this.consumptionRate;
  }

  update(){
    this.life-=0.5;

    this.pos.x += random(-0.5,0.5);
    this.pos.y += random(-0.5,0.5);

  }

  draw(){
    fill(this.col);
    ellipse(this.pos.x,this.pos.y,this.size);
  }

}

class World {

  constructor(){

    this.setup();

  }

  setup(){

    let playerLife = 100.0;

    this.player = new Agent(width/2,height/2,40,playerLife,this);

    this.food = new FoodMananger(200);

    this.lifeBar = new LifeBar(playerLife)

    this.lifeDecriment = 0.1;

  }

  update(){

    this.food.update();

    if(this.player.isDead()) this.setup();

    this.player.damage(this.lifeDecriment);

    this.player.update();

    this.lifeBar.set(this.player.life);

  }

  draw(){

    this.player.draw();

    this.lifeBar.draw();

    this.food.draw();
  }


}
