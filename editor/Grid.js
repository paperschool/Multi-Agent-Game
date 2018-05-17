class Grid {

  constructor(){

    this.levelMin  = createVector(0,0);
    this.levelSize = createVector(0,0);

    this.offset = createVector(0,0);

    this.mouseDown = false;

    this.drawing = false;

    this.player = null;
    this.enemies = [];
    this.pickups = [];

    this.walls = [];
    this.floors = [];
    this.deadspaces = [];

    this.newWall = null;
    this.newSpace = null;
    this.newEntity = null;

    this.history = new History(this);

  }

  switchTools(){
    this.newWall = null;
    this.newSpace = null;
    this.newEntity = null;
  }

  updateMax(){

    this.levelMin.x = 100000;
    this.levelMin.y = 100000;
    this.levelSize.x = -1;
    this.levelSize.y = -1;

    if(this.player !== null){

      this.levelMin.x = this.levelMin.x > this.player.start.x ? this.player.start.x : this.levelMin.x
      this.levelMin.y = this.levelMin.y > this.player.start.y ? this.player.start.y : this.levelMin.y

      this.levelSize.x = this.levelSize.x < this.player.start.x ? this.player.start.x : this.levelSize.x;
      this.levelSize.y = this.levelSize.y < this.player.start.y ? this.player.start.y : this.levelSize.y;
    }

    for(let entity of this.enemies){

      this.levelMin.x = (this.levelMin.x === -1 || this.levelMin.x > entity.start.x) ? entity.start.x : this.levelMin.x
      this.levelMin.y = (this.levelMin.y === -1 || this.levelMin.y > entity.start.y) ? entity.start.y : this.levelMin.y

      this.levelSize.x = this.levelSize.x < entity.start.x ? entity.start.x : this.levelSize.x;
      this.levelSize.y = this.levelSize.y < entity.start.y ? entity.start.y : this.levelSize.y;
    }

    for(let entity of this.pickups){

      this.levelMin.x = this.levelMin.x === -1 || this.levelMin.x > entity.start.x ? entity.start.x : this.levelMin.x
      this.levelMin.y = this.levelMin.y === -1 || this.levelMin.y > entity.start.y ? entity.start.y : this.levelMin.y

      this.levelSize.x = this.levelSize.x < entity.start.x ? entity.start.x : this.levelSize.x;
      this.levelSize.y = this.levelSize.y < entity.start.y ? entity.start.y : this.levelSize.y;
    }

    for(let entity of this.walls){

      this.levelMin.x = this.levelMin.x === -1 || this.levelMin.x > entity.start.x ? entity.start.x : this.levelMin.x
      this.levelMin.y = this.levelMin.y === -1 || this.levelMin.y > entity.start.y ? entity.start.y : this.levelMin.y

      if(entity.end){
        this.levelSize.x = this.levelSize.x < entity.end.x ? entity.end.x : this.levelSize.x;
        this.levelSize.y = this.levelSize.y < entity.end.y ? entity.end.y : this.levelSize.y;
      }
    }

    for(let entity of this.floors){

      this.levelMin.x = this.levelMin.x === -1 || this.levelMin.x > entity.start.x ? entity.start.x : this.levelMin.x
      this.levelMin.y = this.levelMin.y === -1 || this.levelMin.y > entity.start.y ? entity.start.y : this.levelMin.y

      if(entity.end){
        this.levelSize.x = this.levelSize.x < entity.end.x ? entity.end.x : this.levelSize.x;
        this.levelSize.y = this.levelSize.y < entity.end.y ? entity.end.y : this.levelSize.y;
      }
    }

    for(let entity of this.deadspaces){

      this.levelMin.x = this.levelMin.x === -1 || this.levelMin.x > entity.start.x ? entity.start.x : this.levelMin.x
      this.levelMin.y = this.levelMin.y === -1 || this.levelMin.y > entity.start.y ? entity.start.y : this.levelMin.y

      if(entity.end){
        this.levelSize.x = this.levelSize.x < entity.end.x ? entity.end.x : this.levelSize.x;
        this.levelSize.y = this.levelSize.y < entity.end.y ? entity.end.y : this.levelSize.y;
      }
    }

  }

  load(levelJson){

    let level = levelJson.level;

    console.log(level);

    if(level.player){
      this.player = new Player(0,{x:level.player.x*gridSize,y:level.player.y*gridSize});
    }

    if(level.walls){

      level.walls.splice(0,1);

      for(let wall of level.walls){

        let newWall = new Wall(this.walls.length);

        newWall.setStart(
          {
            x:wall.x*gridSize,
            y:wall.y*gridSize
          }
        );

        newWall.setEnd(
          {
            x:(wall.x+wall.w-1)*gridSize || wall.x*gridSize,
            y:(wall.y+wall.h-1)*gridSize || wall.y*gridSize
          }
        );

        this.walls.push(newWall);

      }

    }

    if(level.floors){

      for(let floor of level.floors){

        let newFloor = new Floor(this.floors.length);

        newFloor.setStart(
          {
            x:floor.x*gridSize,
            y:floor.y*gridSize
          }
        );

        newFloor.setEnd(
          {
            x:(floor.x+floor.w-1)*gridSize || floor.x*gridSize,
            y:(floor.y+floor.h-1)*gridSize || floor.y*gridSize
          }
        );

        this.floors.push(newFloor);

      }

    }

    if(level.deadspaces){

      for(let deadspace of level.deadspaces){

        let newdeadspace = new Deadspace(this.deadspaces.length);

        newdeadspace.setStart(
          {
            x:deadspace.x*gridSize,
            y:deadspace.y*gridSize
          }
        );

        newdeadspace.setEnd(
          {
            x:(deadspace.x+deadspace.w-1)*gridSize || deadspace.x*gridSize,
            y:(deadspace.y+deadspace.h-1)*gridSize || deadspace.y*gridSize
          }
        );

        this.deadspaces.push(newdeadspace);

      }

    }

    if(level.enemy){

      for(let enemy of level.enemy){

        switch(enemy.type){
          case 'generic' :
            this.enemies.push(new Enemy(this.enemies.length,
              {
                x:enemy.x*gridSize,
                y:enemy.y*gridSize
              },
            'generic','shotgun'));
            break;
          case 'patrol' :

            let newPatrol = new Patrol(this.enemies.length,{x:enemy.x*gridSize,y:enemy.y*gridSize},'patrol','shotgun');

            // newPatrol.loop      = enemy.loop;
            //
            // newPatrol.direction = enemy.direction;

            for(let point of enemy.patrol.points){
              newPatrol.addPatrolPoint({
                x:point.x*gridSize,
                y:point.y*gridSize
              });
            }

            this.enemies.push(newPatrol);

            break;
          case 'wander' : break;
        }



      }

    }

    //
    // if(level.enemy.length > 0){
    //   for(let entity of level.enemy){
    //     // adding event to undo stack
    //     this.history.add(this.enemies.length,EventTypes.PICKUP);
    //     this.enemies.push(
    //       new Enemy(
    //         this.enemies.length,
    //         {x:entity.x*gridSize,y:entity.y*gridSize},
    //         pickup.type
    //       )
    //     );
    //   }
    // }
    //
    // if(level.pickups.length > 0){
    //   for(let pickup of level.pickups){
    //     // adding event to undo stack
    //     this.history.add(this.pickups.length,EventTypes.PICKUP);
    //     this.pickups.push(
    //       new Pickup(
    //         this.pickups.length,
    //         {x:pickup.x*gridSize,y:pickup.y*gridSize},
    //         pickup.type
    //       )
    //     );
    //
    //   }
    // }

  }

  buildLevel(){

    let levelOffset = createVector(
      Math.round(this.levelSize.x/gridSize)-Math.round(this.levelMin.x/gridSize),
      Math.round(this.levelSize.y/gridSize)-Math.round(this.levelMin.y/gridSize)
    );

    let levelMin = createVector(
      Math.round(this.levelMin.x/gridSize),
      Math.round(this.levelMin.y/gridSize)
    );

    let level = {};

    level['level'] = {};

    level['level']['size'] = {
      'x':levelOffset.x + 1,
      'y':levelOffset.y + 1
    };

    if(this.player)
      level['level']['player'] = this.player.get(levelMin);

    level['level']['enemy'] = [];
    // export to class type
    if(this.enemies.length != 0){
      for(let enemy in this.enemies){
        let e = this.enemies[enemy];
        level['level']['enemy'].push(e.get(levelMin));
      }
    }

    level['level']['pickups'] = [];
    if(this.pickups.length != 0){
      for(let pickup in this.pickups){
        let p = this.pickups[pickup];
        level['level']['pickups'].push(p.get(levelMin));
      }
    }

    level['level']['deadspaces'] = [];
    // iterating through array of walls fetching level size object
    if(this.deadspaces.length != 0){
      for(let deadspace of this.deadspaces){
        level['level']['deadspaces'].push(deadspace.get(levelMin));
      }
    }

    level['level']['floors'] = [];
    // iterating through array of walls fetching level size object
    if(this.floors.length != 0){
      for(let floor of this.floors){
        level['level']['floors'].push(floor.get(levelMin));
      }
    }

    level['level']['walls'] = [];

    level['level']['walls'].push({'x':0,'y':0,'w':1,'h':1,id:'null wall',visible:false});

    // iterating through array of walls fetching level size object
    if(this.walls.length != 0){
      for(let w in this.walls){
        level['level']['walls'].push(this.walls[w].get(levelMin));
      }
    }

    return level;

  }

  update(){

    if(this.player) this.player.update()

    // updating new wall draw/update loop
    if(this.newWall != null) this.newWall.update();

    for(let wall of this.walls){
      wall.update();
    }

    if(this.newSpace != null) this.newSpace.update();

    for(let floor of this.floors){
      floor.update();
    }

    for(let deadspace of this.deadspaces){
      deadspace.update();
    }

    for(let enemy of this.enemies){
      enemy.update();
    }

    for(let pickup of this.pickups){
      pickup.update();
    }


    this.updateMax();

    // MOUSE PRESS BEHAVIOUR
    if(mouseIsPressed && !this.mouseDown && !cursor.offscreen() && !overlayOpen){

      this.mouseDown = true;

      switch(activeTool){
        case -1:

          if(this.player !== null){
            if(this.player.highlighted){
              this.history.remove(0,EventTypes.PLAYER);
              this.player = null;
              return;
            }
          }

          for(let i = this.enemies.length-1 ; i >= 0 ; i--){
            let entity = this.enemies[i];
            if(entity.highlighted){
              this.history.remove(this.enemies[i].id,EventTypes.ENEMY);
              this.enemies.splice(i,1);
              return;
            }
          }

          for(let i = this.pickups.length-1 ; i >= 0 ; i--){
            let entity = this.pickups[i];
            if(entity.highlighted){
              this.history.remove(this.pickups[i].id,EventTypes.PICKUP);
              this.pickups.splice(i,1);
              return;
            }
          }

          for(let i = this.walls.length-1 ; i >= 0 ; i--){
            let entity = this.walls[i];
            if(entity.highlighted){
              this.history.remove(this.walls[i].id,EventTypes.WALL);
              this.walls.splice(i,1);
              return;
            }
          }

          for(let i = this.floors.length-1 ; i >= 0 ; i--){
            let entity = this.floors[i];
            if(entity.highlighted){
              this.history.remove(this.floors[i].id,EventTypes.FLOOR);
              this.floors.splice(i,1);
              return;
            }
          }

          for(let i = this.deadspaces.length-1 ; i >= 0 ; i--){
            let entity = this.deadspaces[i];
            if(entity.highlighted){
              this.history.remove(this.deadspaces[i].id,EventTypes.DEADSPACE);
              this.deadspaces.splice(i,1);
              return;
            }
          }

          break;
        case 0:
          this.drawing = true;
          this.newWall = new Wall(this.walls.length);
          this.newWall.setStart(cursor.get());

          break;
        case 1:
          this.player = new Player(0,cursor.get().copy());
          // adding event to undo stack
          this.history.add(0,EventTypes.PLAYER);
          break;
        case 2:
          if(this.enemies.reduce( (t,c) => c.start.x === cursor.x && c.start.y === cursor.y ? t = false : t = t ,true)){
            // adding event to undo stack
            this.history.add(this.enemies.length,EventTypes.ENEMY);

            this.enemies.push(new Enemy(this.enemies.length,cursor.get().copy(),'generic','shotgun'));
          }
          break;
        case 3:
          if(this.pickups.reduce( (t,c) => c.start.x === cursor.x && c.start.y === cursor.y ? t = false : t = t ,true)){

            // adding event to undo stack
            this.history.add(this.pickups.length,EventTypes.PICKUP);

            this.pickups.push(new Pickup(this.pickups.length,cursor.get().copy(),'shotgun'));

          }
          break;
        case 4:
          // maybe add area cross over check?
          this.newSpace = new Floor(this.floors.length);
          this.newSpace.setStart(cursor.get());

          break;
        case 5:
          // maybe add area cross over check?
          this.newSpace = new Deadspace(this.deadspaces.length);
          this.newSpace.setStart(cursor.get());
          break;
        case 6:
          if(this.enemies.reduce( (t,c) => c.start.x === cursor.x && c.start.y === cursor.y ? t = false : t = t ,true)){

            if(this.newEntity === null) {
              // creating patrol object
              this.newEntity = new Patrol(this.enemies.length,cursor.get().copy(),'patrol','machinegun');

              // adding event to undo stack
              this.history.add(this.enemies.length,EventTypes.PATROL);

              // adding enemy to enemy collection
              this.enemies.push(this.newEntity);

              // pushing first patrol point
              this.newEntity.addPatrolPoint(cursor.get().copy())

            } else {

              // pushing first patrol point
              this.newEntity.addPatrolPoint(cursor.get().copy())

            }

          }
          break;
      }

    }

    // mouse unclicked behaviour trap
    if(!mouseIsPressed && this.mouseDown && !overlayOpen){

      // reseting trap
      this.mouseDown = false;

      switch(activeTool){
        case -1: break;

        case 0:
          this.newWall.setEnd(cursor.get());

          if(this.newWall.alignment() && !this.newWall.single()){
            this.newWall.normalise();

            // adding event to undo stack
            this.history.add(this.walls.length,EventTypes.WALL);

            this.walls.push(this.newWall);
          }

          this.newWall = null;
          break;
        case 1: break;
        case 2: break;
        case 3: break;
        case 4:

          this.newSpace.setEnd(cursor.get());
          this.newSpace.normalise();

          // adding event to undo stack
          this.history.add(this.newSpace.id,EventTypes.FLOOR);

          this.floors.push(this.newSpace);
          this.newSpace = null;
          break;
        case 5:
          this.newSpace.setEnd(cursor.get());
          this.newSpace.normalise();

          // adding event to undo stack
          this.history.add(this.newSpace.id,EventTypes.DEADSPACE);

          this.deadspaces.push(this.newSpace);
          this.newSpace = null;
          break;
      case 6: break;
      }

    }

  }

  draw(){

    strokeWeight(0.5);
    stroke(255);

    for(let h = 0 ; h < (width / gridSize) ; h++){
      line((h*gridSize),0,(h*gridSize),height);
    }

    for(let v = 0 ; v < height / gridSize ; v++){
      line(0,(v*gridSize),width,(v*gridSize));
    }

    if(this.levelSize.x !== -1 && this.levelSize.y !== -1){
      strokeWeight(5);
      noFill();
      rect(
        this.levelMin.x-camera.x,
        this.levelMin.y-camera.y,
        this.levelSize.x-this.levelMin.x+gridSize,
        this.levelSize.y-this.levelMin.y+gridSize
      );
    }

    noStroke();

    fill(100,100,100,150);
    rect(cursor.get().x-camera.x,0,gridSize,height);
    rect(0,cursor.get().y-camera.y,width,gridSize);

    if(this.newSpace != null) this.newSpace.draw();

    for(let floor of this.floors){
      floor.draw();
    }

    for(let deadspace of this.deadspaces){
      deadspace.draw();
    }

    if(this.newWall != null) this.newWall.draw();

    for(let wall in this.walls){
      this.walls[wall].draw();
    }

    if(this.player != null){
      this.player.draw();
    }

    for(let e in this.enemies){
      this.enemies[e].draw();
    }

    for(let p in this.pickups){
      this.pickups[p].draw();

    }

  }

}
