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
let cam;
let delta = 0.01;
let wordAcquired;
let background_image; 

let tables = ['data_Stanford_WordBank_Nov2020/kigiriama.csv', //1
              'data_Stanford_WordBank_Nov2020/chinese.csv', //2
              'data_Stanford_WordBank_Nov2020/croatian.csv', //3
              'data_Stanford_WordBank_Nov2020/english.csv', //4
              'data_Stanford_WordBank_Nov2020/norwegian.csv', //5
              'data_Stanford_WordBank_Nov2020/russian.csv', //6
              'data_Stanford_WordBank_Nov2020/german.csv'] //7

p5.disableFriendlyErrors = true;

function preload(){

  three_d_egg = loadModel('assets/3d_objects/white_egg_by_Andreas_Piel.obj');
  egg_texture = loadImage('assets/3d_objects/egg_texture.png');
  grass_texture = loadImage('assets/3d_objects/grass_texture.jpg');
  background_image = loadImage('assets/images/stock_characters.png');

  // Audio
  soundFormats('mp3');
  baby_sounds = loadSound('assets/sounds/baby_babbling.mp3');
  egg_cracking = loadSound('assets/sounds/eggs_cracking.mp3');

  // Data
  for(i = 0; i < tables.length; i++){
    tableData.push(loadTable(tables[i], 'csv', 'header'));
  }

  // Japanese fonts for the most coverage
  //eggTextFont = loadFont('assets/fonts/Noto_Sans_JP/NotoSansJP-Light.otf');
  eggTextFont = loadFont('assets/fonts/chi_jyun/ちはや純.ttf')

}

function setup() {

  console.log("pre load complete");


  // Start sound
  button = createButton("play");
  button.mousePressed(togglePlaying);
  amp = new p5.Amplitude();

  // Start drawing
  createCanvas(windowWidth, windowHeight-25, WEBGL);

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

  //wordAcquired = createGraphics(200, 200);
  //wordAcquired.background(background_image);
  //wordAcquired.fill(255, 100);
  //wordAcquired.textAlign(CENTER);
  //wordAcquired.textSize(20);
  //wordAcquired.text('new word', 100, 150); 
  
  let title = createP('Early Words');
  let shortIntro = createP('\'Early words\' is an abstract model of the fascinating language acquisition process of 18 to 36 month olds. It aims to cast light on word comprehension and production. The data used is intentionally cross-linguistic to serve as a reminder that multiple languages can be acquired simultaneously in the same abstract space of the mind and be enriched by it. ');
  let description = createP('This piece is an encounter with human first sounds and words. The words displayed are filtered by age, but not by language.  Eggs hatch to reveal words acquired by the hypothetical multilingual toddler. The words occupy a space above the grassy globe made out of the sounds of babbling. Today, out of approximately seven thousand known languages, only a handful are dominant. Words from all languages are valued equally in this abstract space.'); 
  let dataSource = createP('Primary data source: Frank, M. C., Braginsky, M., Yurovsky, D., & Marchman, V. A. (2016). Wordbank: An open repository for developmental vocabulary data. Journal of Child Language. doi: 10.1017/S0305000916000209.');
  let howToInteract = createP('The animation will begin as soon as you open the window. To interact with the app, use your mouse pointer to change the direction of a point light source. Move the mouse pointer horizontally to step away from and towards the scene. Click the play button to hear babbling and watch the globe change in size according to the volume.');

  title.class('title');
  shortIntro.class('artInfo');
  description.class('artInfo');
  dataSource.class('artInfo');
  howToInteract.class('artInfo');

  //OLD version
  //URL: https://shrouded-woodland-95521.herokuapp.com. There's a play and pause button for the sound and some animation, though it mostly runs in a p5.js loop. 
  
  //NEW version
  //URL: https://still-island-32738.herokuapp.com/. 
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

  // Get around browser limitations since raw data is large
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

  frameRate(3);
  
  //background(255, 244, 79); // lemon yellow
  background(135, 206, 235); // sky blue
  //background(background_image); // won't work in 3D. 

  rectMode(CENTER);
  ambientLight(255);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  pointLight(250, 250, 250, locX, locY, 50);

  for (i = 0; i< MAX_EGGS; i++){
    make3DEgg();
    addWordsToCanvas();
  }

  // Lawn
  makeLawnWithEffects();

  // zoom in and out with mouse movement along X axis
  let fov = map(mouseX, 0, width, 0, PI);
  let cameraZ = (height / 2.0)/ tan ((PI/3)/2);
  perspective(fov, width / height, cameraZ / 10.0, cameraZ * 10.0);

  /* // Other camera modes.
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
  var vol = amp.getLevel();
  push();
  scale(1);
  noStroke();
  texture(grass_texture);
  sphere(vol * 1000, 50, 50);
  pop();

}

function make3DEgg() {
  push();
  let eggLoc = createVector(random(-300,300), random(-300,300), random(-200,200));
  translate(eggLoc);
  scale(3);
  noStroke();

  rotateX(rotationAngle * 1.0);
  rotateY(rotationAngle * 0.5);
  rotateZ(rotationAngle * 0.7);
  rotationAngle -= 0.005;
  
  //pass image as texture
  texture(egg_texture);

  model(three_d_egg);
  pop();
}

function addWordsToCanvas() {
  push();
  let c = color(random(255),random(255),random(255));
  fill(c);
  text(getEggText(), random(-500, 500), random(-500, 500));
  pop();
}
