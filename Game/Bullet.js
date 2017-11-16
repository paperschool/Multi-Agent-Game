class Bullet extends Actor {

  constructor(x,y,s,d,l){
    super(x,y,0,0,s,0);

    this.colour = new Colour(51,51,51);

    this.colour.random();

    this.collider = new CircularCollider(this.pos.x,this.pos.y,5);

    this.setLifespan(l);

    this.setDirection(d);

    this.setRicochetCount(2);

  }

  getRicochetCount(){
    return this.ricochetCount;
  }

  setRicochetCount(count){
    this.ricochetCount = count;
  }

  update(deltaTime){

    if(!this.alive) return;

    // decrimenting life
    this.lifespan--;

    if(this.ricochetCount <= 0) { this.alive = false; }

    // killing actor when lifespan ends
    if(this.lifespan <= 0) { this.alive = false; }



    this.collider.setPos(this.pos);

    // move the bullet
    this.pos.add(
      new SAT.Vector(
        (this.speed*deltaTime) * Math.cos(Utility.Radians(this.direction)),
        (this.speed*deltaTime) * Math.sin(Utility.Radians(this.direction))
      )
    )

  }

  draw(camera){

    if(this.alive){
      Draw.fillCol(this.colour);
      Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,5);

    }

  }


}
