class Grid {

  constructor(){

    this.levelSize = createVector();

    this.newWall = null;

    this.mouseDown = false;

    this.drawing = false;

    this.walls = [];

    this.player = null;

    this.enemies = [];

    this.pickups = [];

  }

  updateMax(){
    if(this.levelSize.x < cursor.get().x) this.levelSize.x = cursor.get().x;
    if(this.levelSize.y < cursor.get().y) this.levelSize.y = cursor.get().y;
  }

  buildLevel(){

    let level = {};

    level['level'] = {};

    level['level']['size'] = {
      'x':(this.levelSize.x / gridSize) + 1,
      'y':(this.levelSize.y / gridSize) + 1
    };

    if(this.player)
      level['level']['player'] = this.player.get();

    level['level']['enemy'] = [];
    // export to class type
    if(this.enemies.length != 0){
      for(let enemy in this.enemies){
        let e = this.enemies[enemy];
        level['level']['enemy'].push(e.get());
      }
    }

    level['level']['pickups'] = [];
    if(this.pickups.length != 0){
      for(let pickup in this.pickups){
        let p = this.pickups[pickup];
        level['level']['pickups'].push(p.get());
      }
    }

    level['level']['walls'] = [];

    level['level']['walls'].push({'x':0,'y':0,'w':1,'h':1,id:'null wall'});

    // iterating through array of walls fetching level size object
    if(this.walls.length != 0){
      for(let w in this.walls){
        level['level']['walls'].push(this.walls[w].get());
      }
    }

    return level;

  }

  update(){

    // updating new wall draw/update loop
    if(this.newWall != null) this.newWall.update();

    for(let wall in this.walls){
      this.walls[wall].update();
    }

    // MOUSE PRESS BEHAVIOUR
    if(mouseIsPressed && !this.mouseDown && !cursor.offscreen() && !buildWindowOpen){

      this.mouseDown = true;

      switch(activeTool){
        case 0:
          this.drawing = true;
          this.newWall = new Wall(this.walls.length+1);
          this.newWall.start(cursor.get());
          break;
        case 1:
          this.player = new Player(0,cursor.get().copy());
          break;
        case 2:
          if(this.enemies.reduce( (t,c) => c.pos.x === cursor.x && c.pos.y === cursor.y ? t = false : t = t ,true)){
            this.enemies.push(new Enemy(this.enemies.length,cursor.get().copy(),'generic','shotgun'));
          }
          break;
        case 3:
          if(this.pickups.reduce( (t,c) => c.pos.x === cursor.x && c.pos.y === cursor.y ? t = false : t = t ,true)){
            this.pickups.push(new Pickup(this.pickups.length,cursor.get().copy(),'shotgun'));
          }
          break;

      }

      this.updateMax();

    }

    if(!mouseIsPressed && this.mouseDown && !buildWindowOpen){

      this.mouseDown = false;

      switch(activeTool){
        case 0:
          this.newWall.end(cursor.get());

          if(this.newWall.alignment() && !this.newWall.single()){
            this.newWall.normalise();
            this.walls.push(this.newWall);
            console.log(this.newWall.get());
          }

          this.newWall = null;
          break;
        case 1: break;
        case 2: break;
        case 3: break;
      }

      this.updateMax();


    }

    // // wall tool
    // if(activeTool === 0){
    //
    //   if(mouseIsPressed && !this.mouseDown && !cursor.offscreen()){
    //     this.mouseDown = true;
    //     this.drawing = true;
    //     this.newWall = new Wall();
    //     this.newWall.start(cursor.get());
    //   }
    //
    //   if(!mouseIsPressed && this.mouseDown){
    //
    //     this.mouseDown = false;
    //
    //     this.newWall.end(cursor.get());
    //
    //     if(this.newWall.alignment() && !this.newWall.single()){
    //       this.newWall.normalise();
    //       this.walls.push(this.newWall);
    //       this.updateMax();
    //     }
    //
    //     this.newWall = null;
    //
    //   }

    // }

    // // player tool
    // if(activeTool === 1){
    //   if(mouseIsPressed && !this.mouseDown && !cursor.offscreen()){
    //     this.player = cursor.get().copy();
    //     this.updateMax();
    //   }
    // }

    // enemy tool
    // if(activeTool === 2){
    //   if(mouseIsPressed && !this.mouseDown && !cursor.offscreen()){
    //     this.mouseDown = true;
    //     if(this.enemies.reduce( (t,c) => c.x === cursor.x && c.y === cursor.y ? t = false : t = t ,true)){
    //       this.enemies.push(cursor.get().copy());
    //       this.updateMax();
    //     }
    //   }
    //   if(!mouseIsPressed && this.mouseDown){
    //     this.mouseDown = false;
    //   }
    // }

    // // pickup tool
    // if(activeTool === 3){
    //   if(mouseIsPressed && !this.mouseDown && !cursor.offscreen()){
    //     this.mouseDown = true;
    //     if(this.pickups.reduce( (t,c) => c.x === cursor.x && c.y === cursor.y ? t = false : t = t ,true)){
    //       this.pickups.push(cursor.get().copy());
    //       this.updateMax();
    //     }
    //   }
    //   if(!mouseIsPressed && this.mouseDown){
    //     this.mouseDown = false;
    //   }
    // }


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

    noStroke();

    if(mouseIsPressed && this.mouseDown){

    }

    fill(100,100,100,150);
    rect(cursor.get().x,0,gridSize,height);
    rect(0,cursor.get().y,width,gridSize);

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
