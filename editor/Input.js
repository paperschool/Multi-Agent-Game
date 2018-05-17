
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
      camera.up();
    }
  },
  83 : { label:'s',pressed:false,fired:false,callback:function(){
      camera.down();
    }
  },
  65 : { label:'a',pressed:false,fired:false,callback:function(){
      camera.left();
    }
  },
  68 : { label:'d',pressed:false,fired:false,callback:function(){
      // console.log("RIGHT pressed")
      camera.right();
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
  },
  16 : { label:'shift',pressed:false,fired:false,callback:function(){
    }
  },
  73 : { label:'l',pressed:false,fired:false,callback:function(){
      imgGuide.up();
    }
  },
  75 : { label:'k',pressed:false,fired:false,callback:function(){
      imgGuide.down();
    }
  },
  74 : { label:'j',pressed:false,fired:false,callback:function(){
      imgGuide.left();
    }
  },
  76 : { label:'l ',pressed:false,fired:false,callback:function(){
      imgGuide.right();
    }
  },


}

// input system (works supprisingly well)
function keyPressed(){

  keys[16].pressed = false;

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
