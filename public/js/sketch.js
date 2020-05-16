// --------------------------------------------------------
// 03-bart
// --------------------------------------------------------
let socket;
let stationData;


function setup() {
  createCanvas(window.innerWidth, 2560);

  // this works if you're running your server on the same port
  // if you're running from a separate server on a different port
  // you'll need to pass in the address to connect()
  socket = io.connect(); 

  // we listen for message on the socket server called 'data'
  socket.on('stationUpdate',
    (data) => {
      console.log('station update: ', data);
      stationData = data;
    }
  );
}

// --------------------------------------------------------
function windowResized() {
  resizeCanvas(window.innerWidth, 2560);
}

// --------------------------------------------------------
function getColor(colData) {
  let colorVal;
  switch(colData) {
    case "YELLOW":
      colorVal = color(254, 221, 0);
      break;
    
    case "RED":
      colorVal = color(225, 11, 83);
      break;
    
    case "GREEN":
      colorVal = color(72, 180, 65);
      break;
    
    case "BLUE":
      colorVal = color(0, 173, 239);
      break;
    
    default:
      colorVal = color(0, 0, 0);
  }

  return colorVal;
}

// --------------------------------------------------------
function draw() {
  background(255);
  strokeWeight(0);
  
  // Station data comes back in arrays of 21
  let x = 40;
  let y = 40;

  if (stationData && stationData.length > 0) {
    textAlign(LEFT);
    for (let i = 0; i < 21; i++) {
      fill(getColor(stationData[i]["color"]));
      rect(x, y, 80, 80);
      
      fill(0);
      textSize(18);
      text(stationData[i]["destination"], x + 100, y + 20);

      if (stationData[i]["minutes"] == 0) {
        fill(225, 11, 83);
        text("TRAIN APPROACHING", x + 100, y + 45);
        fill(0);
      } else {
        text("in " + stationData[i]["minutes"] + " minutes", x + 100, y + 45);
      }

      text(stationData[i]["direction"] + ", Platform #" + stationData[i]["platform"], x + 100, y + 70);

      y+= 120;
    }
  } else {
    textSize(24);
    text('Waiting for BART data...', width/2, 300);
    textAlign(CENTER);
  }
}