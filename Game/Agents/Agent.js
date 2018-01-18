
class Agent extends Actor {

  constructor(x,y,manager){

    super(x,y,0.9,0.9,3.0,6.0);

    this.setLife(10000);

    this.setAlive(true);

    this.setSpeed(0.3);

    this.setTopSpeed(10.0);

    this.setSize(new SAT.Vector(50,50));

    // array storing all path positions to reach player
    this.path = null;

    // agent colour
    this.colour = new Colour(255,100,100);

    // agent collision body
    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    // agent position
    this.direction = 90;

    // collision state
    this.isColliding = false;

    // deltatime variable for access reasons
    this.deltaTime = null;

    // BEHAVIOUR VARIABLES / STATES //

    // reference to environment for full access when evaluating
    this.level = manager.level;

    // environment
    this.grid = manager.grid;

    // a vector representing the agents pathfinding focus
    this.focusPosition = this.chooseRandomFocusPosition();

    // non player focused position
    this.nonPlayerFocusPosition = this.focusPosition;

    // player distance
    this.playerDistance = -1;

    // behaviour tree for agent
    this.behaviour = new Agent_Behaviour(this);

    // distance representing agent sight distance
    this.sightDistance = 700;

    // angle representing range of agent sight (degrees)
    this.sightAngle = 80;

    // boolean representing if player is within angle of sight
    this.isWithinFieldOfView = false;

    // boolean representing if player is within line of sight
    this.isWithinLineOfSight = false;

    // turning speed of ai
    this.turnSpeed = 10;

    // boolean to determine if player is within alert distance
    this.isAlerted = false;

    // min distance required to alert player
    this.alertDistance = 400;

    // integer representing alert cool down
    this.alertTimeout = 1000;

    // integer represending alert remaining time
    this.alertRemaining = 0;

    // minimum distance for firing
    this.firingDistance = 200;

    // boolean to determine if player within firing range
    this.isFireRange = false;

    // last position of player
    this.playerLastKnownLocation = new SAT.Vector(0,0);

  }

  // AGENT UTILITY FUNCTIONS

  getFocusPosition(){
    return this.focusPosition;
  }

  getSightAngle(){
    return this.sightAngle;
  }

  getSightDistance(){
    return this.sightDistance;
  }

  getPath(){
    return this.path;
  }

  getNext(){
    return (this.path[1] !== 'undefined' ? this.path[1] : this.getPos())
  }

  setPath(path){

    if(path.length === 0) console.log("path Impossible")

    this.path = path;
  }

  getPathDirection(){
    if(this.getPath().length > 1) {
      return this.calculateDirection(this.getPos(),this.getNext());
    } else {
      return null;
    }
  }

  // this method will be used to set the alert state back to true;
  alertAgent(){
    this.alertRemaining = this.alertTimeout;
    this.isAlerted = true;
  }

  updateAlert(){

    if(this.isAlerted && this.alertRemaining > 0){
      this.alertRemaining-=this.deltaTime
      this.colour.setRGBA(255,100,100);
    } else {
      this.colour.setRGBA(100,255,100);

      this.isAlerted = false;
    }

  }

  // this setter updates the agents last known position variable
  setLastKnownPosition(){
    this.playerLastKnownLocation.set(this.level.player.getPos());
  }

  // this method will update the internal focus position state
  setAgentPathfindingFocus(focus = AgentPathFindingFocus.WANDER){

    this.pathfindingFocus = focus;

    if(!this.getPath() || this.getPath().length <= 0) return

    switch(this.pathfindingFocus){
      case AgentPathFindingFocus.PLAYER:     this.focusPosition = this.level.player.getPos();  break;
      case AgentPathFindingFocus.NEARPLAYER: this.focusPosition = this.level.player.getPos();  break;
      case AgentPathFindingFocus.PATROL:     this.focusPosition = this.nonPlayerFocusPosition; break;
      case AgentPathFindingFocus.WANDER:     this.focusPosition = this.nonPlayerFocusPosition; break;
      default: break;
    }

  }

  // AGENT WANDER MECHANICS

  // this method will set the agents focus to a random position on the map
  chooseRandomFocusPosition(){

    this.nonPlayerFocusPosition = this.grid.getRandomNonObstacleMapPosition();

    this.focusPosition = this.nonPlayerFocusPosition

    return this.nonPlayerFocusPosition;
  }

