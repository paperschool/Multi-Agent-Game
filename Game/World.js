

class World {

  constructor(w,h){

    this.size = new SAT.Vector(w,h)

    this.gridSize = 20;

    this.level = new Level(this.size.x/this.gridSize,this.size.y/this.gridSize,this.gridSize);

    this.poly = new SAT.Polygon(
      new SAT.Vector(200,200),
      [new SAT.Vector(100,100),
      new SAT.Vector(100,200),
      new SAT.Vector(200,200),
      new SAT.Vector(200,100)]
    )

    this.poly.setAngle(Utility.Radians(0))

    this.angle = 0;

  }

  update(deltaTime){
    // this.level.update(deltaTime);
  }

  draw(){

    Draw.clear(0,0,1000,1000);

    Draw.fill(51,255,255,1.0);
    Draw.rect(0,0,this.size.x,this.size.y);


    var V = SAT.Vector;
    var P = SAT.Polygon;

    // A square
    var polygon1 = new P(new V(100,100), [
      new V(100,100), new V(100,200), new V(200,200), new V(200,100)
    ]);
    // A triangle
    var polygon2 = new P(new V(30,0), [
      new V(0,0), new V(30, 0), new V(0, 30)
    ]);
    var response = new SAT.Response();
    var collided = SAT.testPolygonPolygon(polygon1, polygon2, response);

    Draw.fill(100,200,45,1.0);
    Draw.polygonOutline(polygon1.getPoints());
    Draw.polygonOutline(polygon2.getPoints());




    // var V = SAT.Vector;
    // var C = SAT.Circle;
    // var P = SAT.Polygon;
    //
    // var polygon1 = new P(new V(100,100), [
    //   new V(50,50),
    //   new V(150,50),
    //   new V(150,150),
    //   new V(50,150)
    // ]);
    //
    // Draw.fill(100,200,45,1.0);
    // Draw.polygon(polygon1.getPoints());
    //
    // Draw.fill(255,0,0,1.0);
    // Draw.circle(100,100,20);
    //
    // var polygon2 = new P(new V(mousePos.x,mousePos.y), [
    //   new V(mousePos.x - 30,mousePos.y - 30),
    //   new V(mousePos.x + 30,mousePos.y - 30),
    //   new V(mousePos.x + 30,mousePos.y + 30),
    //   new V(mousePos.x - 30,mousePos.y + 30)
    // ]);
    //
    // Draw.fill(200,100,45,1.0);
    //
    // if(SAT.testPolygonPolygon(polygon1, polygon2)){
    //   Draw.fill(5,5,200,1.0);
    // }
    //
    // Draw.polygon(polygon2.getPoints());
    //
    // // this.level.draw();


  }

}
