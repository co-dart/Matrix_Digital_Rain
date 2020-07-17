let cells = [];
let drops = [];
let cellSize = 15;
let numRows;
let numCols;
let symbolSwapProb = 0.01;
let dropTimeout = 2;
let maxOffscreen = 200;
let brightTime = 60;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB);
  textFont("monospace");
  textSize(18);
  
  numRows = ceil(height / cellSize);
  numCols = ceil(width / cellSize);
  
  for (let i = 0; i < numRows; i++){
    let newRow = [];
    for (let j = 0; j < numCols; j++) {
      newRow.push(new Cell(j * cellSize, i * cellSize));
    }
    cells.push(newRow);
  }
  
  for (let j = 0; j < numCols; j++) {
    drops.push(new Drop(j));
  }
}

function draw() {
  background(0);
  
  drops.forEach(drop => {
    drop.update();
    drop.brightenCell();
  });
  
  cells.forEach(row => {
    row.forEach(cell => {
      cell.draw();
      cell.update();
      
    });
  });
}

class Cell {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.symbol = this.getRandomSymbol();
    this.brightness = 0;
    this.litTimer = 0;
  }
  
  getRandomSymbol() {
    return String.fromCharCode(random(12448, 12543)); 
  }
  
  brighten() {
    this.brightness = 100;
  }
  
  update() {
    if (random() < symbolSwapProb) {
      this.symbol = this.getRandomSymbol();
    }
    if (this.brightness > 0) {
      this.brightness = 80;
      this.litTimer =  (this.litTimer + 1) % brightTime;
      
      if (this.litTimer === 0) {
        this.brightness = 0;
      }
    }
  }
  
  draw() {
    fill(100, 100, this.brightness);
    text(this.symbol, this.x, this.y); 
  }
}

class Drop {
  constructor(col) {
    this.row = 0;
    this.col = col;
    this.dropTimeout = 0;
    this.offScreenTimeout = floor(random(maxOffscreen));
    this.offScreen = true;
  }
  
  update() {
    if (this.offScreen) {
      this.offScreenTimeout = (this.offScreenTimeout + 1) % maxOffscreen;
      
      if (this.offScreenTimeout === 0){
        this.offScreen = false;
      }
    } else {
      this.dropTimeout = (this.dropTimeout + 1) % dropTimeout;
    
      if (this.dropTimeout === 0){
        this.row++;
      }
      
      if (this.row === numRows){
        this.row = 0;
        this.offScreen = true;
        this.offScreenTimeout = floor(random(maxOffscreen));
      }
    }
  }
  
  brightenCell() {
    if (!this.offScreen)
     cells[this.row][this.col].brighten(); 
  }
}
