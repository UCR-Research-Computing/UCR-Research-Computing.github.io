// Global variables
let electrons = [];
let cathodeWidth = 150;
let anodeWidth = 150;
let chargingVoltageFactor = 1.0;

// Material Properties Data Structure
let materials = {
  "default": {
    cathodeColorHex: "#646464", // (100, 100, 100)
    anodeColorHex: "#969696",   // (150, 150, 150)
    cathodeColor: null,
    anodeColor: null,
    electronSpawnRate: 5, // Lower means more frequent
    electronBaseSpeed: 2,
    electronYRandomness: 0.5
  },
  "materialX": {
    cathodeColorHex: "#C83232", // (200, 50, 50)
    anodeColorHex: "#C86464",   // (200, 100, 100)
    cathodeColor: null,
    anodeColor: null,
    electronSpawnRate: 3,
    electronBaseSpeed: 3,
    electronYRandomness: 0.3
  },
  "materialY_coated": {
    cathodeColorHex: "#32C832", // (50, 200, 50)
    anodeColorHex: "#64C864",   // (100, 200, 100)
    cathodeColor: null,
    anodeColor: null,
    electronSpawnRate: 4,
    electronBaseSpeed: 2.5,
    electronYRandomness: 0.2
  }
};
let currentMaterialKey = "default"; // Global variable to store the current material

// Global colors to be used in drawing (will be updated from materials object)
let currentCathodeColor;
let currentAnodeColor;
let electrolyteColor;
let electronColorG; // Renamed to avoid conflict with class property

// HTML Elements (to be assigned in setup)
let materialDropdown;
let voltageSlider;
let voltageDisplay;
let resetButton;


function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent('canvas-container');

  // Initialize p5.color objects for each material
  for (let key in materials) {
    materials[key].cathodeColor = color(materials[key].cathodeColorHex);
    materials[key].anodeColor = color(materials[key].anodeColorHex);
  }

  electrolyteColor = color(200, 200, 200);
  electronColorG = color(0, 150, 255); // Bright blue for electrons

  // Select HTML elements (using p5.js's select function)
  materialDropdown = select('#materialSelect');
  voltageSlider = select('#voltageSlider');
  voltageDisplay = select('#voltageValue');
  resetButton = select('#resetButton');

  // Event Listener for Material Select
  if (materialDropdown) {
    materialDropdown.changed(() => {
      setCurrentMaterial(materialDropdown.value());
    });
  }

  // Event Listener for Voltage Slider
  if (voltageSlider && voltageDisplay) {
    voltageSlider.input(() => {
      chargingVoltageFactor = parseFloat(voltageSlider.value());
      voltageDisplay.html(chargingVoltageFactor.toFixed(1));
      // No need to clear electrons here, just speed them up/slow them down
    });
  }

  // Event Listener for Reset Button
  if (resetButton) {
    resetButton.mousePressed(resetSimulation);
  }
  
  // Apply initial material (default)
  setCurrentMaterial(currentMaterialKey); // This also sets initial colors and clears electrons

  background(230); // Initial background, will be covered by electrolyte
  console.log("p5.js setup complete. UI Listeners attached. Default material: " + currentMaterialKey);
}

function draw() {
  // Update global drawing colors based on current material (already handled by setCurrentMaterial for changes, good to keep for initial draw)
  currentCathodeColor = materials[currentMaterialKey].cathodeColor;
  currentAnodeColor = materials[currentMaterialKey].anodeColor;

  // 1. Draw Battery Components
  fill(electrolyteColor);
  rect(0, 0, width, height);

  fill(currentCathodeColor);
  rect(0, 0, cathodeWidth, height);

  fill(currentAnodeColor);
  rect(width - anodeWidth, 0, anodeWidth, height);

  // 2. Electron Management
  let matProps = materials[currentMaterialKey];
  // Spawn rate affected by voltage: higher voltage -> more frequent
  let currentSpawnRate = Math.max(1, floor(matProps.electronSpawnRate / chargingVoltageFactor));
  if (frameCount % currentSpawnRate === 0) {
    let startX = cathodeWidth - 10;
    let startY = random(10, height - 10);
    electrons.push(new Electron(startX, startY));
  }

  for (let i = electrons.length - 1; i >= 0; i--) {
    let e = electrons[i];
    e.update(); // Update will now use chargingVoltageFactor
    e.display();
    if (e.isOffscreen()) {
      electrons.splice(i, 1);
    }
  }
}

// Electron Class
class Electron {
  constructor(x, y) {
    this.pos = createVector(x, y);
    let matProps = materials[currentMaterialKey];
    // Electron base speed is multiplied by the chargingVoltageFactor
    this.vel = createVector(matProps.electronBaseSpeed * chargingVoltageFactor, random(-1, 1) * matProps.electronYRandomness);
    this.size = 5;
    this.color = electronColorG;
  }

  update() {
    // If velocity needs to be continuously affected by voltage factor (e.g. if factor changes mid-flight)
    // this might need adjustment, but for now, initial speed is set by factor.
    // Re-calculating velocity here based on current factor could also be an option:
    // let matProps = materials[currentMaterialKey];
    // this.vel.x = matProps.electronBaseSpeed * chargingVoltageFactor;
    // this.vel.y = random(-1,1) * matProps.electronYRandomness * (this.vel.y > 0 ? 1 : -1); // preserve general direction

    this.pos.add(this.vel);
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  isOffscreen() {
    return (this.pos.x > width - anodeWidth + this.size || this.pos.x < 0 - this.size || this.pos.y < 0 - this.size || this.pos.y > height + this.size);
  }
}

// Function to Change Material
function setCurrentMaterial(materialKey) {
  if (materials[materialKey]) {
    currentMaterialKey = materialKey;
    // Update drawing colors immediately
    currentCathodeColor = materials[currentMaterialKey].cathodeColor;
    currentAnodeColor = materials[currentMaterialKey].anodeColor;
    electrons = []; // Clear existing electrons when material changes
    console.log("Material changed to: " + currentMaterialKey);
  } else {
    console.warn("Material key '" + materialKey + "' not found.");
  }
}

// Reset Function
function resetSimulation() {
  console.log("Resetting simulation...");
  chargingVoltageFactor = 1.0;
  
  // Update HTML controls
  if (materialDropdown) materialDropdown.selected("default"); // p5 way to set select
  if (voltageSlider) voltageSlider.value(chargingVoltageFactor);
  if (voltageDisplay) voltageDisplay.html(chargingVoltageFactor.toFixed(1));
  
  // Set current material to default and apply its properties
  setCurrentMaterial("default"); // This handles clearing electrons and setting colors
  
  console.log("Simulation reset to default material and voltage factor.");
}
