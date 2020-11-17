let er1, er2;

function setup() {
  createCanvas(640, 360);
  er1 = new EggRing(width*0.45, height*0.5, 0.1, 120);
  er2 = new EggRing(width*0.65, height*0.8, 0.05, 180);
}

function draw() {
  background(0);
  er1.transmit();
  er2.transmit();
}

class Egg {
  constructor(xpos, ypos, t, s) {
    this.x = xpos;
    this.y = ypos;
    this.tilt = t;
    this.scalar = s / 100.0;
    this.angle = 0.0;
  }

  wobble() {
    this.tilt = cos(this.angle) / 8;
    this.angle += 0.1;
  }

  display() {
    noStroke();
    fill(255);
    push();
    translate(this.x, this.y);
    rotate(this.tilt);
    scale(this.scalar);
    beginShape();
    vertex(0, -100);
    bezierVertex(25, -100, 40, -65, 40, -40);
    bezierVertex(40, -15, 25, 0, 0, 0);
    bezierVertex(-25, 0, -40, -15, -40, -40);
    bezierVertex(-40, -65, -25, -100, 0, -100);
    endShape();
    pop();
  }
}


class EggRing {
  constructor(x, y, t, sp) {
    this.x = x;
    this.y = y;
    this.t = t;
    this.sp = sp;
    this.ovoid = new Egg(this.x, this.y, this.t, this.sp);
  }

  transmit() {
    this.ovoid.wobble();
    this.ovoid.display();
  }
}
