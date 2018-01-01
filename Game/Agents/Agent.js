
class Agent extends Actor {

  constructor(x,y,world){

    super(x,y,0.9,0.9,3.0,6.0);

    this.setLife(10000);

    this.setAlive(true);

    this.setSpeed(0.2);

    this.setTopSpeed(10.0);

    this.setSize(new SAT.Vector(50,50));

    this.path = null;

    this.colour = new Colour(255,100,100);

    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    this.direction = 90;

    this.isColliding = false;

    this.deltaTime = null;

    // behaviour mechanics

    this.world = world;

    this.behaviour = new Agent_Behaviour(this);

    // min distance required to alert player
    this.alertDistance = 400;

    // boolean to determine if player is within alert distance
    this.isAlerted = false;

    // minimum distance for firing
    this.firingDistance = 200;

    // boolean to determine if player within firing range
    this.isFireRange

    // last position of player
    this.playerLastKnownLocation = new SAT.Vector(0,0);

  }

  getPath(){
    return this.path;
  }

  getNext(){
    return this.path[1];
  }

  setPath(path){
    this.path = path;
  }

  getPathDirection(){
    if(this.getPath().length > 1) {
      return this.calculateDirection(this.getPos(),this.getNext());
    } else {
      return null;
    }
  }

  update(deltaTime){

    if(this.life <= 0) {  this.alive = false; return; }

    this.deltaTime = deltaTime;

    super.update(deltaTime)

    this.behaviour.step();

  }

  draw(camera){
    // super.draw(camera);

    if(this.getAlive()){

      Draw.stroke(1.0,'#FFFF00');
      Draw.fillCol(this.colour);
      Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.direction));

      if(this.isFireRange)
        Draw.line(this.pos.x-camera.x,this.pos.y-camera.y,this.world.player.getPos().x-camera.x,this.world.player.getPos().y-camera.y);

      if(this.getDebugOn()){

        Draw.stroke(1.0,'#FFFF00');
        Draw.circleOutline(this.pos.x-camera.x,this.pos.y-camera.y,this.firingDistance);
        Draw.stroke(1.0,'#00FFFF');
        Draw.circleOutline(this.pos.x-camera.x,this.pos.y-camera.y,this.alertDistance);

        Draw.fill('#FFFFFF');
        Draw.circle(this.playerLastKnownLocation.x-camera.x,this.playerLastKnownLocation.y-camera.y,5);

      }

    }
  }

  // behaviour logic

  playerWithinNavRange(){

    // gaurd
    // if(this.isAlerted) return true;

    let pp = this.world.player.getPos();

    let d = Utility.dist(this.pos,pp);

    if(d <= this.alertDistance){

      // setting alert status to true;
      this.isAlerted = true;

      // updating memory of agent
      // this.playerLastKnownLocation.set2(pp.x,pp.y)

      return true;

    } else {

      this.isAlerted = false;
    }

    return false;

  }


  playerWithinFiringRange(){

    let d = Utility.dist(this.pos,this.world.player.getPos());

    if(d < this.firingDistance){
      this.isFireRange = true;
      return true;
    } else {
      this.isFireRange = false;
    }
    return false;
  }

  playerVisible(){

    this.pointInVision(this.world.player.getPos());

    return true;
  }

  moveToPlayer(){

    // this.getPathDirection();
    //
    // this.applyAcc(
    //     new SAT.Vector(
    //       (this.speed*this.deltaTime) * Math.cos(Utility.Radians(this.direction)),
    //       (this.speed*this.deltaTime) * Math.sin(Utility.Radians(this.direction))
    //     )
    // );
    //
    // // redrawing collision polygon from a normalised position
    // this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));
    //
    // this.evaluateVelocity(this.deltaTime);
    //
    // this.colour.setA(Utility.Map(this.life,0,this.initialLife,0.0,1.0));
    //
    return true;

  }

  shootPlayer(){

    Draw.line(this.pos.x,this.pos.y,this.world.player.getPos().x,this.world.player.getPos().y);

    return true;
  }

}

class Agent_Behaviour {


  constructor(agentObject) {


    /* prelim agent design
    primary ai will simplyt follow path to player when within a certain radius
    when within range it will open fire at the current players position (simple reflexive)

    states:

    -- Idle (the agent will remain stationary until triggered)
    -- when triggered the player will move towards the players
    -- when in range the player will begin firing but will continue to advance towards
       player
    -- when within min range the player will top moving but keep firing
    -- will return to original position if player dead

    tree:

    Start
      |
    Primary Action Selector
      |          |           |
    Return    Attack      Idle

    Return Sequence
      |             |               |
    isPLayerDead?  hasOldPosition  returnToOldPosition

    Attack Sequence
      |               |              |
    isPlayerAlive   isWithinRange  MoveTo


    */

    // boolean operation to determine if agent is within range of player
    BehaviourTree.register('withinShootingRange', new BehaviourTree.Task({
      title:'withinShootingRange',
      run:function(agent){
        agent.playerWithinFiringRange() ? this.success() : this.fail();
      }
    }));

    // boolean operation to determine if agent is within range of player
    BehaviourTree.register('ShootPlayer', new BehaviourTree.Task({
      title:'ShootPlayer',
      run:function(agent){
        agent.shootPlayer() ? this.success() : this.fail();
      }
    }));

    BehaviourTree.register('attackPlayer', new BehaviourTree.Sequence({
      title:'attackPlayer',
      nodes:['withinShootingRange','ShootPlayer']
    }));

    // boolean operation to determine if agent is within range of player
    BehaviourTree.register('playerNearby', new BehaviourTree.Task({
      title:'playerNearby',
      run:function(agent){
        agent.playerWithinNavRange() ? this.success() : this.fail();
      }
    }));

    // boolean operation to determine if player is visible to agent
    BehaviourTree.register('playerVisible', new BehaviourTree.Task({
      title:'playerVisible',
      run:function(agent){
        agent.playerVisible() ? this.success() : this.fail();
      }
    }));

    // boolean operation to determine if agent is within range of player
    BehaviourTree.register('moveToPlayer', new BehaviourTree.Task({
      title:'moveToPlayer',
      run:function(agent){
        agent.moveToPlayer() ? this.success() : this.fail();
      }
    }));

    BehaviourTree.register('nagivate', new BehaviourTree.Sequence({
      title:'nagivate',
      nodes:['playerNearby','playerVisible','moveToPlayer']
    }));

    BehaviourTree.register('StepAction', new BehaviourTree.Sequence({
      title:'StepAction',
      // nodes:['Full','Hungry','Critical']
      nodes:['nagivate','attackPlayer']
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
