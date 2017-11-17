
class CollisionManager {

  constructor(level){

    this.level = level;

  }

  checkAll(){

    for(var wall = 0 ; wall < this.level.walls.length ; wall++){

      if(this.level.player.weapon){

        for(var bullet = 0 ; bullet < this.level.player.weapon.bullets.length ; bullet++){

          this.checkBulletPlayer(this.level.player.weapon.bullets[bullet],this.level.player);

          for(var i = 0 ; i < this.level.enemy.length ; i++){
            if(this.level.enemy[i].getAlive()){
              this.checkBulletEnemy(this.level.player.weapon.bullets[bullet],this.level.enemy[i]);
            }
          }

          this.checkWallBullet(this.level.walls[wall],this.level.player.weapon.bullets[bullet]);

        }

      }

      for(var i = 0 ; i < this.level.enemy.length ; i++){
        if(this.level.enemy[i].getAlive()){
          this.checkWallEnemy(this.level.walls[wall],this.level.enemy[i]);
        }
      }

      this.checkWallPlayer(this.level.walls[wall],this.level.player);

    }


  }

  checkWallBullet(wall,bullet){

    let r = wall.collider.test(bullet.collider);

    if(r){
      // b.alive = false;
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

    } else {
      bullet.collider.setPos(bullet.pos);
    }

  }

  checkWallPlayer(wall,player){
    let r = wall.collider.test(player.collider);
    if(r){
      player.collider.getPos().add(r.overlapV);
      player.pos.set(player.collider.getPos());
    } else {
      player.collider.setPos(player.pos);
    }
  }

  checkWallEnemy(wall,enemy){
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
    let r = player.collider.test(bullet.collider);
    if(r){
      // console.log("Bullet hit player")
      // bullet.setAlive(false);
      player.setShot(true);
    }
  }

  checkBulletEnemy(bullet,enemy){
    let r = enemy.collider.test(bullet.collider);
    if(r){
      bullet.setAlive(false);
      enemy.setShot(true);
    }
  }



}
