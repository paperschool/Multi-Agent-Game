var GameState = {
  START_STATE:0,
  PLAY_STATE:1,
  GAMEOVER_STATE:2,
  VICTORY_STATE:3,
  PAUSE_STATE:4
}


var ParticleType = {
  GENERIC :0,
  BURN    :1,
  SMOKE   :2,
  BLOOD   :3,
  DEBRIS  :4
}

var AgentType = {
  GENERIC:"generic",
  FOLLOW:"follow",
  WANDERING:"wander",
  TRACE:"trace"
}

var AgentPathFindingFocus = {
  PLAYER:"player",
  NEARPLAYER:"nplayer",
  OLDPLAYER:"oplayer",
  WANDER:"wander",
  PATROL:"patrol"
}

var ColliderType = {
  GENERIC:"generic",
  POINT  :"point",
  CIRCLE :"circle",
  BOX    :"box",
  POLYGON:"polygon"
}

var PickupType = {

  GENERIC:"generic",
  HEALTH:"hp",
  GUN:"gun",
  PISTOL:"pistol",
  SHOTGUN:"shotgun",
  MACHINEGUN:"machinegun",
  FLAMETHROWER:"flamethrower"

}

var BulletType = {
  GENERIC:"generic",
  PISTOL:"pistol",
  SHOTGUN:"shotgun",
  MACHINEGUN:"machinegun",
  FLAMETHROWER:"flamethrower",

}

var DefaultColours = {
  TURQUIOSE:"#1abc9c",
  GREENSEA:"#16a085",
  EMERALD:"#2ecc71",
  TEAL:"#27ae60",
  RIVER:"#3498db",
  OCEAN:"#2980b9",
  PURPLE:"#9b59b6",
  DARKPURPLE:"#8e44ad",
  ASPHALT:"#34495e",
  MIDNIGHT:"#2c3e50",
  SUNFLOWER:"#f1c40f",
  ORANGE:"#f39c12",
  CARROT:"#e67e22",
  PUMPKIN:"#d35400",
  RUBY:"#e74c3c",
  POMEGRANATE:"#c0392b",
  CLOUD:"#ecf0f1",
  SLIVER:"#bdc3c7",
  CONCRETE:"#95a5a6",
  FLAT:"#7f8c8d"
}
