
class ParticleSystem {

  constructor(){

    this.particles = [];

    this.particleLimit = 1000;

  }

  update(deltaTime){

    for(var i = this.particles.length-1 ; i >= 0 ; i--){
      this.particles[i].update(deltaTime);
      if(this.particles[i].life <= 0){
        this.particles.splice(i,1);
      }
    }

    diagnostic.updateLine("- Particles",this.particles.length);


  }

  draw(camera){

    for(var i = 0 ; i < this.particles.length ; i++){
      this.particles[i].draw(camera);
    }

  }

  addParticle(x,y,d,type){

    if(this.particleLimit < this.particles.length) this.particles.splice(this.particleLimit-1,1);


    switch(type){
      case ParticleType.GENERIC:
        this.particles.push(new Particle(x,y));
        break;
      case ParticleType.BURN:

        break;
      case ParticleType.SMOKE:
        this.particles.push(new Particle_Smoke(x,y,d));
        break;
      case ParticleType.BLOOD:
        this.particles.push(new Particle_Blood(x,y,d));
        break;
      case ParticleType.DEBRIS:

        break;

    }
  }

}

class Particle extends Entity {

  constructor(x,y){

    super(x,y,3,3);

    this.colour.randomGrey();

    this.life = 10;

  }

  getLife(){
    return this.life;
  }

  setLife(life){
    this.life = life;
  }

  update(deltaTime){

    super.update(deltaTime);

    this.life--;

    this.colour.setA(Utility.Map(this.life,0,10,1.0,0));


  }

  draw(camera){

    super.draw(camera);

    Draw.fillCol(this.colour);
    Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x);

  }

}

class Particle_Blood extends Particle {

  constructor(x,y,d){

    super(x,y);

    this.colour.randomR(150,255);

    this.life = 100;

    this.setPos(new SAT.Vector(x,y));

    this.getPos().x += Math.cos(Utility.Radians(Utility.Random(-20,20) + d))*Utility.Random(1,200)
    this.getPos().y += Math.sin(Utility.Radians(Utility.Random(-20,20) + d))*Utility.Random(1,200)

  }

  update(deltaTime){

    super.update(deltaTime);
    this.colour.setA(Utility.Map(this.life,100,0,1.0,0.0));
  }

  draw(camera){
    super.draw(camera);
    Draw.fillCol(this.colour);
    Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x);
  }

}

class Particle_Smoke extends Particle {

  constructor(x,y,d){

    super(x,y);

    this.colour.randomG(150,255);

    this.life = 100;

    this.direction = new SAT.Vector(
      Math.cos(Utility.Radians(Utility.Random(-20,20) + d))*Utility.Random(1,200),
      Math.sin(Utility.Radians(Utility.Random(-20,20) + d))*Utility.Random(1,200)
    );

    this.setPos(new SAT.Vector(x,y));

  }

  update(deltaTime){

    super.update(deltaTime);
    this.colour.setA(Utility.Map(this.life,100,0,1.0,0.0));

    this.getPos().add(this.direction);

    this.size.x+=0.01;
    this.size.y+=0.01;

  }

  draw(camera){
    super.draw(camera);
    Draw.fillCol(this.colour);
    Draw.circle(this.pos.x-camera.x,this.pos.y-camera.y,this.size.x);
  }
}
