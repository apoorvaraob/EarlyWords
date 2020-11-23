
let er1, er2, er3;
let tableData = [];
let def_data = [];
let tables = ['data/item_data.csv',
              'data/item_data-2.csv',
              'data/item_data-3.csv',
              'data/item_data-4.csv',
              'data/item_data-5.csv',
              'data/item_data-6.csv',
              'data/item_data-7.csv']

const MAX_EGGS = 20;
let eggs = [];
let index = 0;
let baby_sounds;
let egg_cracking;

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
  
  //egg_cracking.play();
  //baby_sounds.play();
  button = createButton("play");
  button.mousePressed(togglePlaying);

  createCanvas(640, 360);
  //song.loop(); // song is ready to play during setup() because it was loaded during preload
  for(i = 0; i < MAX_EGGS; i++){
    eggs.push(new Egg(width * random(1), height * random(1), random(0.25), random(80)));
  }

  for(i = 0; i < tables.length; i++){
    def_data.push(tableData[i].getColumn('definition'));
  }

  console.log("all words loaded");
  console.log(def_data);

}

function togglePlaying() {
  if(!baby_sounds.isPlaying()) {
    egg_cracking.play();
    egg_cracking.setVolume(1.0);
    baby_sounds.play();
    baby_sounds.setVolume(0.7);
    button.html("pause");
  } else {
    egg_cracking.pause();
    baby_sounds.pause();
    button.html("play")
  }

}

function getEggText(){
  language = round(random(tables.length));
  data = def_data[language];

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
  //background(0); // black
  //background(50, 89, 100); // teal
  background(255, 244, 79); // lemon yellow
  //console.log(eggs);
  for (i = 0; i< MAX_EGGS; i++){
    eggs[i].transmit();
  }

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
    //noStroke();
    //let c = color(212,175,55);
    //let c = color(random(255), random(255), random(255));
    //let c = color(201, 144, 31); // egg brown
    let c = color(255);
    fill(c); // gold

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
    frameRate(3);
    this.wobble();
    this.display();
    this.crack();
    this.hatch(); 
    }
}