  // method that will determine if agent has reached focus position
  agentArrivedFocusPosition(){
    return this.grid.isAtMapPosition(this.getPos(),this.getFocusPosition());
  }

  // AGENT SENSING MECHANICS

  playerWithinNavRange(){
    return this.playerDistance <= this.alertDistance
  }

  // method that checks if player is shooting
  playerIsShooting(){
    return this.level.player.getFiring();
  }

  // method checks that player is within agent field of view
  playerVisible(){
    if(Utility.isInsideSector(this.getDirection(),this.getPos(),this.level.player.getPos(),this.getSightAngle(),this.getSightDistance())){
      this.isWithinFieldOfView = true;
      return true;
    } else {
      this.isWithinFieldOfView = false;
      return false;
    }
  }

  // checks line to player is unobstructed
  playerLineOfSight(){

    return true;

    // checking if players center or shoulders are within a line of sight to
    // the agent
    if(
      this.grid.lineOfSight(this.grid.getGridVector(this.getPos()),this.grid.getGridVector(this.level.player.getPos())) ||
      this.grid.lineOfSight(this.grid.getGridVector(this.getPos()),this.grid.getGridVector(this.level.player.getLeftShoulder())) ||
      this.grid.lineOfSight(this.grid.getGridVector(this.getPos()),this.grid.getGridVector(this.level.player.getRightShoulder()))
    ) {
      this.isWithinLineOfSight = true;
      return true;
    } else {
      this.isWithinLineOfSight = false;
      return false;
    }
  }

  // AGENT DIRECTION AND MOVEMENT MECHANICS

  // this will turn the agent in the direction of the focus position
  lookAtFocus(){

    if(!this.path.length) return;

    // let fpos = new SAT.Vector()

    // setting state wise look position
    // switch(this.pathfindingFocus){
    //   case AgentPathFindingFocus.PLAYER:     fpos.set(this.level.player.getPos()); break;
    //   case AgentPathFindingFocus.NEARPLAYER: fpos.set(this.level.player.getPos()); break;
    //   case AgentPathFindingFocus.WANDER:     fpos.set(this.getPath()[0]);          break;
    //   case AgentPathFindingFocus.PLAYER:     fpos.set(this.getPath()[0]);          break;
    //   default: break;
    // }

    // this.getNext();

    this.setDirection(Utility.Degrees(Utility.angle(this.getPos(),this.getFocusPosition())));

    // this.setDirection(Utility.Degrees(Utility.angle(this.getPos(),fpos)));

    return true;
  }

  // this move the agent in the direction specified above
  moveToFocus(){

    // setting current acceleration to speed directed by agent direction
    this.applyAcc(
        new SAT.Vector(
          (this.speed) * Math.cos(Utility.Radians(this.direction)),
          (this.speed) * Math.sin(Utility.Radians(this.direction))
        )
    );

    // redrawing collision polygon from a normalised position
    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    // evaluate new velocity from current acceleration,direction,speed etc
    this.evaluateVelocity(this.deltaTime);

    return true;
  }

  // methods used when player is visible

  // this method will turn the player to look at player position
  lookAtPlayer(){
    // this.turnTo(this.getPos(),this.level.player.getPos())
    this.setDirection(Utility.Degrees(Utility.angle(this.getPos(),this.level.player.getPos())));

    return true;
  }

  moveToPlayer(){

    // setting current acceleration to speed directed by agent direction
    this.applyAcc(
        new SAT.Vector(
          (this.speed) * Math.cos(Utility.Radians(this.direction)),
          (this.speed) * Math.sin(Utility.Radians(this.direction))
        )
    );

    // redrawing collision polygon from a normalised position
    this.collider = new PolygonCollider(this.pos.x,this.pos.y,Draw.polygonQuadNorm(40.0,20.0,this.direction));

    // evaluate new velocity from current acceleration,direction,speed etc
    this.evaluateVelocity(this.deltaTime);

    return true;
  }

  // AGENT COMBAT MECHANICS

