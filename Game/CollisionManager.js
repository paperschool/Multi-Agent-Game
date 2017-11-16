
class CollisionManager {

  constructor(level){

    this.level = level;

  }

  checkAll(){






    for(var wall = 0 ; wall < this.level.walls.length ; wall++){

      if(this.level.player.weapon){
        for(var bullet = 0 ; bullet < this.level.player.weapon.bullets.length ; bullet++){

          this.checkBulletPlayer(this.level.player.weapon.bullets[bullet],this.level.player);

          this.checkWallBullet(this.level.walls[wall],this.level.player.weapon.bullets[bullet]);

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

  checkWallEnemy(){

  }

  checkBulletPlayer(bullet,player){
    let r = player.collider.test(bullet.collider);
    if(r){
      // console.log("Bullet hit player")
      // bullet.setAlive(false);
      player.setShot(true);
    }
  }

}



// for(var wall = 0 ; wall < this.level.walls.length ; wall++){
//
//   let w = this.level.walls[wall];
//
//   let r = w.collider.test(this.level.player.collider);
//
//   if(r){
//
//     this.level.player.collider.getPos().add(r.overlapV);
//
//     this.level.player.pos.set(this.level.player.collider.getPos());
//
//   } else {
//
//     this.level.player.collider.setPos(this.level.player.pos);
//
//   }
//
//   if(this.level.player.weapon){
//
//     for(var bullet = 0 ; bullet < this.level.player.weapon.bullets.length ; bullet++){
//
//       let b = this.level.player.weapon.bullets[bullet];
//
//       let r = w.collider.test(b.collider);
//
//       if(r){
//         // b.alive = false;
//         b.collider.getPos().add(r.overlapV);
//         b.pos.set(b.collider.getPos());
//
//         b.setRicochetCount(b.getRicochetCount()-1);
//
//         switch (w.checkSide(b.collider.getPos())) {
//           case "LEFT":   b.setDirection(180 - b.getDirection()); break;
//           case "RIGHT":  b.setDirection(180 - b.getDirection()); break;
//           case "TOP":    b.setDirection(360 - b.getDirection()); break;
//           case "BOTTOM": b.setDirection(360 - b.getDirection()); break;
//           default:
//         };
//
//       } else {
//         b.collider.setPos(b.pos);
//       }
//     }
//   }
// }
