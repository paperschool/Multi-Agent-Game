
// tools, 0 === wall, 1 === player, 2 === enemy, 3 === pickup
let activeTool = 0;

let wallThickness = 1;

let buildWindowOpen = false;

var can;

var gridSize = 10;

var grid = null;

var cursor = null;

var refImg = null;

var imgGuide = null;

var camera = null;

function windowResized(){
  resizeCanvas(innerWidth,innerHeight);
}

let toolPosition = null

$(document).ready(function(){

  // storing references to dom toolbar buttons
  let wall       = $('#wall-button');
  let player     = $('#player-button');
  let enemy      = $('#enemy-button');
  let pickup     = $('#pickup-button');
  let build      = $('#build-button');
  let floor      = $('#floor-button');
  let erase      = $('#erase-button');
  let deadspace  = $('#deadspace-button');
  let reset      = $('#reset-button');

  //
  toolPosition = $('#tool-position');

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

  floor.on('click',function(){
    activeTool = 4;
    clicked();
  });

  deadspace.on('click',function(){
    activeTool = 5;
    clicked();
  });



  erase.on('click',function(){
    activeTool = -1;
    clicked();
  });

  function clicked(){
    erase.css({'background-color':(activeTool === -1 ? '#e74c3c' : '#f39c12')});
    wall.css({'background-color':(activeTool === 0 ? '#e74c3c' : '#f39c12')});
    player.css({'background-color':(activeTool === 1 ? '#e74c3c' : '#f39c12')});
    enemy.css({'background-color':(activeTool === 2 ? '#e74c3c' : '#f39c12')});
    pickup.css({'background-color':(activeTool === 3 ? '#e74c3c' : '#f39c12')});
    floor.css({'background-color':(activeTool === 4 ? '#e74c3c' : '#f39c12')});
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

function preload(){
    refImg = loadImage('/leveldesigns/patrol-1.jpg');
}

function setup(){

  can = createCanvas(innerWidth,innerHeight);

  can.parent("editor_canvas")

  camera = new Camera();

  imgGuide = new ImageGuide(0,0,refImg);

  grid = new Grid();

  cursor = new Cursor();

}

function draw(){

  toolPosition.html(
    cursor.getUnit().x + ":" + cursor.getUnit().y
  );

  noStroke();
  background(51);

  imgGuide.update();
  imgGuide.draw();

  grid.update();
  grid.draw();

  cursor.update();
  cursor.draw();

}


let keys = {
  90 : { label:'z',pressed:false,fired:false,callback:function(){
      console.log("Undo pressed");
      grid.history.undo();
    }
  },
  89 : { label:'y',pressed:false,fired:false,callback:function(){
      console.log("Redo pressed");
      // grid.history.redo()
    }
  },
  87 : { label:'w',pressed:false,fired:false,callback:function(){
      console.log("UP pressed");
      camera.up();
      imgGuide.up();
    }
  },
  83 : { label:'s',pressed:false,fired:false,callback:function(){
      console.log("DOWN pressed");
      camera.down();
      imgGuide.down();
    }
  },
  65 : { label:'a',pressed:false,fired:false,callback:function(){
      console.log("LEFT pressed");
      camera.left();
      imgGuide.left();
    }
  },
  68 : { label:'d',pressed:false,fired:false,callback:function(){
      console.log("RIGHT pressed");
      camera.right();
      imgGuide.right();
    }
  },
  72 : { label:'h',pressed:false,fired:false,callback:function(){
      imgGuide.hide = !imgGuide.hide;
    }
  },
  81 : { label:'q',pressed:false,fired:false,callback:function(){
      imgGuide.scale(-1)
    }
  },
  69 : { label:'e',pressed:false,fired:false,callback:function(){
      imgGuide.scale(1)
    }
  }


}

// input system (works supprisingly well)
function keyPressed(){

  for(let k in keys){

    k = parseInt(k);

    if(keyCode === k){

      keys[k].pressed = true;

      if(keys[k].pressed && !keys[k].fired){
        keys[k].callback();
      }

      // holding
      if(keys[k].pressed && keys[k].fired){}

    } else {
      keys[k].fired = false;
    }

  }

}

class Camera {

  constructor(){
    this.x = 0;
    this.y = 0;

    this.unit = gridSize;
  }

  up(){
    this.y = this.y - this.unit < 0 ? this.y : this.y - this.unit;
  }

  down(){
    this.y += this.unit;
  }

  left(){
    this.x = this.x - this.unit < 0 ? this.x : this.x - this.unit;
  }

  right(){
    this.x += this.unit;
  }

}
