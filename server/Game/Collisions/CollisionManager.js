
class CollisionManager {

  constructor(level){

    this.level = level;

  }

  checkAll(){

    let agents = this.level.agents.getAgents();

    for(var wall = 0 ; wall < this.level.walls.length ; wall++){

      if(this.level.player.weapon){

        for(var bullet = 0 ; bullet < this.level.player.weapon.bullets.length ; bullet++){

          // this.checkBulletPlayer(this.level.player.weapon.bullets[bullet],this.level.player);

          for(var i = 0 ; i < agents.length ; i++){
            if(agents[i].getAlive()){
              this.checkBulletEnemy(this.level.player.weapon.bullets[bullet],agents[i]);
            }
          }

          this.checkWallBullet(this.level.walls[wall],this.level.player.weapon.bullets[bullet]);

        }

        // iterate through agents
        for(var agent = 0 ; agent < agents.length ; agent++)
          if(agents[agent].getWeapon() !== null)
            for(var bullet = 0 ; bullet < agents[agent].weapon.bullets.length ; bullet++){
              this.checkBulletPlayer(agents[agent].weapon.bullets[bullet],this.level.player);
              this.checkWallBullet(this.level.walls[wall],agents[agent].weapon.bullets[bullet]);
            }

      }






      // for(var i = 0 ; i < agents.length ; i++){
      //   if(agents[i].getAlive()){
      //     this.checkWallEnemy(this.level.walls[wall],agents[i]);
      //   }
      // }

      this.checkWallPlayer(this.level.walls[wall],this.level.player);

    }


  }

  checkWallBullet(wall,bullet){

    if(!wall.collider || !bullet.collider) return;

    let r = wall.collider.test(bullet.collider);

    if(r){

      bullet.collider.getPos().add(r.overlapV);

      bullet.pos.set(bullet.collider.getPos());

      bullet.setRicochetCount(bullet.getRicochetCount()-1);

      switch (wall.checkSide(bullet.collider.getPos())) {
        case "LEFT":   bullet.setDirection(180 - bullet.getDirection()); break;
        case "RIGHT":  bullet.setDirection(180 - bullet.getDirection()); break;
        case "TOP":    bullet.setDirection(360 - bullet.getDirection()); break;
        case "BOTTOM": bullet.setDirection(360 - bullet.getDirection()); break;
        default:
      };

      this.level.ParticleSystem.addParticle(bullet.pos.x,bullet.pos.y,bullet.getDirection(),ParticleType.GENERIC);

    } else {
      bullet.collider.setPos(bullet.pos);
    }

  }

  checkWallPlayer(wall,player){

    if(!wall.collider || !player.collider) return;

    let r = wall.collider.test(player.collider);
    if(r){
      player.collider.getPos().add(r.overlapV);
      player.pos.set(player.collider.getPos());
    } else {
      player.collider.setPos(player.pos);
    }
  }

  checkWallEnemy(wall,enemy){

    if(!wall.collider || !enemy.collider) return;

    let r = wall.collider.test(enemy.collider);
    if(r){
      enemy.collider.getPos().add(r.overlapV);
      enemy.pos.set(enemy.collider.getPos());
      enemy.isColliding = true;
    } else {
      enemy.collider.setPos(enemy.pos);
    }
  }

  checkBulletPlayer(bullet,player){

    if(!bullet.collider || !player.collider) return;

    let r = player.collider.test(bullet.collider);
    if(r){
      // console.log("Bullet hit player")
      // bullet.setAlive(false);
      // player.setShot(true);

      player.applyDamage(bullet);

      // remove particle on collision
      bullet.setAlive(false);

      // adding blood particles to world when shot
      this.level.ParticleSystem.addParticle(bullet.pos.x,bullet.pos.y,bullet.getDirection(),ParticleType.BLOOD);
      // enemy.setShot(true);

    }
  }

  checkBulletEnemy(bullet,enemy){

    if(!bullet.collider || !enemy.collider) return;

    let r = enemy.collider.test(bullet.collider);
    if(r){

      enemy.applyDamage(bullet);

      // remove particle on collision
      bullet.setAlive(false);

      // adding blood particles to world when shot
      this.level.ParticleSystem.addParticle(bullet.pos.x,bullet.pos.y,bullet.getDirection(),ParticleType.BLOOD);
      // enemy.setShot(true);
    }
  }



}
