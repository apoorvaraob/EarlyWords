const MAX_EGGS = 20;

let tableData = [];
let def_data = [];
let eggs = [];
let index = 0;
let baby_sounds;
let egg_cracking;
let amp;
let track_amplitude = [];
let rotationAngle = 1.0;
let planeAngle = 1.0;
let cam;
let delta = 0.01;
let wordAcquired;
let background_image; 

let tables = ['data/item_data.csv',
              'data/item_data-2.csv',
              'data/item_data-3.csv',
              'data/item_data-4.csv',
              'data/item_data-5.csv',
              'data/item_data-6.csv',
              'data/item_data-7.csv']

p5.disableFriendlyErrors = true;

function preload(){

  three_d_egg = loadModel('assets/3d_objects/white_egg_by_Andreas_Piel.obj');
  //grass = loadModel('assets/3d_objects/grass_low_poly.obj');
  egg_texture = loadImage('assets/3d_objects/egg_texture.png');
  grass_texture = loadImage('assets/3d_objects/grass_texture.jpg');
  //background_image = loadImage('assets/images/stock_characters.png');

  // Audio
  soundFormats('mp3');
  baby_sounds = loadSound('assets/sounds/baby_babbling.mp3');
  egg_cracking = loadSound('assets/sounds/eggs_cracking.mp3');

  // Data
  for(i = 0; i < tables.length; i++){
    tableData.push(loadTable(tables[i], 'csv', 'header'));
  }

  // Latin based Fonts
  eggTextFont = loadFont('assets/fonts/pizza/PizzaismyFAVORITE.ttf');
  //eggTextFont = loadFont('assets/fonts/kindergarden/Kindergarden.ttf');
  //eggTextFont = loadFont('assets/fonts/acki-preschool/AckiPreschool.ttf');
  //eggTextFont = loadFont('assets/fonts/two-turtle-doves/doves.ttf');
  //eggTextFont = loadFont('assets/fonts/moms-crafter-font/MomsCrafter-gxBE4.ttf')

}

function setup() {

  console.log("pre load complete");


  // Start sound
  button = createButton("play");
  button.mousePressed(togglePlaying);
  amp = new p5.Amplitude();

  // Start drawing
  createCanvas(windowWidth, windowHeight-25, WEBGL);
  //background_image.resize(windowWidth, windowHeight-25);

  // Get data
  for(i = 0; i < tables.length; i++){
    def_data.push(tableData[i].getColumn('definition'));
  }

  console.log("all words loaded");
  console.log(def_data);

  // Text
  textFont(eggTextFont);
  textSize(60);
  
  // non-interactive version. 
  /*
  cam = createCamera();
  // set initial pan angle
  cam.pan(-0.6);
  */

  wordAcquired = createGraphics(200, 200);
  wordAcquired.background(egg_texture);
  wordAcquired.fill(255, 100);
  wordAcquired.textAlign(CENTER);
  wordAcquired.textSize(20);
  wordAcquired.text('new word', 100, 150); 
  
}

function togglePlaying() {
  // Play or pause 
  if(!baby_sounds.isPlaying()) {
    egg_cracking.loop();
    egg_cracking.setVolume(1.0);
    baby_sounds.loop();
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

  /*
  if(language == 1 
    || language == 3 
    || language == 4 
    || language == 5 
    || language == 6){
    textFont(eggTextFont);
  } else {
    textFont();
  }
  */
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

  frameRate(5);
  
  //background(255, 244, 79); // lemon yellow
  background(135, 206, 235); // sky blue
  //background(background_image);

  rectMode(CENTER);
  ambientLight(255);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  pointLight(250, 250, 250, locX, locY, 50);

  for (i = 0; i< MAX_EGGS; i++){
    make3DEgg();
    //makeLawnWithEffects();
    addWordsToCanvas();
  }

  // Lawn
  makeLawnWithEffects();

  // zoom in and out with mouse movement along X axis
  let fov = map(mouseX, 0, width, 0, PI);
  let cameraZ = (height / 2.0)/ tan ((PI/3)/2);
  perspective(fov, width / height, cameraZ / 10.0, cameraZ * 10.0);

  /*
  let camX = map(mouseX, 0, width, -200, 0);
  camera(camX, 0, (height/2)/tan(PI/6), camX, 0, 0, 0, 1, 0);
  */

  /*
  // pan camera according to angle 'delta'
  cam.pan(delta);

  // every 160 frames, switch direction
  if (frameCount % 100 === 0) {
    delta *= -1;
  }
  rotateX(frameCount * 0.01);

  */
}

function makeLawnWithEffects() {
  //var vol = amp.getLevel();
  //track_amplitude.push(vol);

  rotateZ(planeAngle);
  push();
  scale(1);
  noStroke();
  texture(grass_texture);
  sphere(100, 50);
  pop();

}

function make3DEgg() {
  push();
  let eggLoc = createVector(random(-200,200), random(-200,200), random(-200,200));
  translate(eggLoc);
  scale(3);
  noStroke();

  rotateX(rotationAngle);
  rotateY(rotationAngle * 0.3);
  rotateZ(rotationAngle * 1.2);
  rotationAngle += 0.003;
  
  //pass image as texture
  //texture(egg_texture);
  
  texture(wordAcquired);
  model(three_d_egg);


  pop();
}

function addWordsToCanvas() {
  push();
  let c = color(random(255),random(255),random(255));
  fill(c);
  text(getEggText(), random(-300, 300), random(-300, 300));
  pop();
}
