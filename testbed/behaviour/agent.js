
class Agent {

  constructor(x,y,r,l,world){

    // reference to environment
    this.world = world;

    this.pos  = new p5.Vector(x,y);

    this.size = r;

    this.startingLife = l;

    this.life = l;

    this.dir  = 0;

    this.behaviour = new Agent_Behaviour(this);

    this.speed = 1

    this.foodFocus = null;

  }

  update(){

    this.behaviour.step();

  }

  draw(){

    fill(255);
    textSize(15)
    text("Life     : " + this.life,10,20);
    text("Direction: " + this.dir,10,40);

    if(!this.isDead()){

      if(this.foodFocus){
        strokeWeight(3);
        stroke(255, 204, 0);
        line(this.pos.x,this.pos.y,this.foodFocus.pos.x,this.foodFocus.pos.y)
        noStroke();
      }

      fill(
        map(this.life,0,this.startingLife,255,100),
        map(this.life,0,this.startingLife,0,255),
        map(this.life,0,this.startingLife,0,100)
      )

      ellipse(this.pos.x,this.pos.y,this.size);

    }


  }

  // Boolean Checks

  isDead(){
    return (this.life <= 0)
  }

  isCritical() {
    // console.log("In isCritical Function");
    return (this.life < this.startingLife*8.0 && this.life >= this.startingLife*0)

  }

  isHungry() {
    // console.log("In isHungry Function");
    return (this.life <= this.startingLife*9.0 && this.life >= this.startingLife*0.8)
  }

  isFull() {
    // console.log("In isFull Function");
    return (this.life === this.startingLife*1.0)
    // return false;
  }

  moveDirection(){

    this.pos.x = this.speed * cos(this.dir) + this.pos.x;
    this.pos.y = this.speed * sin(this.dir) + this.pos.y;

  }

  turnTo(pos){
    return Utility.Degrees(Utility.angle(this.pos,pos))
  }

  // interaction methods
  damage(hit){
    this.life-=hit;
  }

  forage(closest){

    if(closest){
      // calculating new position to head towards (viable food source)
      this.foodFocus = this.world.food.findNearest(this.pos);
    } else {
      // calculating new position to head towards (viable food source)
      this.foodFocus = this.world.food.findFarthest(this.pos);
    }

    // gaurd as no food is currently available
    if(this.foodFocus === null) return false;

    // calculating speed as linear map of distance to food item
    this.speed = Utility.dist(this.foodFocus.pos,this.pos)/10

    // console.log("In Forage Function");
    this.dir = this.turnTo(this.foodFocus.pos);

    // move in direction of current direction
    this.moveDirection();

    return true;
  }

  eat(){
    // console.log("In Eat Function");

    if(Utility.dist(this.pos,this.foodFocus.pos) < 5){
      this.life+=this.foodFocus.consume();
    } else {
      return false;
    }


    return true;
  }

  follow(){
    // console.log("In Follow Function");
    let mpos =new p5.Vector(mouseX===0?1:mouseX,mouseY===0?1:mouseY)

    this.speed = Utility.dist(mpos,this.pos)/10

    this.dir = Utility.Degrees(Utility.angle(mpos,this.pos)) + 180;

    this.moveDirection()

    return true;
  }

  absorb(){

    let d = dist(this.pos.x,this.pos.y,mouseX,mouseY)

    if(d > 150) d = 150;

    this.life += map(d,0,150,0.001,0.00)

    return true;

  }

  rest(){
    // console.log("In Rest Function");
  }

}

class Agent_Behaviour{

  constructor(agentObject){

    BehaviourTree.register('rest', new BehaviourTree.Task({
      title:'rest',
      run:function(agent){
        agent.rest();
        this.success();
      }
    }));

    BehaviourTree.register('follow', new BehaviourTree.Task({
      title:'follow',
      run:function(agent){
        agent.follow() ? this.success() : this.fail();
      }
    }));

    BehaviourTree.register('absorb', new BehaviourTree.Task({
      title:'absorb',
      run:function(agent){
        agent.absorb() ? this.success() : this.fail();
      }
    }));

    // random selector bouncing between moving far or moving close (this is a poor design as it means a lot of circular behaviour will occur)
    BehaviourTree.register('forage-distance-random', new BehaviourTree.Random({
      title:'forage-distance-random',
      // nodes:['Full','Hungry','Critical']
      nodes:[
        'forage'
        // 'forage-far'
      ]
    }));

    BehaviourTree.register('forage', new BehaviourTree.Task({
      title:'forage',
      run:function(agent){
        if(agent.forage(true)){
          this.success();
        } else {
          this.fail();
        }
      }
    }));

    BehaviourTree.register('forage-far', new BehaviourTree.Task({
      title:'forage-far',
      run:function(agent){
        if(agent.forage(false)){
          this.success();
        } else {
          this.fail();
        }
      }
    }));



    BehaviourTree.register('eat', new BehaviourTree.Task({
      title:'eat',
      run:function(agent){
        if(agent.eat()){
          this.success();
        } else {
          this.fail();
        }
      }
    }));

    // boolean operation to determine if agent is critical health
    BehaviourTree.register('isCritical', new BehaviourTree.Task({
      title:'isCritical',
      run:function(agent){
        agent.isCritical() ? this.success() : this.fail();
      }
    }));

    // boolean operation to determine if agent is hungry health
    BehaviourTree.register('isHungry', new BehaviourTree.Task({
      title:'isHungry',
      run:function(agent){
        agent.isHungry() ? this.success() : this.fail();
      }
    }));

    // boolean operation to determine if agent is full
    BehaviourTree.register('isFull', new BehaviourTree.Task({
      title:'isFull',
      run:function(agent){
        agent.isFull() ? this.success() : this.fail();
      }
    }));

    // sequence ran when determining if agent needs critical behaviour
    BehaviourTree.register('Critical', new BehaviourTree.Sequence({
      title:'Critical',
      nodes:['isCritical','forage-distance-random','eat']
    }));

    // sequence ran when determining if agent needs hungry behaviour
    BehaviourTree.register('Hungry', new BehaviourTree.Sequence({
      title:'Hungry',
      nodes:['isHungry','follow','absorb']
    }));

    // sequence ran when determining if agent needs full behaviour
    BehaviourTree.register('Full', new BehaviourTree.Sequence({
      title:'Full',
      nodes:['isFull','rest']
    }));

    BehaviourTree.register('StepAction', new BehaviourTree.Priority({
      title:'StepAction',
      // nodes:['Full','Hungry','Critical']
      nodes:['Critical','Hungry','Full']
    }));

    // tree
    this.behaviour = new BehaviourTree({
      title: 'agent-behaviour',
      tree: 'StepAction'
    });

    this.behaviour.setObject(agentObject);

  }

  getBehaviour(){
    return this.behaviour;
  }

  setObject(object){
    this.behaviour.getObject(object)
  }

  step(){
    this.behaviour.step();
  }

}