  playerWithinFiringRange(){

    if(this.playerDistance <= this.firingDistance){
      this.isFireRange = true;
      return true;
    } else {
      this.isFireRange = false;
    }

    return false;
  }

  shootPlayer(){

    Draw.line(this.pos.x,this.pos.y,this.level.player.getPos().x,this.level.player.getPos().y);

    return true;
  }

  // AGENT UPDATE AND DRAW METHODS

  update(deltaTime){

    super.update(deltaTime)

    // checking if agent is alive
    if(this.life <= 0) {  this.alive = false; return; }

    // updating delta time for other methods that use it
    this.deltaTime = deltaTime;

    // decrimenting alert value
    this.updateAlert();

    // updating player distance from agent for radius violation checks
    this.playerDistance = Utility.dist(this.pos,this.level.player.getPos());

    // stepping through the behaviour tree
    this.behaviour.step();

  }

  draw(camera){
    // super.draw(camera);

    if(this.getAlive()){

      Draw.fillCol(this.colour);
      Draw.polygon(Draw.polygonQuad(this.pos.x-camera.x,this.pos.y-camera.y,40.0,20.0,this.direction));

      if(this.isFireRange){
        Draw.line(this.pos.x-camera.x,this.pos.y-camera.y,this.level.player.getPos().x-camera.x,this.level.player.getPos().y-camera.y);
      }

      Draw.fill(100,100,255,1);
      Draw.circle(this.leftShoulder.x-camera.x,this.leftShoulder.y-camera.y,5);
      Draw.circle(this.rightShoulder.x-camera.x,this.rightShoulder.y-camera.y,5);

      if(this.getDebugOn()){

        Draw.circleOutline(this.pos.x-camera.x,this.pos.y-camera.y,this.firingDistance);
        Draw.stroke(1,'#FFFF00');
        Draw.circleOutline(this.pos.x-camera.x,this.pos.y-camera.y,this.alertDistance);
        Draw.stroke(1,'#00FFFF');

        // Draw.fill('#FFFFFF');
        // Draw.circle(this.playerLastKnownLocation.x-camera.x,this.playerLastKnownLocation.y-camera.y,5);

        Draw.line(
          this.getPos().x - camera.x,
          this.getPos().y - camera.y,
          this.getSightDistance() * Math.cos(Utility.Radians(this.getDirection() - (this.getSightAngle()/2))) + this.getPos().x - camera.x,
          this.getSightDistance() * Math.sin(Utility.Radians(this.getDirection() - (this.getSightAngle()/2))) + this.getPos().y - camera.y,
          (this.isWithinFieldOfView ? 3 : 1),
          (this.isWithinFieldOfView ? '#00FF00' : '#FF0000')
        );


        Draw.line(
          this.getPos().x - camera.x,
          this.getPos().y - camera.y,
          this.getSightDistance() * Math.cos(Utility.Radians(this.getDirection() + (this.getSightAngle()/2))) + this.getPos().x - camera.x,
          this.getSightDistance() * Math.sin(Utility.Radians(this.getDirection() + (this.getSightAngle()/2))) + this.getPos().y - camera.y,
          (this.isWithinFieldOfView ? 3 : 1),
          (this.isWithinFieldOfView ? '#00FF00' : '#FF0000')
        );

        Draw.line(
          this.getPos().x - camera.x,
          this.getPos().y - camera.y,
          this.level.player.getPos().x-camera.x,
          this.level.player.getPos().y-camera.y,
          (this.isWithinLineOfSight ? 3 : 1),
          (this.isWithinLineOfSight ? '#00FF00' : '#FF0000')
        );

        let path = this.getPath();

        for(var node = 0 ; node < path.length ; node++){

          Draw.fill(
            100,
            Utility.Map(node,0,path.length,255,0),
            Utility.Map(node,0,path.length,0,255)
            ,
            0.5
          );

          Draw.circle(
            path[node].x-camera.x,
            path[node].y-camera.y,
            this.grid.gridSize/4
          )

        }

        if(this.isAlerted){

          Draw.fill(150,255,150,0.5);

          Draw.sector(
            this.getPos().x-camera.x,
            this.getPos().y-camera.y,
            20,
            0,
            Utility.Map(this.alertRemaining,0,this.alertTimeout,0,360)
          )
        }

      }

    }
  }

}
