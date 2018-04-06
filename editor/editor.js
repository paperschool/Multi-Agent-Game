
// tools, 0 === wall, 1 === player, 2 === enemy, 3 === pickup
let activeTool = 0;

let wallThickness = 1;

let buildWindowOpen = false;

var can;

var gridSize = 10;

var grid = null;

var cursor = null;

function windowResized(){
  resizeCanvas(innerWidth,innerHeight);
}

$(document).ready(function(){

  // storing references to dom toolbar buttons
  let wall   = $('#wall-button');
  let player = $('#player-button');
  let enemy  = $('#enemy-button');
  let pickup = $('#pickup-button');
  let build  = $('#build-button');
  let reset  = $('#reset-button');

  //
  let toolPosition  = $('#tool-position');

  $(window).mousemove(function(event){
    toolPosition.html(Math.round(event.pageX / gridSize) + ":" + Math.round(event.pageY / gridSize));
  });

  wall.on('click',function(){
    activeTool = 0;
    clicked();
  });

  player.on('click',function(){
    activeTool = 1;
    clicked();
  });

  enemy.on('click',function(){
    activeTool = 2;
    clicked();
  });

  pickup.on('click',function(){
    activeTool = 3;
    clicked();
  });

  function clicked(){
    wall.css({'background-color':(activeTool === 0 ? '#e74c3c' : '#f39c12')});
    player.css({'background-color':(activeTool === 1 ? '#e74c3c' : '#f39c12')});
    enemy.css({'background-color':(activeTool === 2 ? '#e74c3c' : '#f39c12')});
    pickup.css({'background-color':(activeTool === 3 ? '#e74c3c' : '#f39c12')});
  }

  clicked();

  // method that generates the json object for the level files
  build.on('click',function(){

    buildWindowOpen = true;

    let close = $('<div class="built-level-close"></div>');

    let copy = $('<div class="built-level-copy" id="build-level-copy"></div>');

    let code = $('<div class="built-level-content"><pre>'+JSON.stringify(grid.buildLevel(),null, 2)+'</pre></div>')

    let dialogue = $('<div class="built-level"></div>');

    $('body').find('.built-level').remove();

    $('body').append(dialogue);

    dialogue.append(close);
    dialogue.append(copy);
    dialogue.append(code);

    close.on('click',function(){
      dialogue.remove();
      buildWindowOpen = false;
    })

    copy.on('click',function() {

        var sel = document.getSelection();
        var ran = new Range();

        sel.addRange(ran);

        range.selectNode(document.getElementById("build-level-copy"));
        window.getSelection().addRange(range);
        document.execCommand("copy")
    });

  });

  reset.on('click',function(){
    grid = new Grid();
  });

});

function setup(){

  can = createCanvas(innerWidth,innerHeight);

  can.parent("editor_canvas")

  grid = new Grid();

  cursor = new Cursor();

}

function draw(){

  noStroke();

  background(51);

  grid.update();
  grid.draw();

  cursor.update();
  cursor.draw();


}



class Cursor {

  constructor(){
    this.pos = createVector(
      floor( mouseX / gridSize ) * gridSize,
      floor( mouseY / gridSize ) * gridSize
    )

    this.color = color(0, 255, 0);

  }

  get(){
    return this.pos;
  }

  offscreen() {
    return (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height);
  }

  update(){

    this.pos.x = floor( mouseX / gridSize ) * gridSize;
    this.pos.y = floor( mouseY / gridSize ) * gridSize;

    if(activeTool === 0){
      if(grid.newWall != null){

        let ws = grid.newWall.startPos;
        let we = grid.newWall.endPos;

        if(grid.newWall.alignment() && !grid.newWall.single()){
          this.color = color(0,255,0);
        } else {
          this.color = color(255,0,0);
        }

      }
    }



  }

  draw(){

    fill(this.color)
    rect(
      this.pos.x,
      this.pos.y,
      gridSize,
      gridSize
    );


    if(grid.newWall != null){

      let ws = grid.newWall.startPos;
      let we = grid.newWall.endPos;

      fill(255,255,0);

      if(ws != null){
        textSize(15);
        text("Start: " + ws.x + ":" + ws.y, this.pos.x,this.pos.y-20);
        text("End  : " + this.pos.x + ":"+this.pos.y, this.pos.x,this.pos.y);

      }

    }

  }

}
