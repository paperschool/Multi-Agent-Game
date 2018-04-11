class EngineSounds {

  constructor(){

    this.sounds = {};

    this.isMute = false;

  }

  mute(){
    this.isMute = true;
  }

  unmute(){
    this.isMute = false;
  }

  add(label,path,volume = 0.1,loop = false,autoplay = false){

    if(label === null || label === '' || typeof label === 'undefined') return -1;
    if(path === null || path === '' || typeof path === 'undefined') return -1;

    this.sounds[label] = new Howl({
      src: [
        path
      ],
      loop:loop,
      autoplay:autoplay,
      volume:volume
    });

  }

  play(label,delay){
    if(!this.isMute){
      if(label === null || label === '' || typeof label === 'undefined') return -1;
      this.sounds[label].play();
    }
  }

  stop(label){
    if(label === null || label === '' || typeof label === 'undefined') return -1;
    this.sounds[label].stop();
  }

  stopAll(){
    for(let sound in this.sounds){
      this.sounds[sound].stop();
    }
  }

}
