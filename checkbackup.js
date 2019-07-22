check(x, y) {
    this.outer = track.getOuter();
    this.inner = track.getInner();
    let a = 0;
    let first = true;
    let i = 0;
    this.record = null;

    let x1 = this.pos.x;
    let x2 = this.pos.x + x;
    let y1 = this.pos.y;
    let y2 = this.pos.y + y;

    for (let j = 0; j < 360 * 2; j += track.points) {
      let c3;
      let c4;
      if (j == 360) {
        i = 0;
      }
      if (j < 360) {
        c3 = this.inner[i];
        c4 = this.inner[(i + 1) % this.inner.length];
      } else {
        c3 = this.outer[i];
        c4 = this.outer[(i + 1) % this.outer.length];
      }
      let x3 = c3.x;
      let y3 = c3.y;
      let x4 = c4.x;
      let y4 = c4.y;
      i++;
      fill(255, 0, 0);
      ellipse(c3.x, c3.y, 5, 5);

      let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      if (den == 0) {
        return null;
      }
      let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
      let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

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
    if (this.record == null) {
      return null;
    } else {
      ellipse(this.record.x, this.record.y, 15, 15);
      this.record.sub(this.pos);
      if (this.record.mag() < 7.5) {
        this.dead = true;
        return;
      } else {
        return this.record.mag();
      }
    }