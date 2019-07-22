class Track {
  constructor(steps) {
    this.steps = steps;
    this.pressed = true;
    this.setInner = true;
    this.setOuter = false;
    this.setcar = false;
    this.releast = false;
    this.startXY = createVector(0, 0);
    //inner
  }
  startX() {
    let xoff = map(cos(0), -1, 1, 0, 3);
    let yoff = map(sin(0), -1, 1, 0, 3);
    let r = map(noise(xoff, yoff), 0, 1, 200, 380);
    return createVector((r + 230 + 40) * cos(0), height / 2);
  }
  show(posx, posy) {
    if (randomTrack) {
      push();
      translate(posx, posy);
      beginShape();
      noFill();
      stroke(1);
      //inner
      for (let i = 0; i < 360; i += this.steps) {
        let xoff = map(cos(i), -1, 1, 0, 3);
        let yoff = map(sin(i), -1, 1, 0, 3);
        let r = map(noise(xoff, yoff), 0, 1, 200, 380);
        let x = (r + 230) * cos(i);
        let y = r * sin(i);
        vertex(x, y);
      }
      endShape(CLOSE);
      beginShape();
      noFill();
      stroke(0);
      //outer
      for (let i = 0; i < 360; i += this.steps) {
        let xoff = map(cos(i), -1, 1, 0, 3);
        let yoff = map(sin(i), -1, 1, 0, 3);
        let r = map(noise(xoff, yoff), 0, 1, 200, 380);
        let x = (r + 230 + 80) * cos(i);
        let y = (r + 80) * sin(i);
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
    } else {
      //push();
      //translate(width / 2, height / 2);
      beginShape();
      fill(155);
      for (let i = 0; i < outertrack.length; i++) {
        let ex = outertrack[i];
        vertex(ex.x, ex.y);
      }
      endShape(CLOSE);
      beginShape();
      fill(255);
      for (let i = 0; i < innerTrack.length; i++) {
        let ex = innerTrack[i];
        vertex(ex.x, ex.y);
      }
      endShape(CLOSE);
      //pop();
    }
  }
  get points() {
    return this.steps;
  }
  getInner() {
    if (randomTrack) {
      let inner = [];
      let j = 0;
      for (let i = 0; i < 360; i += this.steps) {
        let xoff = map(cos(i), -1, 1, 0, 3);
        let yoff = map(sin(i), -1, 1, 0, 3);
        let r = map(noise(xoff, yoff), 0, 1, 200, 380);
        let x = width / 2 + (r + 230) * cos(i);
        let y = height / 2 + r * sin(i);
        inner[j] = createVector(x, y);
        j++;
      }
      return inner;
    }
    return innerTrack;
  }
  getOuter() {
    if (randomTrack) {
      let outer = [];
      let j = 0;
      for (let i = 0; i < 360; i += this.steps) {
        let xoff = map(cos(i), -1, 1, 0, 3);
        let yoff = map(sin(i), -1, 1, 0, 3);
        let r = map(noise(xoff, yoff), 0, 1, 200, 380);
        let x = width / 2 + (r + 230 + 80) * cos(i);
        let y = height / 2 + (r + 80) * sin(i);
        outer[j] = createVector(x, y);
        j++;
      }
      return outer;
    }
    return outertrack;
  }
  createTrack() {
    if (this.setInner) {
      if (mouseIsPressed) {
        if (mouseButton === LEFT) {
          if (this.pressed === false) {
            if (innerTrack.length >= 1) {
              let end = innerTrack[0];
              fill(0, 0, 255, 155);
              let last = innerTrack[innerTrack.length - 1];
              ellipse(end.x, end.y, 50, 50);
              ellipse(mouseX, mouseY, 10, 10);
              stroke(0);
              line(mouseX, mouseY, last.x, last.y);
              let hit = collideCircleCircle(
                mouseX,
                mouseY,
                10,
                end.x,
                end.y,
                50
              );
              if (hit) {
                this.setInner = false;
                this.setOuter = true;
                pop();
                console.log("Hit");
                this.pressed = true;
                this.steps = innerTrack.length;
                return null;
              }
            }
            innerTrack.push(createVector(mouseX, mouseY));
            this.pressed = true;
          }
        }
      } else {
        console.log("1");
        this.pressed = false;
      }
    }
    if (this.setOuter) {
      if (mouseIsPressed) {
        if (mouseButton === LEFT) {
          if (this.pressed === false) {
            if (outertrack.length >= 1) {
              let end = outertrack[0];
              //push();
              //translate(width / 2, height / 2);
              fill(255, 0, 0, 155);

              let last = outertrack[outertrack.length - 1];

              ellipse(end.x, end.y, 50, 50);
              /*ellipse(mouseX - width / 2, mouseY - height / 2, 10, 10);

              stroke(0);
              line(mouseX - width / 2, mouseY - height / 2, last.x, last.y);*/

              //pop();

              ellipse(mouseX, mouseY, 10, 10);

              stroke(0);
              line(mouseX, mouseY, last.x, last.y);
              if (outertrack.length == innerTrack.length) {
                this.setOuter = false;
                this.setcar = true;
                this.pressed = true;
                //pop();
                console.log("Hit");
                return null;
              }
            }
            outertrack.push(
              //createVector(mouseX - width / 2, mouseY - height / 2)
              createVector(mouseX, mouseY)
            );
            if (outertrack.length - 1 > 0) {
              fill(0, 255, 0);
              let check = innerTrack[outertrack.length - 1];
              ellipse(check.x, check.y, 10, 10);
            }
            this.pressed = true;
          }
        }
      } else {
        console.log("1");
        this.pressed = false;
      }
    }
    if (this.setcar) {
      if (mouseIsPressed) {
        if (mouseButton === LEFT) {
          if (this.pressed === false) {
            let start = this.startXY;
            strokeWeight(0);
            fill(255);
            rect(start.x, start.y, 16, 31);
            this.startXY = createVector(mouseX, mouseY);
            image(img, mouseX, mouseY, 15, 30, 1);
            strokeWeight(1);
            this.setcar = false;
          }
        }
        this.pressed = true;
      } else {
        this.pressed = false;
      }
    }
  }
  getStartXy() {
    let start = this.startXY.copy();
    console.log(start);
    return createVector(start.x - width / 2, start.y);
  }
  getSteps() {
    if (randomTrack) {
      return 360 / this.steps;
    }
    return this.steps;
  }
}
