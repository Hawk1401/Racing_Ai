let car = [];
let god;
let track;
let img;
let num = 50;
let button1; // Next Generation
let button2; // Editor Mode
let button3; // Driving Mode
var lSlider;
let editorMode;
let randomTrack = true;
let innerTrack = [];
let outertrack = [];

function preload() {
  img = loadImage("http://localhost:8000/image/car.png");
}
//reday
function setup() {
  button1 = createButton("Next Generation");
  button1.position(20, 20);
  button1.mousePressed(forceNextGen);

  button2 = createButton("Editor Mode");
  button2.position(20, 50);
  button2.mousePressed(edit);

  button3 = createButton("Driving Mode");
  button3.position(-100, -100);
  button3.mousePressed(stopEdit);

  lSlider = createSlider(0, 0.3, 0.05, 0.001);
  lSlider.position(20, 80);

  editorMode = false;
  this.n = 0;
  this.gen = 0;
  createCanvas(1800, 900);
  track = new Track(20);
  god = new Ga();
  let x1y1 = track.startX();
  for (let i = 0; i < num; i++) {
    car[i] = new Car(x1y1.x, x1y1.y);
  }
  angleMode(DEGREES);
  rectMode(CENTER);
  imageMode(CENTER);
}

function draw() {
  if (editorMode) {
    track.createTrack();
  }

  if (editorMode === false) {
    if (allDead()) {
      let x1y1;
      if (randomTrack) {
        x1y1 = track.startX();
      } else {
        x1y1 = track.getStartXy();
      }
      this.n = 0;
      let fitnis = [];
      let newcar = [];
      for (let i = 0; i < num; i++) {
        fitnis[i] = car[i].calcFitnis();
      }
      let best = god.getFintnis(fitnis);
      newcar[0] = new Car(x1y1.x, x1y1.y);
      newcar[0].getNewBrain(car[best].copy());
      newcar[0].beAlive();
      newcar[0].beBlue();
      for (let i = 1; i < num; i++) {
        let index = god.pickOne();
        newcar[i] = new Car(x1y1.x, x1y1.y);
        newcar[i].getNewBrain(car[index].copy());
        if (fitnis[best] == 0) {
          newcar[i].reset();
        } else {
          newcar[i].mutate();
        }
        newcar[i].beAlive();
      }

      for (let i = 0; i < num; i++) {
        car[i] = newcar[i];
        newcar[i] = null;
      }
      this.gen++;
    }

    background(255);
    fill(200);
    noStroke();
    let record = 0;
    let versuch = 0;
    let indexShow = 0;
    track.show(width / 2, height / 2);
    for (let i = 0; i < num; i++) {
      if (car[i].alive) {
        car[i].sensors();
        car[i].checkWall();
        car[i].checkPoint();
        car[i].update();
        car[i].show();
        //car[i].show();
        versuch = car[i].text;

        if (record <= versuch) {
          record = versuch;
          indexShow = i;
        }
      }
    }
    record--;
    this.n++;
    //car[indexShow].show();

    push();
    translate(width / 2, height / 2);
    rectMode(CENTER);

    let s1 = "checks poinst " + record;
    let s2 = "Steps " + this.n;
    let s3 = "Generation " + this.gen;
    let s4 = lSlider.value();
    fill(50);

    text(s1, 0, 0, 150, 30); // Text wraps within text box
    text(s2, 0, 30, 150, 30);
    text(s3, 0, 60, 150, 30);
    text(s4, 0, 90, 150, 30);
    pop();
  }
  //noLoop();
}

function allDead() {
  for (let i = 0; i < num; i++) {
    if (car[i].alive) {
      return false;
    }
  }
  return true;
}

function forceNextGen() {
  for (let i = 0; i < num; i++) {
    car[i].beDead();
  }
  console.log("work");
}

function edit() {
  console.log("work1");
  editorMode = true;
  randomTrack = false;
  button2.position(-100, -100);
  button3.position(20, 50);
  background(255);
}

function stopEdit() {
  button3.position(-100, -100);
  button2.position(20, 50);

  this.n = 0;
  this.gen = 0;
  god = new Ga();
  let x1y1 = track.getStartXy();
  for (let i = 0; i < num; i++) {
    car[i] = new Car(x1y1.x, x1y1.y);
  }
  let bb = track.getStartXy();
  console.log(bb.x);
  angleMode(DEGREES);
  rectMode(CENTER);
  imageMode(CENTER);

  editorMode = false;
}
