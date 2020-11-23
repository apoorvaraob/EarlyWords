const MAX_EGGS = 20;

let tableData = [];
let def_data = [];
let eggs = [];
let index = 0;
let baby_sounds;
let egg_cracking;
let amp;
let track_amplitude = [];

let tables = ['data/item_data.csv',
              'data/item_data-2.csv',
              'data/item_data-3.csv',
              'data/item_data-4.csv',
              'data/item_data-5.csv',
              'data/item_data-6.csv',
              'data/item_data-7.csv']

p5.disableFriendlyErrors = true;

function preload(){
  soundFormats('mp3');
  baby_sounds = loadSound('assets/baby_babbling.mp3');
  egg_cracking = loadSound('assets/eggs_cracking.mp3');

  for(i = 0; i < tables.length; i++){
    tableData.push(loadTable(tables[i], 'csv', 'header'));
  }
}

function setup() {
  console.log("pre load complete");

  // Start sound
  button = createButton("play");
  button.mousePressed(togglePlaying);
  amp = new p5.Amplitude();

  // Start drawing
  createCanvas(640, 360);
  
  for(i = 0; i < MAX_EGGS; i++){
    eggs.push(new Egg(width * random(1), height * random(1), random(0.25), random(80)));
  }

  // Get data
  for(i = 0; i < tables.length; i++){
    def_data.push(tableData[i].getColumn('definition'));
  }

  console.log("all words loaded");
  console.log(def_data);

}

function togglePlaying() {
  // Play or pause 
  if(!baby_sounds.isPlaying()) {
    egg_cracking.play();
    egg_cracking.setVolume(1.0);
    baby_sounds.play();
    baby_sounds.setVolume(0.7);
    button.html("pause");
    loop();
  } else {
    egg_cracking.pause();
    baby_sounds.pause();
    button.html("play")
    noLoop();

  }

}

function getEggText(){
  language = round(random(tables.length));
  data = def_data[language];

  // Get around browser limitations
  if (index <= 100) {
    index++;
    if( typeof data === "undefined")
    { 
      return "gaga";
    } else {
      return data[index];
    }
  } else {
    index = 0; 
    return "aaaa";
  }
} 

function draw() {

  background(255, 244, 79); // lemon yellow

  // Eggs
  for (i = 0; i< MAX_EGGS; i++){
    eggs[i].transmit();
  }

  // Lawn
  plotSoundVisualization();

}

function plotSoundVisualization() {
  var vol = amp.getLevel();
  track_amplitude.push(vol);
  stroke(14, 164, 79);
  strokeWeight(3);
  beginShape();

  // Use amplitude to determine the height of the grass
  for (var i = 0; i < track_amplitude.length; i++) {
    fill(154, 195, 69);
    var y = map(track_amplitude[i], 0, 1, height, 0);
    vertex(i, y);
  }
  endShape();

  if(track_amplitude.length > width) {
    // Get rid of the oldest point and add 
    // a new one when we reach the end of the canvas
    track_amplitude.splice(0, 1);
  }
  
  stroke(123, 41, 167);

  // vertical line marks where we are. 
  line(track_amplitude.length, 0, track_amplitude.length, height);
  
  //ellipse(100, 100, 200, vol*200);
}

class Egg {
  constructor(xpos, ypos, t, s) {
    this.x = xpos;
    this.y = ypos;
    this.tilt = t;
    this.scalar = s / 100.0;
    this.angle = 0.0;
    this.cracked = false;
    this.hatched = false;
    this.wobbling = true;
    this.tiltRight = 0.2;
    this.tiltLeft = -0.2;
    this.eggText = "";

  }

  wobble() {

    this.tilt = cos(this.angle) / 4;
    this.angle += 0.2;
    
  }

  
  crack() {

    push();
    this.wobbling = false;
    this.cracked = true;
    pop();
    
  }

  hatch() {

    push();

    if(this.cracked){
      this.tiltRight = cos(this.angle + random(1)) / 4;
      this.tiltLeft = -cos(this.angle + random(1)) / 4;

    }
    this.cracked = true;
    this.hatched = true;
    this.wobbling = false;
    
    let c = color(random(255),random(255),random(255));
    fill(c);
    this.eggText = getEggText();
    text(this.eggText, this.x - 15, this.y - 25);

    pop();


  }

  display() {
    noStroke();
    let c = color(255);
    fill(c); 
    push();
    this.eggText = "";
    translate(this.x, this.y);
    rotate(this.tilt);
    scale(this.scalar);
    beginShape();
    rotate(this.tiltLeft);
    
    vertex(0, -100);
    bezierVertex(25, -100, 40, -65, 40, -40);
    bezierVertex(40, -15, 25, 0, 0, 0);  
    vertex(0, 0); 
    vertex(15, -15);
    vertex(-10, -30); 
    vertex(20, -50);
    vertex(-13, -63);
    vertex(0,-100); 
    endShape();

    rotate(this.tiltRight);
    beginShape();
    vertex(0, 0);
    bezierVertex(-25, 0, -40, -15, -40, -40);
    bezierVertex(-40, -65, -25, -100, 0, -100);
    vertex(0, 0);
    vertex(15, -15);
    vertex(-10, -30); 
    vertex(20, -50);
    vertex(-13, -63);
    vertex(0, -100);

    erase();
    vertex(0, 0);
    vertex(0, -100);
    noErase();
    
    endShape();

    this.cracked = false;
    this.hatched = false;

    pop();


  }

  transmit() {
    frameRate(5);
    this.wobble();
    this.display();
    this.crack();
    this.hatch(); 
    }
}