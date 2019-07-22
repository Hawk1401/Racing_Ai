class Car {
  constructor(x, y) {
    this.steps = 0;
    this.pos = createVector(x + 1 + width / 2, y + 1);
    this.v0 = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.checks = 1;
    this.up = createVector(0, 100);
    this.angel = 0;
    this.alive = true;
    this.outputSensor = [];
    this.brain = new NeuralNetwork(10, 18, 12, 5, 0.05); //update1
    this.stepsMax = 35000;
    this.antiBug = 0;
    this.velMax = 7;
  }

  update() {
    let deg;
    let target = this.brain.feedForward(this.outputSensor);

    //console.log(this.outputSensor);
    if (this.alive) {
      let friction = 0.0003;
      this.angel = this.angel % 360;
      switch (target) {
        case 0:
          deg = map(this.vel.mag(), 0, this.velMax, 5, 0.8);
          this.angel -= deg;
          this.vel.rotate(-deg);
          this.acc.rotate(-deg);
          break;
        case 1:
          deg = map(this.vel.mag(), 0, this.velMax, 5, 0.8);
          this.angel += deg;
          this.vel.rotate(deg);
          this.acc.rotate(deg);
          break;
        case 2:
          this.accelerate();
          break;
        case 3:
          friction = this.brake();
          this.antiBug++;
          // push();
          // translate(this.pos.x, this.pos.y);
          // stroke(255, 0, 255);
          // line(0, 0, this.sensor[0].x, this.sensor[0].y);
          // noStroke();
          // pop();
          break;
        case 4:
          this.acc.mult(0);
          // push();
          // translate(this.pos.x, this.pos.y);
          // stroke(255, 0, 0);
          // line(0, 0, this.sensor[0].x, this.sensor[0].y);
          // noStroke();
          // pop();
          break;
        default:
          break;
      }

      this.acc.limit(0.06);
      this.vel.add(this.acc);
      this.fri = this.vel.copy();
      this.fri.normalize();
      this.fri.mult(-1);
      this.fri.mult(friction);
      this.vel.add(this.fri);

      this.vel.limit(this.velMax);
      this.pos.add(this.vel);
      if (this.vel.mag() <= 0.05) {
        this.antiBug++;
        if (this.antiBug >= 15) {
          this.alive = false;
          console.log("antibug");
        }
      } else {
        this.antiBug = 0;
      }
      this.steps++;
      if (this.steps > this.stepsMax) {
        this.alive = false;
        console.log("zu spät");
      }
    }
  }
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angel);
    if (this.Blue) {
      tint(200, 250, 255, 255);
    } else {
      tint(255, 255, 255, 155);
    }
    image(img, 0, 0, 15, 30);
    pop();
  }
  sensors() {
    // five sensor

    this.sensor = [p5.Vector.fromAngle(radians(90 + this.angel), 550)]; //vorne
    this.sensor[1] = p5.Vector.fromAngle(radians(-20 + 90 + this.angel), 550); //links vorne
    this.sensor[2] = p5.Vector.fromAngle(radians(+20 + 90 + this.angel), 550); // rechts vorne
    this.sensor[3] = p5.Vector.fromAngle(radians(-10 + 90 + this.angel), 550); //links vorne
    this.sensor[4] = p5.Vector.fromAngle(radians(+10 + 90 + this.angel), 550); // rechts vorne
    this.sensor[5] = p5.Vector.fromAngle(radians(-30 + 90 + this.angel), 550); //links vorne
    this.sensor[6] = p5.Vector.fromAngle(radians(+30 + 90 + this.angel), 550); // rechts vorne
    this.sensor[7] = p5.Vector.fromAngle(radians(-90 - 90 + this.angel), 550); // links
    this.sensor[8] = p5.Vector.fromAngle(radians(+90 - 90 + this.angel), 550); // rechts

    /*push();
    translate(this.pos.x, this.pos.y);
    stroke(255, 0, 0);
    for (let i = 0; i < this.sensor.length; i++) {
      line(0, 0, this.sensor[i].x, this.sensor[i].y);
    }
    //line(0, 0, this.sensor[4].x, this.sensor[4].y);
    noStroke();
    pop();*/
  }
  checkPoint() {
    let y1 = this.pos.y;
    let x1 = this.pos.x;
    for (let i = 0; i < this.sensor.length; i++) {
      let x2 = this.pos.x + this.sensor[i].x;
      let y2 = this.pos.y + this.sensor[i].y;

      let c3 = this.inner[this.checks % this.outer.length];
      let c4 = this.outer[this.checks % this.outer.length];

      let x3 = c3.x;
      let y3 = c3.y;
      let x4 = c4.x;
      let y4 = c4.y;

      let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      if (!(den == 0)) {
        let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if (u < 1 && u > 0 && t < 1 && t > 0) {
          let ptx = x1 + t * (x2 - x1);
          let pty = y1 + t * (y2 - y1);
          let versuch = createVector(ptx, pty);
          versuch.sub(this.pos);

          if (7.5 > versuch.mag()) {
            this.checks++;
            if (this.checks >= track.getSteps() + track.getSteps() + 1) {
              console.log("ziel");
              this.alive = false;
              this.goal = true;
            }
            return;
          }
        }
      }
    }
  }
  checkWall() {
    this.outer = track.getOuter();
    this.inner = track.getInner();
    const round = track.getSteps();

    let a = 0;
    let first = true;
    let i = 0;

    let x1 = this.pos.x;
    let y1 = this.pos.y;

    /*stroke(255, 0, 0);
    strokeWeight(4);

    let ac3 = this.inner[17];
    let ac4 = this.inner[0];
    let ax3 = ac3.x;
    let ay3 = ac3.y;
    let ax4 = ac4.x;
    let ay4 = ac4.y;
    line(ax3, ay3, ax4, ay4);

    stroke(0);
    strokeWeight(1);*/
    const distance = 22;
    for (let b = 0; b < this.sensor.length; b++) {
      let x2 = this.pos.x + this.sensor[b].x;
      let y2 = this.pos.y + this.sensor[b].y;

      for (let j = 0; j < distance; j++) {
        let c3;
        let c4;
        let pos = this.checks % (round - 1);
        let wallsPoints = pos - 3 + (j % (distance / 2));
        if (wallsPoints <= -1) {
          wallsPoints = this.outer.length + wallsPoints;
        }
        wallsPoints = wallsPoints % this.outer.length;

        if (j < distance / 2) {
          c3 = this.inner[wallsPoints];
          c4 = this.inner[(wallsPoints + 1) % this.outer.length];
        } else {
          c3 = this.outer[wallsPoints];
          c4 = this.outer[(wallsPoints + 1) % this.outer.length];
        }
        let x3 = c3.x;
        let y3 = c3.y;
        let x4 = c4.x;
        let y4 = c4.y;
        i++;

        //zeichen der wände die untersucht werden

        stroke(255, 0, 0);
        line(x3, y3, x4, y4);
        //line(x1, y1, x2, y2);
        stroke(0);
        strokeWeight(1);

        let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        let u;
        let t;
        if (den != 0) {
          t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
          u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        }

        if (u < 1 && u > 0 && t < 1 && t > 0) {
          let ptx = x1 + t * (x2 - x1);
          let pty = y1 + t * (y2 - y1);
          if (first) {
            this.record = createVector(ptx, pty);
            first = false;
          } else {
            let versuch = createVector(ptx, pty);
            let disRecord = this.record.copy();
            disRecord.sub(this.pos);
            let disVersuch = versuch.copy();
            disVersuch.sub(this.pos);
            if (disRecord.mag() > disVersuch.mag()) {
              this.record = versuch;
            }
          }
        }
      }

      a++;
      fill(0, 0, 255);
      if (!(this.record == null)) {
        //ellipse(this.record.x, this.record.y, 15, 15);
        this.record.sub(this.pos);
        if (this.record.mag() < 7.5) {
          this.alive = false;
          return;
        } else {
          this.outputSensor[b] = this.record.mag() / 550;
        }
      } else {
        this.outputSensor[b] = 0;
      }
    }
    this.outputSensor[9] = this.vel.mag() / this.velMax;
  }

  brake() {
    if (this.vel.mag() < 0.007) {
      this.vel.mult(0);
    } else {
      return 0.006;
    }
  }
  accelerate() {
    this.up1 = this.up.copy();
    this.acc.add(this.up1.rotate(this.angel));
  }
  calcFitnis() {
    if (this.goal) {
      let val = map(this.steps, 0, this.stepsMax, this.stepsMax, 0);
      return val * val * val + this.checks * this.checks * this.checks;
    } else {
      if (this.checks == 1) {
        return 0;
      }
      return this.checks * this.checks * this.checks;
    }
  }
  mutate() {
    this.brain.mutate();
  }
  reset() {
    this.brain.reSet();
  }
  copy() {
    return this.brain.copy();
  }
  getNewBrain(brain) {
    this.brain = brain;
  }
  beAlive() {
    this.alive = true;
    this.Blue = false;
    this.brain.setLearningRate(lSlider.value());
  }

  beDead() {
    this.alive = false;
    console.log("sirb");
  }

  dead() {
    if (this.alive) {
      return false;
    } else {
      return true;
    }
  }
  beBlue() {
    this.Blue = true;
  }
  get text() {
    return this.checks;
  }
}
