// Game state and core variables
let gameState;
let player;
let enemies = [];
let projectiles = [];
let particles = [];
let floatingTexts = [];
let powerUps = [];
let backgroundParticles = [];
let score;
let level;
let enemiesKilled;
let enemiesRequired;
let totalEnemiesSpawned;
let enemySpawnTimer;
let enemySpawnDelay;
let creditArea;
let sponsorAreas;
let debugMode = false; // Enable debug mode

// Load images
let marieSharpImg;
let fryJackImg;
let tamalesImg;
let hudutImg;
let bukutImg;
let chanclaImg;
let riceAndBeansImg;
let georgePriceImg;
let gameLogoImg;

// Game settings
let totalEnemiesPerLevel = [7, 10, 13, 16, 20];
let spawnInterval = 45;
let spawnCounter = 0;
let enemyParties = ['PUP', 'UDP', 'ALLIANCE'];
let shakeScreen = 0;
let gridOffset = 0;
let backgroundHue = 0;

// Asset variables
let backgroundMusic;
let soundEffects = {};
let marieSharpSprite;
let georgePriceSprite;
let assetsLoaded = false;
let loadingError = false;
let gameLogo;

// Sprite containers
let foodSprites = {
  'Marie Sharp': null,
  'Fry Jack': null,
  'Tamales': null,
  'Hudut': null,
  'Bukut': null,
  'Rice and Beans': null,
  'Chancla': null
};

// Character sprites and ratios
let characterSprites = {
  'PUP': null,
  'UDP': null,
  'ALLIANCE': null
};
let gameCharacterSprites = {
  'PUP': null,
  'UDP': null,
  'ALLIANCE': null
};
let characterAspectRatios = {};

// Projectile types - Adjust damage and add ammo cost based on spread
let projectileTypes = [
  { name: 'Marie Sharp', color: '#FF0000', spread: 0, damage: 1.2, emoji: '🌶️', ammoCost: 1 },
  { name: 'Fry Jack', color: '#FFD700', spread: 2, damage: 0.7, emoji: '🥯', ammoCost: 2 }, // Reduced damage, increased ammo cost
  { name: 'Tamales', color: '#8B4513', spread: 3, damage: 0.6, emoji: '🫔', ammoCost: 3 }, // Reduced damage, increased ammo cost
  { name: 'Hudut', color: '#FFF5E1', spread: 4, damage: 0.5, emoji: '🐟', ammoCost: 3 }, // Reduced damage, increased ammo cost
  { name: 'Bukut', color: '#FFF5E1', spread: 6, damage: 1.0, emoji: '🍆', ammoCost: 5 }, // Reduced damage, increased ammo cost
  { name: 'Rice and Beans', color: '#963200', spread: 5, damage: 0.4, emoji: '🍚', ammoCost: 4 }, // Reduced damage, increased ammo cost
  { name: 'Chancla', color: '#FF69B4', spread: 0, damage: 1.5, emoji: '🩴', ammoCost: 1 },
  { name: 'Health', color: '#FF69B4', spread: 0, damage: 0, emoji: '❤️', isHealth: true, ammoCost: 1 }
];

// Only declare these if they haven't been declared already
if (typeof enemies === 'undefined') {
    let enemies = [];
}
if (typeof projectiles === 'undefined') {
    let projectiles = [];
}

// Add array of Belizean phrases
const belizeanPhrases = {
  defeat: [
    "Tek Dat!! 💥",
    "Betta Belize It! 🇧🇿",
    "Bukut Fi You! 🍆",
    "Bang & Bye! 😘",
    "Weh Yuh Dih Seh Now?! 👊",
    "Stop Yuh Rrrr! 🔥",
    "Bex Up Now! 💢",
    "Tek Bukut! 🍆",
    "No Play Wid Me! 👊",
    "You Chat Too Much! 🦜",
    "Kiss Pauli Battam! 💋",
    "It's Ova Now! 💪",
    "Nuh Play Wid Me! ",
    "Fire Fi You! 🔥",
    "Yu Wa Learn Today! 📖",
    "Tek Yu Lick! 💣",
    "Yuh Dah Lone Tacos! 🌮",
    "Sorry Fi Mawga Dawg! 🐕",
    "Bex If Yuh Wah Bex! 😤",
    "No Permis! 🚫",
    "Cho Bway, Yuh Nuh Ready! ",
    "Rasta! 🔥"
  ],
  powerUp: [
    "It's Ova Now! 💪",
    "Check This Out! 🚀",
    "Dah Now! 🏁",
    "Yu Wah Feel Now! ⚡",
    "Fyah Fi Dem Now! 🔥"
  ],
  hit: [
    "Aye Maria! 💯",
    "Ouch! 🇧🇿",
    "Mein, Things Rough! 💪",
    "Bombo Batty! 🔥",
    "No Permis! 🚫"
  ]
};

// Add this variable at the top of your file
let isMobile = false;

// Add this near the top of the file with other global variables
let leaderboardData = []; // Initialize as empty array

// Add these variables at the top of your file with other global variables
let isMobileDevice = false;
let mobileUI = {
  leaderboardBtn: {
    x: 0,
    y: 0,
    width: 200,
    height: 50
  },
  sponsors: {
    y: 0,
    height: 30,
    marieSharp: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    exploring: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  },
  creator: null // Will be set when drawing the creator logo
};

// Add a global variable for the blinking effect
let warningBlinkTimer = 0;

// Add a new variable for the mobile leaderboard
let showingMobileLeaderboard = false;
let mobileLeaderboardData = [];
let mobileLeaderboardLoading = false;

// Add a variable for the Exploring Belize logo
let exploringBelizeLogo;

// Add a variable for the Fencepost Gear logo
let fencepostLogo;

// Add global variables for the logo images and URLs at the top of the file
let risiLogo;

// Define URLs for clickable logos
const LOGO_URLS = {
  risi: "http://www.facebook.com/risi.petillo",
  fencepost: "http://www.fencepostgear.com",
  exploringBelize: "http://www.facebook.com/profile.php?id=61573064769739"
};

class Particle {
  constructor(x, y, particleColor) {
    this.x = x;
    this.y = y;
    this.color = particleColor;
    this.alpha = 255;
    this.size = random(5, 10);
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.life = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 10;
    this.alpha = this.life;
    return this.life > 0;
  }

  draw() {
    push();
    noStroke();
    let c = color(this.color);
    c.setAlpha(this.alpha);
    fill(c);
    circle(this.x, this.y, this.size);
    pop();
  }
}

// Background particle for visual effects
class BackgroundParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 3);
    this.speed = random(0.5, 2);
    this.brightness = random(50, 150);
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.reset();
      this.y = 0;
    }
  }

  draw() {
    push();
    noStroke();
    fill(255, this.brightness);
    circle(this.x, this.y, this.size);
    pop();
  }
}

class FloatingText {
  constructor(text, x, y, type = 'hit') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.type = type;  // 'hit', 'powerUp', or 'defeat'
    this.alpha = 255;
    
    // Different settings based on type
    switch(type) {
      case 'powerUp':
        this.life = 120;  // Longer display time for power-ups
        this.size = 32;   // Larger text
        this.speed = 0.5; // Slower movement
        this.scaleEffect = 1.2; // Slight pulse effect
        break;
      case 'defeat':
        this.life = 100;  // Medium display time for defeats
        this.size = 36;   // Largest text
        this.speed = 1;
        this.scaleEffect = 1.5; // Larger pulse effect
        break;
      default: // hit
        this.life = 90;   // Standard display time for hits
        this.size = 24;   // Standard text size
        this.speed = 1.5; // Faster movement
        this.scaleEffect = 1;
    }
    
    this.initialLife = this.life;
    this.initialY = y;
    this.offsetX = 0;
  }

  draw() {
    push();
    textAlign(CENTER);
    
    // Calculate animation progress
    let progress = this.life / this.initialLife;
    let scale = 1;
    
    // Scale effect at start
    if (progress > 0.8) {
      scale = map(progress, 1, 0.8, 0, this.scaleEffect);
    } else if (progress < 0.2) {
      scale = map(progress, 0.2, 0, this.scaleEffect, 0);
    } else {
      scale = this.scaleEffect;
    }
    
    // Type-specific animations
    if (this.type === 'powerUp') {
      // Power-ups pulse and stay more visible
      this.offsetX = sin(frameCount * 0.1) * 10;
      this.alpha = map(this.life, this.initialLife, 0, 255, 200);
    } else if (this.type === 'defeat') {
      // Defeat messages expand outward
      this.offsetX = sin(frameCount * 0.2) * 15;
      this.alpha = map(this.life, this.initialLife, 0, 255, 0);
    } else {
      // Hit messages float up and fade
      this.y = this.initialY - (this.initialLife - this.life) * this.speed;
      this.alpha = map(this.life, this.initialLife, 0, 255, 0);
    }

    // Draw text with enhanced visibility
    textSize(this.size * scale);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'black';
    
    // Stroke for better visibility
    stroke(0, this.alpha);
    strokeWeight(4);
    fill(255, this.alpha);
    text(this.text, this.x + this.offsetX, this.y);
    
    this.life--;
    pop();
  }
}

class Projectile {
  constructor(x, y, type, damage) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.damage = damage;
    this.vx = 8;  // Default moving right (player projectile)
    this.vy = 0;
    this.size = 40;  // Base height for projectiles
    this.rotation = 0;
    this.rotationSpeed = random(-0.1, 0.1);  // Add some rotation for visual interest
    this.trailCounter = 0;  // Counter for creating trail particles
  }

  draw() {
    push();
    imageMode(CENTER);
    
    // Determine rotation based on direction and add some spin
    this.rotation += this.rotationSpeed;
    let baseRotation = this.vx > 0 ? 0 : PI;  // Rotate 180 degrees if moving left
    
    translate(this.x, this.y);
    rotate(baseRotation + this.rotation);
    
    // Use the correct sprite based on projectile type
    let sprite = foodSprites[this.type.name];
    if (sprite) {
      // Calculate aspect ratio and dimensions
      let spriteAspectRatio = sprite.width / sprite.height;
      let projHeight = this.size;
      let projWidth = projHeight * spriteAspectRatio;
      
      // For Marie Sharp specifically, adjust the size to be thinner
      if (this.type.name === 'Marie Sharp') {
        projWidth = projHeight * 0.4; // Make the bottle thinner
      }
      
      // Add glow effect based on projectile type
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = this.type.color;
      
      // Draw the sprite
      image(sprite, 0, 0, projWidth, projHeight);
    } else {
      // Fallback if sprite not loaded
      fill(this.type.color);
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = this.type.color;
      circle(0, 0, this.size);
      
      // Draw emoji in center as fallback
      if (this.type.emoji) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(this.type.emoji, 0, 0);
      }
    }
    
    pop();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Create trail particles occasionally
    this.trailCounter++;
    if (this.trailCounter >= 3) {  // Every 3 frames
      this.trailCounter = 0;
      
      // Create a trail particle
      let trailParticle = new Particle(
        this.x - (this.vx > 0 ? 10 : -10),  // Position slightly behind
        this.y,
        this.type.color
      );
      trailParticle.size = random(3, 8);  // Smaller than impact particles
      trailParticle.life = 100;  // Shorter lifespan
      particles.push(trailParticle);
    }
  }
}

// Helper function to remove all form elements - MOVED BEFORE SETUP
function removeAllFormElements() {
  try {
    // Remove any existing DOM elements
    const domInputs = document.querySelectorAll('input');
    domInputs.forEach(input => {
      if (input.id !== 'defaultCanvas0') {
        input.remove();
      }
    });
    
    const domButtons = document.querySelectorAll('button');
    domButtons.forEach(button => {
      if (button.id !== 'defaultCanvas0') {
        button.remove();
      }
    });
    
    const formContainer = document.getElementById('leaderboardFormContainer');
    if (formContainer) {
      formContainer.remove();
    }
  } catch (e) {
    console.log("Error removing DOM elements:", e);
  }
}

// Setup canvas
function setup() {
  // For mobile devices, use the full window size
  if (detectMobileDevice()) {
    // Create canvas with exact window dimensions
    let canvas = createCanvas(windowWidth, windowHeight);
    console.log("Mobile device detected, canvas size:", windowWidth, windowHeight);
    
    // Modified mobile settings to allow pull-to-refresh
    // Use less restrictive overflow settings
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Instead of fixed position, use a different approach to prevent unwanted scrolling
    // while still allowing pull-to-refresh
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.touchAction = 'pan-y'; // Allow vertical touch actions (like pull-to-refresh)
    
    // Add event listener to prevent default behavior for most touch events
    // but still allow the pull-to-refresh gesture
    document.addEventListener('touchmove', function(e) {
      // Allow the default behavior if the user is pulling down at the top of the page
      // (which is the pull-to-refresh gesture)
      if (window.scrollY === 0 && e.touches[0].clientY > 0) {
        // This is likely a pull-to-refresh gesture, so allow it
        return true;
      }
      
      // For all other touch movements, prevent default to avoid unwanted scrolling
      if (e.touches.length === 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Force redraw after a short delay to ensure proper sizing
    setTimeout(() => {
      console.log("Forcing redraw with size:", windowWidth, windowHeight);
      resizeCanvas(windowWidth, windowHeight);
    }, 100);
  } else {
    // For desktop, use fixed size
    createCanvas(1000, 800);
  }
  
  // Add this at the beginning of your setup function
  detectMobileDevice();
  
  // Center the canvas on the page - fixed style property access
  let canvasElement = document.getElementById('defaultCanvas0');
  if (canvasElement) {
    canvasElement.style.display = 'block';
    canvasElement.style.margin = 'auto';
    
    // Ensure the canvas is properly sized
    if (isMobileDevice) {
      canvasElement.style.width = '100%';
      canvasElement.style.height = '100%';
    }
  }
  
  // Set text properties
  textFont('Courier New');
  
  // Create fallback character images if needed
  createFallbackCharacters();
  
  // Initialize game state
  gameState = "start";
  
  // Initialize player
  player = null;
  
  // Initialize enemies array
  enemies = [];
  
  // Initialize projectiles array
  projectiles = [];
  
  // Initialize particles array
  particles = [];
  
  // Initialize floating text array
  floatingTexts = [];
  
  // Initialize power-ups array
  powerUps = [];
  
  // Initialize background particles
  backgroundParticles = [];
  for (let i = 0; i < 100; i++) {
    backgroundParticles.push(new BackgroundParticle());
  }
  
  // Initialize game variables
  score = 0;
  level = 1;
  enemiesKilled = 0;
  enemiesRequired = 7;
  totalEnemiesSpawned = 0;
  
  // Initialize enemy spawning
  enemySpawnTimer = 0;
  enemySpawnDelay = 180;
  
  // Initialize credits area
  creditArea = {
    x: width - 150,
    y: height - 30,
    width: 300,
    height: 60
  };
  
  // Initialize sponsor areas
  sponsorAreas = [
    {
      name: "FencepostGear.com",
      x: width - 150,
      y: height - 30,
      width: 300,
      height: 30,
      url: "https://fencepostgear.com"
    },
    {
      name: "ExploringBelize",
      x: width - 150,
      y: height - 10,
      width: 300,
      height: 20,
      url: "https://www.facebook.com/profile.php?id=61573064769739"
    }
  ];
  
  // Set frame rate
  frameRate(60);
  
  // Remove any leftover DOM elements from previous sessions
  removeAllFormElements();
  
  // Initialize Supabase client - Fix the initialization
  try {
    supabase = window.supabase.createClient(
      'https://hcbimxvdpputtddiuscv.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYmlteHZkcHB1dHRkZGl1c2N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTQzNzgsImV4cCI6MjA1NjMzMDM3OH0.5lp-ukSXgq3kZDzDMHl1Ly-JPQu_JvJTejfGkwE9gkU'
    );
    console.log("Supabase client initialized successfully");
  } catch (error) {
    console.error("Error initializing Supabase client:", error);
  }
}

function windowResized() {
  // Resize canvas for mobile devices
  if (detectMobileDevice()) {
    resizeCanvas(windowWidth, windowHeight);
    console.log("Mobile window resized, new canvas size:", windowWidth, windowHeight);
    
    // Update canvas element styles
    let canvasElement = document.getElementById('defaultCanvas0');
    if (canvasElement) {
      canvasElement.style.width = '100%';
      canvasElement.style.height = '100%';
    }
  }
  
  // Get the canvas element
  let canvas = document.getElementById('defaultCanvas0');
  if (!canvas) return;
  
  // Center the canvas
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  
  canvas.style.position = 'absolute';
  canvas.style.left = x + 'px';
  canvas.style.top = y + 'px';
}

// Main draw loop
function draw() {
  // Check if it's a mobile device
  if (isMobileDevice) {
    if (showingMobileLeaderboard) {
      drawMobileLeaderboard();
    } else {
      drawMobileWarning();
    }
    return;
  }
  
  // Clear the canvas
  clear();
  
  // Apply screen shake if active - Fix variable name to be consistent
  if (shakeScreen > 0) {
    translate(random(-shakeScreen, shakeScreen), random(-shakeScreen, shakeScreen));
    shakeScreen *= 0.9;  // Reduce shake over time
    if (shakeScreen < 0.5) shakeScreen = 0;
  }
  
  // Draw based on game state
  switch (gameState) {
    case "start":
      drawStartScreen();
      break;
    case "play":
      drawGame();
      break;
    case "paused":
      drawGame();
      // Draw pause overlay
      fill(0, 0, 0, 150);
      rect(width/2, height/2, width, height);
      fill(255);
      textSize(48);
      text("PAUSED", width/2, height/2);
      textSize(24);
      text("Press ESC to resume", width/2, height/2 + 50);
      break;
    case "gameOver":
      drawGameOver();
      break;
    case "win":
      drawWin();
      break;
    case "leaderboard":
      drawLeaderboard();
      break;
    case "submitScore":
      drawSubmitScoreForm();
      break;
  }
  
  // Draw debug info
  if (debugMode) {
    fill(255);
    textAlign(LEFT, TOP);
    textSize(12);
    text(`Mouse: ${mouseX}, ${mouseY}`, 10, 10);
    text(`Game State: ${gameState}`, 10, 25);
    
    // Draw button hitboxes on start screen
    if (gameState === "start") {
      noFill();
      stroke(255, 0, 0);
      strokeWeight(1);
      
      // PUP button hitbox
      rect(width/2 - 200, height/2 + 100, 150, 50);
      
      // UDP button hitbox
      rect(width/2, height/2 + 100, 150, 50);
      
      // ALLIANCE button hitbox
      rect(width/2 + 200, height/2 + 100, 150, 50);
      
      noStroke();
    }
  }
}

// Player class
class Player {
  constructor(party) {
    this.x = 100;  // Position player on the left side
    this.y = height/2;
    this.party = party;
    this.size = 50;
    this.speed = 5;
    this.health = 100;
    this.lives = 3;
    this.score = 0;
    this.direction = 'right';  // Face right by default
    this.invincible = false;
    this.invincibleTimer = 45;  // Reduced invincibility time (from 60 to 45 frames)
    this.maxInvincibleTime = 60; // 1 second at 60fps
    this.currentProjectile = projectileTypes[0];  // Start with Marie Sharp
    this.ammo = 20;  // Reduced starting ammo from 30 to 20
    this.maxAmmo = 20;  // Reduced max ammo from 30 to 20
    this.lastDirection = 'right'; // Add this to track last direction
    
    // Weapon switching visual effects
    this.weaponSwitchTimer = 0;
    this.weaponSwitchEffect = 0;
    
    // Combo system
    this.combo = 0;
    this.comboTimer = 0;
    this.maxComboTimer = 120; // 2 seconds at 60fps
    this.scoreMultiplier = 1;
    
    // Available weapons - start with only Marie Sharp
    this.availableWeapons = [true, false, false, false, false, false, false];
    
    console.log(`Player created with party: ${party}, health: ${this.health}, ammo: ${this.ammo}`);
  }

  moveLeft() {
    this.x = max(this.size/2, this.x - this.speed);
    this.direction = 'left';
    this.lastDirection = 'left';
  }

  moveRight() {
    this.x = min(width - this.size/2, this.x + this.speed);
    this.direction = 'right';
    this.lastDirection = 'right';
  }

  moveUp() {
    this.y = max(this.size/2, this.y - this.speed);
  }

  moveDown() {
    this.y = min(height - this.size/2, this.y + this.speed);
  }

  shoot() {
    // Calculate total ammo cost for this shot
    let ammoCost = this.currentProjectile.ammoCost || 1;
    
    // Check if we have enough ammo
    if (this.ammo < ammoCost) {
      // Reset to default weapon (Marie Sharp) when out of ammo
      this.currentProjectile = projectileTypes[0];
      this.ammo = 10; // Give some emergency ammo
      // Show out of ammo message
      floatingTexts.push(new FloatingText("Out of Ammo! 🔄", this.x, this.y - 30, 'hit'));
      return;
    }

    // Create main projectile
    let projectile = new Projectile(
      this.x + (this.direction === 'right' ? this.size/2 : -this.size/2),
      this.y,
      this.currentProjectile,
      this.currentProjectile.damage
    );
    
    // Set direction based on player direction
    if (this.direction === 'left') {
      projectile.vx = -8;
    }
    
    projectiles.push(projectile);

    // Add spread shots if the projectile type has spread
    if (this.currentProjectile.spread > 0) {
      for (let i = 1; i <= this.currentProjectile.spread; i++) {
        let upProj = new Projectile(
          this.x + (this.direction === 'right' ? this.size/2 : -this.size/2),
          this.y,
          this.currentProjectile,
          this.currentProjectile.damage
        );
        let downProj = new Projectile(
          this.x + (this.direction === 'right' ? this.size/2 : -this.size/2),
          this.y,
          this.currentProjectile,
          this.currentProjectile.damage
        );
        
        // Set direction based on player direction
        if (this.direction === 'left') {
          upProj.vx = -8;
          downProj.vx = -8;
        }
        
        upProj.vy = -i * 2;
        downProj.vy = i * 2;
        
        projectiles.push(upProj);
        projectiles.push(downProj);
      }
    }

    // Decrease ammo by the cost of this weapon
    this.ammo -= ammoCost;
    console.log(`Shot fired! Ammo cost: ${ammoCost}, Ammo remaining: ${this.ammo}`);

    // Add visual effects
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(
        this.x + (this.direction === 'right' ? this.size/2 : -this.size/2),
        this.y,
        this.currentProjectile.color
      ));
    }
    
    // Add small screen shake when shooting
    addScreenShake(2);
    
    // Occasionally show a shooting phrase
    if (random() < 0.1) {  // 10% chance
      floatingTexts.push(new FloatingText(
        random(belizeanPhrases.hit),
        this.x,
        this.y - 50,
        'hit'
      ));
    }
  }

  hit() {
    if (!this.invincible) {
      this.health -= 20;  // Reduced damage from 40
      this.isHit = true;
      this.hitTimer = 10;
      this.invincible = true;
      this.invincibleTimer = 60;  // Increased invincibility frames
      
      // Reset combo when hit
      this.resetCombo();
      
      // Add screen shake
      addScreenShake(10);
      
      // Show hit phrase
      if (random() < 0.3) {  // 30% chance
        floatingTexts.push(new FloatingText(
          random(belizeanPhrases.hit),
          this.x,
          this.y - 50,
          'hit'
        ));
      }
      
      if (this.health <= 0) {
        this.lives--;
        console.log(`Player lost a life! Lives remaining: ${this.lives}`);
        if (this.lives <= 0) {
          gameState = 'gameOver';
          console.log("Game over!");
        } else {
          this.health = 100;
          floatingTexts.push(new FloatingText("Lost a Life! ❤️", this.x, this.y - 50, 'hit'));
        }
      }
    }
  }

  // Only change direction when actually moving
  update() {
    if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
      this.direction = this.lastDirection;
    }

    // Update invincibility
    if (this.invincible) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }
    
    // Update combo timer
    if (this.combo > 0) {
      this.comboTimer--;
      if (this.comboTimer <= 0) {
        this.resetCombo();
      }
    }
    
    // Update weapon switch effect
    if (this.weaponSwitchTimer > 0) {
      this.weaponSwitchTimer--;
      this.weaponSwitchEffect = this.weaponSwitchTimer / 15; // Normalize to 0-1
    }
  }

  draw() {
    push();
    imageMode(CENTER);
    
    // Draw the character sprite
    let characterImage = gameCharacterSprites[this.party];
    if (characterImage) {
      let baseHeight = 120;
      let baseWidth = baseHeight * (characterAspectRatios[this.party] || 1);
      
      // Handle invincibility without using tint
      if (this.invincible) {
        // Use alpha for invincibility effect instead of tint
        if (frameCount % 30 < 15) {
          push();
          drawingContext.globalAlpha = 0.5;
        }
      }
      
      // Add weapon switch effect - scale up briefly
      if (this.weaponSwitchTimer > 0) {
        let scaleFactor = 1 + this.weaponSwitchEffect * 0.2;
        scale(scaleFactor, scaleFactor);
      }
      
      // Flip image based on direction
      if (this.direction === 'left') {
        push();
        scale(-1, 1);
        image(characterImage, -this.x, this.y, baseWidth, baseHeight);
        pop();
      } else {
        image(characterImage, this.x, this.y, baseWidth, baseHeight);
      }
      
      // Reset alpha if we changed it
      if (this.invincible && frameCount % 30 < 15) {
        pop();
      }
    } else {
      // Fallback if sprite not loaded
      fill(getPartyColor(this.party));
      noStroke();
      ellipse(this.x, this.y, this.size, this.size);
      
      // Draw direction indicator
      fill(255);
      if (this.direction === 'left') {
        ellipse(this.x - this.size/3, this.y, this.size/4, this.size/4);
      } else {
        ellipse(this.x + this.size/3, this.y, this.size/4, this.size/4);
      }
    }
    
    // Draw weapon icon near player
    this.drawCurrentWeapon();
    
    // Draw combo counter if active
    if (this.combo > 1) {
      push();
      textAlign(CENTER);
      textSize(16);
      fill(255, 255, 0);
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = 'gold';
      text(`${this.combo}x COMBO!`, this.x, this.y - 70);
      
      // Draw combo timer bar
      let timerWidth = 40;
      let timerHeight = 5;
      noStroke();
      fill(100, 100, 100);
      rect(this.x - timerWidth/2, this.y - 60, timerWidth, timerHeight);
      fill(255, 215, 0);
      rect(this.x - timerWidth/2, this.y - 60, 
           (this.comboTimer/this.maxComboTimer) * timerWidth, timerHeight);
      pop();
    }
    
    pop();
  }
  
  // Draw the current weapon icon near the player
  drawCurrentWeapon() {
    if (this.weaponSwitchTimer > 0) {
      push();
      // Position above player
      let iconX = this.x;
      let iconY = this.y - 60;
      
      // Draw weapon icon with glow
      fill(this.currentProjectile.color);
      drawingContext.shadowBlur = 10 + this.weaponSwitchEffect * 10;
      drawingContext.shadowColor = this.currentProjectile.color;
      
      // Draw circle background
      noStroke();
      circle(iconX, iconY, 30);
      
      // Draw weapon emoji
      textAlign(CENTER, CENTER);
      textSize(16);
      fill(255);
      text(this.currentProjectile.emoji, iconX, iconY);
      
      pop();
    }
  }
  
  // Add to combo when hitting an enemy
  addCombo() {
    this.combo++;
    this.comboTimer = this.maxComboTimer;
    
    // Update score multiplier based on combo
    if (this.combo >= 10) {
      this.scoreMultiplier = 3;
    } else if (this.combo >= 5) {
      this.scoreMultiplier = 2;
    } else {
      this.scoreMultiplier = 1;
    }
    
    // Show combo message for significant combos
    if (this.combo === 5 || this.combo === 10 || this.combo % 10 === 0) {
      floatingTexts.push(new FloatingText(
        `${this.combo}x COMBO! ${this.scoreMultiplier}x POINTS!`,
        this.x,
        this.y - 50,
        'powerUp'
      ));
    }
  }
  
  // Reset combo
  resetCombo() {
    if (this.combo >= 5) {
      // Show end of combo message
      floatingTexts.push(new FloatingText(
        `Combo Broken! ${this.combo}x`,
        this.x,
        this.y - 50,
        'hit'
      ));
    }
    
    this.combo = 0;
    this.comboTimer = 0;
    this.scoreMultiplier = 1;
  }
  
  // Switch to next weapon
  nextWeapon() {
    let currentIndex = projectileTypes.indexOf(this.currentProjectile);
    let nextIndex = currentIndex;
    
    // Find the next available weapon
    for (let i = 1; i <= projectileTypes.length; i++) {
      let index = (currentIndex + i) % projectileTypes.length;
      if (this.availableWeapons[index]) {
        nextIndex = index;
        break;
      }
    }
    
    // Only switch if we found a different weapon
    if (nextIndex !== currentIndex) {
      this.currentProjectile = projectileTypes[nextIndex];
      this.weaponSwitchTimer = 15; // 15 frames of effect
      
      // Show weapon switch message
      floatingTexts.push(new FloatingText(
        `${this.currentProjectile.name} ${this.currentProjectile.emoji}`,
        this.x,
        this.y - 50,
        'powerUp'
      ));
      
      console.log(`Switched to weapon: ${this.currentProjectile.name}`);
    }
  }
  
  // Switch to previous weapon
  prevWeapon() {
    let currentIndex = projectileTypes.indexOf(this.currentProjectile);
    let prevIndex = currentIndex;
    
    // Find the previous available weapon
    for (let i = 1; i <= projectileTypes.length; i++) {
      let index = (currentIndex - i + projectileTypes.length) % projectileTypes.length;
      if (this.availableWeapons[index]) {
        prevIndex = index;
        break;
      }
    }
    
    // Only switch if we found a different weapon
    if (prevIndex !== currentIndex) {
      this.currentProjectile = projectileTypes[prevIndex];
      this.weaponSwitchTimer = 15; // 15 frames of effect
      
      // Show weapon switch message
      floatingTexts.push(new FloatingText(
        `${this.currentProjectile.name} ${this.currentProjectile.emoji}`,
        this.x,
        this.y - 50,
        'powerUp'
      ));
      
      console.log(`Switched to weapon: ${this.currentProjectile.name}`);
    }
  }
  
  // Add a new weapon to available weapons
  addWeapon(weaponIndex) {
    if (weaponIndex >= 0 && weaponIndex < this.availableWeapons.length) {
      this.availableWeapons[weaponIndex] = true;
      console.log(`Added weapon: ${projectileTypes[weaponIndex].name} to available weapons`);
    }
  }
}

// Get party color
function getPartyColor(party) {
  if (party == 'UDP') return color(255, 0, 0);
  else if (party == 'PUP') return color(0, 0, 255);
  else if (party == 'ALLIANCE') return color(0, 255, 0);
  return color(255); // Default white
}

// Draw the start screen with party selection buttons
function drawStartScreen() {
  push();
  // Draw animated background
  background(25, 5, 51);
  drawArcadeBackground();
  
  // Create a structured layout with proper spacing
  const topSection = height * 0.15;      // Top 15% for logo
  const middleSection = height * 0.55;   // Middle 55% for characters
  const bottomSection = height * 0.30;   // Bottom 30% for instructions and footer
  
  // Add pulsating glow effect
  let pulseSpeed = 0.05;
  let minGlow = 5;
  let maxGlow = 15;
  let glowAmount = map(sin(frameCount * pulseSpeed), -1, 1, minGlow, maxGlow);
  
  // ===== TOP SECTION: LOGO =====
  // Draw game logo with glow effect
  if (gameLogo) {
    push();
    imageMode(CENTER);
    drawingContext.shadowBlur = glowAmount;
    drawingContext.shadowColor = 'rgba(255, 0, 0, 0.7)';
    image(gameLogo, width/2, topSection/2 + 20, 400, 120);
    pop();
  } else {
    // Fallback if image not loaded
    push();
    textAlign(CENTER, CENTER);
    textSize(40);
    drawingContext.shadowBlur = glowAmount;
    drawingContext.shadowColor = 'rgba(255, 0, 0, 0.7)';
    fill(255, 50, 50);
    text("BELIZEAN FOOD FIGHT", width/2, topSection/2);
    textSize(24);
    fill(255, 215, 0);
    text("ELECTIONS 2025 EDITION", width/2, topSection/2 + 40);
    pop();
  }
  
  // ===== MIDDLE SECTION: CHARACTER SELECTION =====
  // Add animated subtitle with glow
  push();
  textAlign(CENTER, CENTER);
  textSize(28);
  drawingContext.shadowBlur = glowAmount;
  drawingContext.shadowColor = 'rgba(255, 215, 0, 0.7)';
  fill(255, 215, 0);
  
  // Make text pulse slightly
  let textScale = map(sin(frameCount * 0.03), -1, 1, 0.95, 1.05);
  push();
  translate(width/2, topSection + 40);
  scale(textScale);
  text("SELECT YOUR FIGHTER", 0, 0);
  pop();
  pop();
  
  // Draw character selection with spotlight effect
  let spotlightSize = 150;
  let spotlightIntensity = map(sin(frameCount * 0.05), -1, 1, 0.7, 1);
  
  // Character positions - evenly spaced and moved higher up
  // Move characters up by adjusting the characterY position
  const characterY = topSection + middleSection/2 - 60; // Moved up by 60 pixels
  let charPositions = [
    {x: width/2 - 220, y: characterY, party: 'PUP'},
    {x: width/2, y: characterY - 20, party: 'UDP'}, // Slightly higher in center
    {x: width/2 + 220, y: characterY, party: 'ALLIANCE'}
  ];
  
  // Draw characters with spotlight and hover effects
  for (let i = 0; i < charPositions.length; i++) {
    let pos = charPositions[i];
    let party = pos.party;
    let isHovered = false;
    
    // Check if mouse is over this character
    if (dist(mouseX, mouseY, pos.x, pos.y) < 80) {
      isHovered = true;
    }
    
    // Draw spotlight effect
    push();
    drawingContext.globalAlpha = spotlightIntensity * 0.3;
    let spotlightColor;
    if (party === 'PUP') spotlightColor = color(0, 0, 255, 100);
    else if (party === 'UDP') spotlightColor = color(255, 0, 0, 100);
    else spotlightColor = color(0, 255, 0, 100);
    
    // Make spotlight larger on hover
    let actualSpotlightSize = isHovered ? spotlightSize * 1.2 : spotlightSize;
    
    // Draw radial gradient for spotlight
    let gradient = drawingContext.createRadialGradient(
      pos.x, pos.y, 0,
      pos.x, pos.y, actualSpotlightSize
    );
    gradient.addColorStop(0, spotlightColor.toString());
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    drawingContext.fillStyle = gradient;
    drawingContext.beginPath();
    drawingContext.arc(pos.x, pos.y, actualSpotlightSize, 0, TWO_PI);
    drawingContext.fill();
    pop();
    
    // Draw character with scaling effect on hover
    push();
    imageMode(CENTER);
    
    // Scale up character when hovered
    let scale = isHovered ? 1.1 : 0.9;
    let yOffset = isHovered ? -15 : 0;
    
    // Check if character sprites are loaded
    if (gameCharacterSprites[party]) {
      let charHeight = 160 * scale;
      let charWidth = charHeight * (characterAspectRatios[party] || 1);
      
      // Add floating animation
      let floatOffset = sin(frameCount * 0.05 + i) * 3;
      
      // Add glow effect when hovered
      if (isHovered) {
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = spotlightColor.toString();
      }
      
      // Draw the character
      image(gameCharacterSprites[party], pos.x, pos.y + floatOffset + yOffset, charWidth, charHeight);
    } else {
      // Fallback if sprite not loaded
      console.log(`Character sprite for ${party} not loaded`);
      fill(getPartyColor(party));
      noStroke();
      ellipse(pos.x, pos.y, 80, 80);
      
      // Add text label
      fill(255);
      textAlign(CENTER, CENTER);
      text(party, pos.x, pos.y);
    }
    pop();
    
    // Draw party name with glow
    push();
    textAlign(CENTER, CENTER);
    textSize(isHovered ? 28 : 24);
    
    if (isHovered) {
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = spotlightColor.toString();
      fill(255);
    } else {
      fill(200);
    }
    
    text(party, pos.x, pos.y + 100);
    pop();
    
    // Draw "SELECT" text when hovered
    if (isHovered) {
      push();
      textAlign(CENTER, CENTER);
      textSize(18);
      let selectY = pos.y + 130;
      
      // Animated arrow
      let arrowOffset = sin(frameCount * 0.2) * 3;
      
      drawingContext.shadowBlur = 8;
      drawingContext.shadowColor = 'white';
      fill(255, 255, 0);
      text("▼ SELECT ▼", pos.x, selectY + arrowOffset);
      pop();
    }
  }
  
  // ===== BOTTOM SECTION: INSTRUCTIONS & FOOTER =====
  // Draw instructions - MOVED HIGHER UP to match the new character position
  const instructionsY = topSection + middleSection - 90; // Moved down by 10 pixels (was -100)
  drawInstructionsBox(instructionsY);
  
  // Add "CLICK CHARACTER TO START" text with animation
  if (frameCount % 90 < 60) { // Blink effect
    push();
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(255);
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = 'rgba(255, 0, 0, 0.7)';
    text("CLICK CHARACTER TO START", width/2, instructionsY + 70); // Moved down by 10px (was +60)
    pop();
  }
  
  // Add leaderboard button centered below "CLICK CHARACTER TO START"
  let leaderboardBtnWidth = 160;
  let leaderboardBtnHeight = 40;
  let leaderboardBtnX = width/2 - leaderboardBtnWidth/2;
  let leaderboardBtnY = instructionsY + 100; // Position below the text, moved down by 10px (was +90)
  
  // Check if mouse is over button
  if (mouseX > leaderboardBtnX && mouseX < leaderboardBtnX + leaderboardBtnWidth &&
      mouseY > leaderboardBtnY && mouseY < leaderboardBtnY + leaderboardBtnHeight) {
    fill(80, 80, 200);
  } else {
    fill(59, 89, 182);
  }
  
  rect(leaderboardBtnX, leaderboardBtnY, leaderboardBtnWidth, leaderboardBtnHeight, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  
  // Add bold style and glow effect to LEADERBOARD text
  textStyle(BOLD);
  drawingContext.shadowBlur = 6;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.7)';
  
  text('LEADERBOARD', leaderboardBtnX + leaderboardBtnWidth/2, leaderboardBtnY + leaderboardBtnHeight/2);
  
  // Reset text style and shadow
  textStyle(NORMAL);
  drawingContext.shadowBlur = 0;
  
  // Draw bottom bar with three sections
  const footerY = height - 30;
  
  // 1. Left: Credits (clickable)
  push();
  fill(200);
  textSize(14);
  textAlign(LEFT, CENTER);
  
  // Make credits clickable with hover effect
  let creditsHovered = mouseX < 200 && mouseY > height - 50;
  if (creditsHovered) {
    fill(255, 215, 0);
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = 'rgba(255, 215, 0, 0.5)';
  }
  
  //text("Created by @risi.petillo", 20, footerY);
  pop();
  
  // 2. Center: Share button
  drawShareButton(width/2, footerY);
  
  // 3. Right: Sponsor information (clickable)
  push();
  textAlign(RIGHT, CENTER);
  fill(200);
  textSize(14);
  //text("Sponsored by:", width - 200, footerY - 15);
  
  // Draw sponsor names with hover effects
  for (let i = 0; i < sponsorAreas.length; i++) {
    let area = sponsorAreas[i];
    let isHovered = mouseX > width - 200 && mouseX < width - 20 && 
                   mouseY > footerY - 15 + (i * 15) - 10 && 
                   mouseY < footerY - 15 + (i * 15) + 10;
    
    if (isHovered) {
      fill(255, 215, 0);
      drawingContext.shadowBlur = 5;
      drawingContext.shadowColor = 'rgba(255, 215, 0, 0.5)';
    } else {
      fill(200);
      drawingContext.shadowBlur = 0;
    }
    
    //text(area.name, width - 20, footerY - 15 + (i * 15));
  }
  pop();
  
  // Only show debug visualization if explicitly requested
  if (debugMode && keyIsDown(68)) { // Only show when 'D' key is pressed
    noFill();
    stroke(255, 0, 0);
    strokeWeight(1);
    
    // Draw hitboxes for characters
    for (let pos of charPositions) {
      ellipse(pos.x, pos.y, 160, 160);
    }
    
    // Draw hitboxes for clickable areas
    rect(100, footerY, 200, 30); // Credits
    rect(width/2, footerY, 140, 30); // Share
    rect(width - 100, footerY - 15, 180, 45); // Sponsors
    
    // Draw hitbox for leaderboard button
    rect(leaderboardBtnX, leaderboardBtnY, leaderboardBtnWidth, leaderboardBtnHeight);
  }
  
  pop();
  
  // Add this at the end of the function, before any return statement
  drawCreditsAndSponsors();
}

// Updated instructions box function
function drawInstructionsBox(yPosition) {
  push();
  textAlign(CENTER);
  
  // Draw the instruction box with arcade cabinet style
  push();
  rectMode(CENTER);
  fill(0, 0, 0, 200);
  noStroke(); // Remove yellow border
  rect(width/2, yPosition, width - 40, 60, 12); // Use almost full width of screen
  pop();

  // Draw the updated instructions text with arcade style
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14); // Reduced from 15 to 14
  
  // Add icons with glow effect
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
  
  // Updated with Belizean food-themed instructions - more compact version
  text('🎮 ARROW KEYS to dodge dishes | 🔫 SPACEBAR to fling Belizean eats | ⚡ Power-ups for tastier weapons!', width/2, yPosition);
  pop();
}

// Updated share button function
function drawShareButton(x, y) {
  push();
  // Draw Facebook share button
  rectMode(CENTER);
  
  // Check if mouse is over button
  let isHovered = mouseX > x - 70 && mouseX < x + 70 && mouseY > y - 15 && mouseY < y + 15;
  
  // Button background
  if (isHovered) {
    fill(69, 99, 162); // Slightly brighter when hovered
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
  } else {
    fill(59, 89, 152); // Facebook blue
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
  }
  
  stroke(255);
  strokeWeight(1);
  rect(x, y, 150, 30, 5);
  
  // Button text
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("Share on Facebook", x, y);
  
  // Construct share URL safely
  let shareMessage = "I played Belizean Food Fight! Can you beat my score?";
  
  // Only add score to message if it's defined and we're not on the start screen
  if (gameState !== 'start') {
    // FIX: Use player.score if available
    let finalScore = player ? player.score : score;
    shareMessage += " My score: " + finalScore;
  }
  
  // Use the Facebook sharer URL which will pick up the Open Graph meta tags
  // This ensures the image specified in og:image will be included in the share
  let shareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href) + "&quote=" + encodeURIComponent(shareMessage);
  
  // Store the share URL for use in mousePressed
  window.shareUrl = shareUrl;
  pop();
}

// Update mousePressed to match the new layout
function mousePressed() {
  console.log("Mouse pressed at:", mouseX, mouseY);
  
  // If it's a mobile device, handle it separately
  if (isMobileDevice) {
    handleMobileTouch(mouseX, mouseY);
    return;
  }
  
  // Start screen button detection
  if (gameState === 'start') {
    console.log("Start screen: checking for clicks");
    
    // Character positions (must match those in drawStartScreen)
    const topSection = height * 0.15;
    const middleSection = height * 0.55;
    const characterY = topSection + middleSection/2;
    
    let charPositions = [
      {x: width/2 - 220, y: characterY, party: 'PUP'},
      {x: width/2, y: characterY - 20, party: 'UDP'},
      {x: width/2 + 220, y: characterY, party: 'ALLIANCE'}
    ];
    
    // Check if any character was clicked
    for (let pos of charPositions) {
      if (dist(mouseX, mouseY, pos.x, pos.y) < 80) {
        console.log(pos.party + " character clicked");
        startGame(pos.party);
        return;
      }
    }
    
    // Check for footer clicks
    const footerY = height - 30;
    
    // Check if credits was clicked
    if (mouseX < 200 && mouseY > height - 50) {
      window.open("https://www.facebook.com/risi.petillo", "_blank");
      return;
    }
    
    // Check if share button was clicked (adjusted for new position 20px higher)
    if (mouseX > width/2 - 70 && mouseX < width/2 + 70 && mouseY > footerY - 35 && mouseY < footerY - 5) {
      if (window.shareUrl) {
        window.open(window.shareUrl, '_blank');
      }
      return;
    }
    
    // Check for sponsor clicks
    if (mouseX > width - 200 && mouseX < width - 20 && mouseY > footerY - 30 && mouseY < footerY + 15) {
      // Determine which sponsor was clicked
      let sponsorIndex = mouseY > footerY - 15 ? 1 : 0;
      if (sponsorIndex < sponsorAreas.length) {
        window.open(sponsorAreas[sponsorIndex].url, '_blank');
      }
      return;
    }
    
    // Handle leaderboard button on start screen with updated position
    const instructionsY = topSection + middleSection - 90; // Updated to match drawStartScreen
    let leaderboardBtnWidth = 160;
    let leaderboardBtnHeight = 40;
    let leaderboardBtnX = width/2 - leaderboardBtnWidth/2;
    let leaderboardBtnY = instructionsY + 100; // Updated to match drawStartScreen
    
    if (mouseX > leaderboardBtnX && mouseX < leaderboardBtnX + leaderboardBtnWidth &&
        mouseY > leaderboardBtnY && mouseY < leaderboardBtnY + leaderboardBtnHeight) {
      fetchLeaderboard();
      gameState = 'leaderboard';
      return;
    }
  }
  
  // Game over screen button detection
  else if (gameState === 'gameOver') {
    // Submit score button - updated coordinates to match the enhanced button
    let submitBtnX = width/2;
    let submitBtnY = height/2 + 120;
    let submitBtnWidth = 250;
    let submitBtnHeight = 60;
    
    if (mouseX > submitBtnX - submitBtnWidth/2 && mouseX < submitBtnX + submitBtnWidth/2 &&
        mouseY > submitBtnY - submitBtnHeight/2 && mouseY < submitBtnY + submitBtnHeight/2) {
      console.log("Submit score button clicked");
      gameState = 'submitScore';
      return;
    }
    
    // Play again button - updated coordinates to match the enhanced button
    let playBtnX = width/2;
    let playBtnY = height/2 + 200;
    let playBtnWidth = 250;
    let playBtnHeight = 60;
    
    if (mouseX > playBtnX - playBtnWidth/2 && mouseX < playBtnX + playBtnWidth/2 &&
        mouseY > playBtnY - playBtnHeight/2 && mouseY < playBtnY + playBtnHeight/2) {
      console.log("Play again button clicked");
      resetGame();
      gameState = 'start';
      return;
    }
    
    // Share button - updated coordinates to match the enhanced button
    let shareBtnX = width/2;
    let shareBtnY = height - 60;
    let shareBtnWidth = 200;
    let shareBtnHeight = 50;
    
    if (mouseX > shareBtnX - shareBtnWidth/2 && mouseX < shareBtnX + shareBtnWidth/2 &&
        mouseY > shareBtnY - shareBtnHeight/2 && mouseY < shareBtnY + shareBtnHeight/2) {
      console.log("Share button clicked");
      // Open share URL in a new tab
      if (shareUrl) {
        window.open(shareUrl, '_blank');
      }
      return;
    }
  }
  
  // Win screen button detection
  else if (gameState === 'win') {
    // ... existing win screen code ...
  }
  
  // Game state button detection
  else if (gameState === 'game') {
    // ... existing game state code ...
  }
  
  // Leaderboard screen button detection - UPDATED CODE
  else if (gameState === 'leaderboard') {
    // Return to start button - using the global variables for consistency
    if (window.leaderboardBackBtnX && // Check if button coordinates are defined
        mouseX > window.leaderboardBackBtnX - window.leaderboardBackBtnWidth/2 && 
        mouseX < window.leaderboardBackBtnX + window.leaderboardBackBtnWidth/2 &&
        mouseY > window.leaderboardBackBtnY - window.leaderboardBackBtnHeight/2 && 
        mouseY < window.leaderboardBackBtnY + window.leaderboardBackBtnHeight/2) {
      
      console.log("Return to start button clicked at:", mouseX, mouseY);
      console.log("Button bounds:", 
                 window.leaderboardBackBtnX - window.leaderboardBackBtnWidth/2,
                 window.leaderboardBackBtnY - window.leaderboardBackBtnHeight/2,
                 window.leaderboardBackBtnWidth,
                 window.leaderboardBackBtnHeight);
      
      resetGame();
      gameState = 'start';
      return;
    } else {
      // Debug info for clicks that miss the button
      if (gameState === 'leaderboard') {
        console.log("Click missed the button. Button bounds:", 
                   window.leaderboardBackBtnX - window.leaderboardBackBtnWidth/2,
                   window.leaderboardBackBtnY - window.leaderboardBackBtnHeight/2,
                   window.leaderboardBackBtnWidth,
                   window.leaderboardBackBtnHeight);
      }
    }
  }
  
  // Only check for logo clicks if we're on the start screen or game over screen
  if (gameState === "start" || gameState === "gameOver") {
    // Check if any logo was clicked
    if (window.creditAreas) {
      // Check creator logo
      if (mouseX > window.creditAreas.creator.x && 
          mouseX < window.creditAreas.creator.x + window.creditAreas.creator.width &&
          mouseY > window.creditAreas.creator.y && 
          mouseY < window.creditAreas.creator.y + window.creditAreas.creator.height) {
        window.open(LOGO_URLS.risi, '_blank');
        return;
      }
      
      // Check fencepost logo
      if (mouseX > window.creditAreas.fencepost.x && 
          mouseX < window.creditAreas.fencepost.x + window.creditAreas.fencepost.width &&
          mouseY > window.creditAreas.fencepost.y && 
          mouseY < window.creditAreas.fencepost.y + window.creditAreas.fencepost.height) {
        window.open(LOGO_URLS.fencepost, '_blank');
        return;
      }
      
      // Check exploring belize logo
      if (mouseX > window.creditAreas.exploringBelize.x && 
          mouseX < window.creditAreas.exploringBelize.x + window.creditAreas.exploringBelize.width &&
          mouseY > window.creditAreas.exploringBelize.y && 
          mouseY < window.creditAreas.exploringBelize.y + window.creditAreas.exploringBelize.height) {
        window.open(LOGO_URLS.exploringBelize, '_blank');
        return;
      }
    }
  }
}

// Update drawSocialUI to use the new drawShareButton function
function drawSocialUI() {
  const footerY = height - 30;
  
  // Draw Share on Facebook button 20px higher than before
  drawShareButton(width/2, footerY - 20);
}

// Update drawArcadeBackground to ensure it covers the entire screen
function drawArcadeBackground() {
  // Draw grid background
  background(0);
  
  // Draw grid lines with enhanced glow effect
  push();
  stroke(20, 20, 40);
  strokeWeight(1);
  
  // Add subtle gradient overlay
  for (let i = 0; i < height; i += 10) {
    let alpha = map(i, 0, height, 30, 10);
    stroke(0, 100, 255, alpha);
    line(0, i, width, i);
  }
  
  for (let i = 0; i < width; i += 20) {
    stroke(20, 20, 40);
    line(i, 0, i, height);
  }
  pop();
  
  // Add subtle vignette effect
  push();
  noStroke();
  let gradientSize = 150;
  for (let i = 0; i < gradientSize; i++) {
    let alpha = map(i, 0, gradientSize, 150, 0);
    fill(0, alpha);
    
    // Top vignette
    rect(0, 0, width, i);
    // Bottom vignette
    rect(0, height - i, width, i);
    // Left vignette
    rect(0, 0, i, height);
    // Right vignette
    rect(width - i, 0, i, height);
  }
  pop();
}

function startGame(party) {
  console.log("Starting game with party:", party);
  
  // Initialize player with selected party
  player = new Player(party);
  
  // Make sure only the first weapon is available at start
  player.availableWeapons = [true, false, false, false, false, false, false];
  player.currentProjectile = projectileTypes[0];
  
  // Set enemy parties based on player choice
  if (party === 'UDP') {
    enemyParties = ['PUP', 'ALLIANCE'];
  } else if (party === 'PUP') {
    enemyParties = ['UDP', 'ALLIANCE'];
  } else if (party === 'ALLIANCE') {
    enemyParties = ['UDP', 'PUP'];
  }
  
  // Reset game state
  enemies = [];
  projectiles = [];
  powerUps = [];
  floatingTexts = [];
  particles = [];
  level = 1;
  
  // Reset both score variables
  score = 0;
  player.score = 0;
  console.log("Scores reset: Global score = 0, Player score = 0");
  
  enemiesKilled = 0;
  enemiesRequired = totalEnemiesPerLevel[0];
  totalEnemiesSpawned = 0;
  spawnCounter = 0;
  
  // Spawn a weapon power-up to start with - DELAYED from 2 seconds to 5 seconds
  setTimeout(() => {
    if (gameState === 'play') {
      let weaponPowerUp = new PowerUp(
        width/2,
        height/2,
        'weapon'
      );
      // Force it to be a specific weapon (Fry Jack)
      weaponPowerUp.weaponIndex = 1;
      powerUps.push(weaponPowerUp);
      
      // Add visual effect to draw attention
      for (let i = 0; i < 10; i++) {
        let particle = new Particle(
          width/2,
          height/2,
          projectileTypes[1].color
        );
        particle.size = random(5, 15);
        particle.life = 120;
        particles.push(particle);
      }
      
      // Add floating text
      floatingTexts.push(new FloatingText(
        "Weapon Power-Up Spawned! 🎮",
        width/2,
        height/2 - 50,
        'powerUp'
      ));
    }
  }, 5000); // Spawn after 5 seconds (increased from 2 seconds)
  
  // Change game state to play
  gameState = 'play';
  console.log("Game started with party:", party);
}

function drawGame() {
  // Draw background
  background(0);
  drawArcadeBackground();
  
  // Handle input
  handleInput();
  
  // Spawn enemies
  updateEnemySpawning();
  
  // Periodically spawn power-ups (REDUCED frequency from every 10 seconds to every 25 seconds)
  if (frameCount % 1500 === 0) {
    spawnRandomPowerUp();
  }
  
  // Update and draw player
  if (player) {
    player.update();
    player.draw();
  }

  // Update and draw projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    projectiles[i].draw();
    
    // Remove projectiles that go off screen
    if (projectiles[i].x < 0 || projectiles[i].x > width || 
        projectiles[i].y < 0 || projectiles[i].y > height) {
      projectiles.splice(i, 1);
    }
  }

  // Update and draw enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].move();
    enemies[i].draw();
  }
  
  // Update and draw power-ups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].update();
    powerUps[i].draw();
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].update()) {
      particles.splice(i, 1);
    } else {
      particles[i].draw();
    }
  }

  // Update and draw floating texts
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    floatingTexts[i].draw();
    if (floatingTexts[i].life <= 0) {
      floatingTexts.splice(i, 1);
    }
  }

  // Check collisions
  checkCollisions();

  // Draw UI
  drawUI();
}

function handleInput() {
  if (gameState === 'play' && player) {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // Left arrow or 'A'
      player.moveLeft();
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // Right arrow or 'D'
      player.moveRight();
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // Up arrow or 'W'
      player.moveUp();
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // Down arrow or 'S'
      player.moveDown();
    }
  }
}

// Update the UI drawing to show ammo count and current weapon more clearly
function drawUI() {
  push();
  
  // Draw background panel for UI
  fill(0, 0, 0, 180);
  noStroke();
  rect(0, 0, 250, 150);
  
  // Draw UI elements
  fill(255);
  textSize(20);
  textAlign(LEFT);
  
  if (player) {
    // Score - FIX: Use player.score instead of score
    text(`Score: ${player.score}`, 10, 30);
    
    // Lives with heart icons
    text(`Lives: `, 10, 60);
    for (let i = 0; i < player.lives; i++) {
      text("❤️", 80 + i * 25, 60);
    }
    
    // Health bar
    text(`Health: `, 10, 90);
    noStroke();
    fill(100, 100, 100);
    rect(90, 85, 100, 10);
    
    // Health color changes based on amount
    if (player.health > 60) fill(0, 255, 0);
    else if (player.health > 30) fill(255, 255, 0);
    else fill(255, 0, 0);
    
    rect(90, 85, player.health, 10);
    
    // Ammo bar
    text(`Ammo: `, 10, 120);
    fill(100, 100, 100);
    rect(90, 115, 100, 10);
    
    // Ammo color
    fill(255, 215, 0);
    rect(90, 115, (player.ammo / player.maxAmmo) * 100, 10);
    
    // Current weapon - more prominent display
    textAlign(RIGHT);
    fill(255, 255, 255);
    textSize(18);
    text(`Weapon: `, width - 150, 30);
    
    // Weapon name with color matching the projectile
    fill(player.currentProjectile.color);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = player.currentProjectile.color;
    textSize(22);
    text(`${player.currentProjectile.name} ${player.currentProjectile.emoji}`, width - 10, 30);
    
    // Weapon switching hint
    textSize(14);
    fill(200);
    drawingContext.shadowBlur = 0;
    text("Press 1-7 to switch weapons", width - 10, 55);
    text("or Q/E to cycle", width - 10, 75);
  }
  
  pop();
}

// Draw game over screen
function drawGameOver() {
  // Draw enhanced background
  drawArcadeBackground();
  
  // Add particle effects
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 8);
    
    push();
    fill(255, 0, 0, 100);
    noStroke();
    ellipse(x, y, size);
    pop();
  }
  
  // Draw game logo with glow
  if (gameLogo) {
    push();
    imageMode(CENTER);
    
    // Draw glow behind logo
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(255, 100, 100, 0.7)';
    image(gameLogo, width/2, 100, 420, 145); // Increased from 320x110 to 420x145
    
    // Draw logo
    drawingContext.shadowBlur = 0;
    image(gameLogo, width/2, 100, 400, 135); // Increased from 300x100 to 400x135
    pop();
  } else {
    push();
    textAlign(CENTER);
    textSize(40);
    
    // Text glow effect
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(255, 0, 0, 0.7)';
    
    fill(255, 50, 50);
    stroke(0);
    strokeWeight(4);
    text("BELIZEAN FOOD FIGHT", width/2, 100);
    pop();
  }
  
  // Draw game over text with animation
  push();
  textAlign(CENTER);
  textSize(72);
  
  // Pulsing animation
  let pulse = sin(frameCount * 0.1) * 5;
  let size = 72 + pulse;
  
  // Text glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'rgba(255, 0, 0, 0.8)';
  
  fill(255, 0, 0);
  stroke(0);
  strokeWeight(5);
  text("GAME OVER", width/2, height/2 - 40); // Adjusted Y position to center in the rectangle
  
  // Add decorative elements
  noFill();
  stroke(255, 0, 0, 150);
  strokeWeight(3);
  rect(width/2 - 200, height/2 - 100, 400, 80, 10);
  pop();
  
  // Draw score with enhanced styling
  push();
  textAlign(CENTER);
  textSize(36);
  
  // Text glow effect
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.6)';
  
  fill(255);
  stroke(0);
  strokeWeight(3);
  
  // Format score with commas
  const formattedScore = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  text("SCORE: " + formattedScore, width/2, height/2 + 30);
  pop();
  
  // Draw buttons with improved styling
  // Submit score button
  let submitBtnX = width/2;
  let submitBtnY = height/2 + 120;
  let submitBtnWidth = 250;
  let submitBtnHeight = 60;
  
  push();
  // Button glow on hover
  if (mouseX > submitBtnX - submitBtnWidth/2 && mouseX < submitBtnX + submitBtnWidth/2 &&
      mouseY > submitBtnY - submitBtnHeight/2 && mouseY < submitBtnY + submitBtnHeight/2) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(100, 100, 255, 0.8)';
  }
  
  // Button background with gradient
  fill(60, 80, 200);
  stroke(100, 120, 255);
  strokeWeight(3);
  rect(submitBtnX - submitBtnWidth/2, submitBtnY - submitBtnHeight/2, submitBtnWidth, submitBtnHeight, 10);
  
  // Button text
  textAlign(CENTER, CENTER);
  textSize(28);
  fill(255);
  noStroke();
  text("SUBMIT SCORE", submitBtnX, submitBtnY);
  pop();
  
  // Play again button
  let playBtnX = width/2;
  let playBtnY = height/2 + 200;
  let playBtnWidth = 250;
  let playBtnHeight = 60;
  
  push();
  // Button glow on hover
  if (mouseX > playBtnX - playBtnWidth/2 && mouseX < playBtnX + playBtnWidth/2 &&
      mouseY > playBtnY - playBtnHeight/2 && mouseY < playBtnY + playBtnHeight/2) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(100, 100, 255, 0.8)';
  }
  
  // Button background with gradient
  fill(60, 80, 200);
  stroke(100, 120, 255);
  strokeWeight(3);
  rect(playBtnX - playBtnWidth/2, playBtnY - playBtnHeight/2, playBtnWidth, playBtnHeight, 10);
  
  // Button text
  textAlign(CENTER, CENTER);
  textSize(28);
  fill(255);
  noStroke();
  text("PLAY AGAIN", playBtnX, playBtnY);
  pop();
  
  // Draw share button with improved styling
  drawShareButton(width/2, height - 60);
  
  // Add this at the end of the function, before any return statement
  drawCreditsAndSponsors();
}

function resetGame() {
  // Reset game state
  gameState = 'start';
  level = 1;
  score = 0;
  
  // Clear arrays
  enemies = [];
  projectiles = [];
  powerUps = [];
  floatingTexts = [];
  particles = [];
  
  // Reset player
  player = null;
  
  // Reset spawn counter
  spawnCounter = 0;
}

// Draw win screen
function drawWin() {
  background(25, 0, 51);  // Same dark purple as intro
  drawArcadeBackground();
  
  push();
  
  // Draw game logo at the top
  if (gameLogo) {
    let logoHeight = 100;
    let logoWidth = logoHeight * (gameLogo.width / gameLogo.height);
    imageMode(CENTER);
    image(gameLogo, width/2, 80, logoWidth, logoHeight);
  }
  
  textAlign(CENTER, CENTER);
  
  // Victory text with pulsating glow
  let pulseSpeed = 0.05;
  let minBlur = 15;
  let maxBlur = 35;
  let pulseAmount = map(sin(frameCount * pulseSpeed), -1, 1, minBlur, maxBlur);
  
  // Title with golden glow
  textSize(48);
  drawingContext.shadowBlur = pulseAmount;
  drawingContext.shadowColor = 'rgba(255, 215, 0, 0.6)';  // Golden glow
  fill(255, 215, 0);  // Gold color
  text('Congratulations! You Won!', width/2, height/3);
  
  // Score with white glow
  textSize(32);
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
  fill(255);
  let finalScore = player ? player.score : score;
  text('Final Score: ' + finalScore, width/2, height/2);
  
  // Submit score button
  let submitBtnY = height * 0.6;
  if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
      mouseY > submitBtnY - 25 && mouseY < submitBtnY + 25) {
    fill(100, 0, 200);
  } else {
    fill(60, 0, 120);
  }
  
  rectMode(CENTER);
  rect(width/2, submitBtnY, 200, 50, 10);
  fill(255);
  textSize(24);
  text('SUBMIT SCORE', width/2, submitBtnY);
  
  // Play again button
  let playAgainBtnY = height * 0.7;
  if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
      mouseY > playAgainBtnY - 25 && mouseY < playAgainBtnY + 25) {
    fill(100, 0, 200);
  } else {
    fill(60, 0, 120);
  }
  
  rect(width/2, playAgainBtnY, 200, 50, 10);
  fill(255);
  text('PLAY AGAIN', width/2, playAgainBtnY);
  
  // Draw social UI
  drawSocialUI();
  
  pop();
}

// Add leaderboard drawing function
function drawLeaderboard() {
  // Draw enhanced background
  drawArcadeBackground();
  
  // Add particle effects for visual interest
  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 5);
    let speed = random(0.5, 2);
    
    push();
    fill(255, 255, 0, 100);
    noStroke();
    ellipse(x, y, size);
    pop();
  }
  
  // Draw game logo with glow effect - reduced size
  if (gameLogo) {
    push();
    imageMode(CENTER);
    
    // Draw glow behind logo
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(255, 100, 100, 0.7)';
    image(gameLogo, width/2, 80, 240, 80);
    
    // Draw logo
    drawingContext.shadowBlur = 0;
    image(gameLogo, width/2, 80, 220, 75);
    pop();
  } else {
    push();
    textAlign(CENTER);
    textSize(30);
    
    // Text glow effect
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(255, 0, 0, 0.7)';
    
    fill(255, 50, 50);
    stroke(0);
    strokeWeight(3);
    text("BELIZEAN FOOD FIGHT", width/2, 80);
    pop();
  }
  
  // Draw title with animated effect - reduced size
  push();
  textAlign(CENTER);
  textSize(36);
  
  // Text glow effect
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(255, 255, 0, 0.7)';
  
  // Pulsing effect
  let pulse = sin(frameCount * 0.05) * 5;
  
  fill(255, 255, 0);
  stroke(0);
  strokeWeight(3);
  text("TOP SCORES", width/2, 140 + pulse * 0.2);
  
  // Add decorative elements - reduced size
  noFill();
  stroke(255, 255, 0, 150);
  strokeWeight(2);
  rect(width/2 - 120, 110, 240, 50, 8);
  pop();
  
  // Check if data is available
  if (!leaderboardData || leaderboardData.length === 0) {
    // Display a loading message with animation
    push();
    textAlign(CENTER);
    textSize(20);
    fill(255);
    
    // Animated dots
    let dots = "";
    for (let i = 0; i < (frameCount / 20) % 4; i++) {
      dots += ".";
    }
    
    text("Loading leaderboard data" + dots, width/2, height/2);
    pop();
    return;
  }
  
  // Calculate leaderboard dimensions - reduced by ~50%
  const tableWidth = width * 0.7; // Reduced from full width
  const tableHeight = height * 0.6; // Reduced height
  const tableX = width/2 - tableWidth/2;
  const tableY = 170; // Positioned below the title
  const rowHeight = 35; // Reduced from 45
  
  // Draw table background
  push();
  fill(20, 20, 50, 150);
  noStroke();
  rect(tableX, tableY, tableWidth, tableHeight, 10);
  pop();
  
  // Draw table headers with decorative elements
  push();
  // Header background - FIXED: Corrected rect() syntax for rounded corners
  fill(30, 30, 80, 180);
  noStroke();
  rect(tableX, tableY, tableWidth, 40, 10); // Fixed: Using a single radius value
  
  textAlign(CENTER);
  textSize(20); // Reduced from 26
  fill(255);
  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
  
  // Draw header text
  text("RANK", tableX + tableWidth * 0.125, tableY + 25);
  text("NAME", tableX + tableWidth * 0.375, tableY + 25);
  text("LOCATION", tableX + tableWidth * 0.625, tableY + 25);
  text("SCORE", tableX + tableWidth * 0.875, tableY + 25);
  pop();
  
  // Draw table rows with alternating row colors and hover effects
  for (let i = 0; i < Math.min(leaderboardData.length, 10); i++) {
    const entry = leaderboardData[i];
    const y = tableY + 40 + i * rowHeight;
    
    push();
    // Row background (alternating colors)
    if (i % 2 === 0) {
      fill(30, 30, 60, 100);
    } else {
      fill(40, 40, 80, 100);
    }
    noStroke();
    rect(tableX, y, tableWidth, rowHeight);
    
    // Medal icons for top 3
    if (i < 3) {
      let medalColor;
      if (i === 0) medalColor = color(255, 215, 0); // Gold
      else if (i === 1) medalColor = color(192, 192, 192); // Silver
      else medalColor = color(205, 127, 50); // Bronze
      
      fill(medalColor);
      noStroke();
      ellipse(tableX + tableWidth * 0.125 - 25, y + rowHeight/2, 18, 18);
      
      fill(0);
      textSize(12);
      textAlign(CENTER, CENTER);
      text(i+1, tableX + tableWidth * 0.125 - 25, y + rowHeight/2);
    }
    
    textAlign(CENTER);
    textSize(18); // Reduced from 22
    
    // Rank
    if (i < 3) {
      fill(255, 255, 200);
    } else {
      fill(255);
    }
    text(i + 1, tableX + tableWidth * 0.125, y + rowHeight/2);
    
    // Name (truncate if too long)
    let displayName = entry.name || "Anonymous";
    if (displayName.length > 12) {
      displayName = displayName.substring(0, 10) + "...";
    }
    text(displayName, tableX + tableWidth * 0.375, y + rowHeight/2);
    
    // Location (truncate if too long)
    let displayLocation = entry.location || "Unknown";
    if (displayLocation.length > 12) {
      displayLocation = displayLocation.substring(0, 10) + "...";
    }
    text(displayLocation, tableX + tableWidth * 0.625, y + rowHeight/2);
    
    // Score with animation for high scores
    if (i < 3) {
      drawingContext.shadowBlur = 8;
      drawingContext.shadowColor = 'rgba(255, 255, 0, 0.7)';
      fill(255, 255, 0);
    } else {
      fill(255);
    }
    
    // Format score with commas
    const formattedScore = entry.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    text(formattedScore, tableX + tableWidth * 0.875, y + rowHeight/2);
    pop();
    
    // Highlight player's score if it matches
    if (entry.name === document.getElementById('nameInput')?.value && entry.score === score) {
      push();
      noFill();
      stroke(0, 255, 0);
      strokeWeight(2);
      rect(tableX, y, tableWidth, rowHeight);
      pop();
    }
  }
  
  // Store button dimensions as global variables for consistent reference
  window.leaderboardBackBtnX = width/2;
  window.leaderboardBackBtnY = height - 50;
  window.leaderboardBackBtnWidth = 250;
  window.leaderboardBackBtnHeight = 50;
  
  // Draw back button with improved styling - REPLACED SPACEBAR INSTRUCTION WITH BUTTON
  push();
  // Button glow on hover
  if (mouseX > window.leaderboardBackBtnX - window.leaderboardBackBtnWidth/2 && 
      mouseX < window.leaderboardBackBtnX + window.leaderboardBackBtnWidth/2 &&
      mouseY > window.leaderboardBackBtnY - window.leaderboardBackBtnHeight/2 && 
      mouseY < window.leaderboardBackBtnY + window.leaderboardBackBtnHeight/2) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(100, 100, 255, 0.8)';
    fill(80, 100, 220); // Brighter color on hover
  } else {
    fill(60, 80, 200); // Normal color
  }
  
  // Button background
  stroke(100, 120, 255);
  strokeWeight(3);
  rect(window.leaderboardBackBtnX - window.leaderboardBackBtnWidth/2, 
       window.leaderboardBackBtnY - window.leaderboardBackBtnHeight/2, 
       window.leaderboardBackBtnWidth, 
       window.leaderboardBackBtnHeight, 
       10);
  
  // Button text
  textAlign(CENTER, CENTER);
  textSize(22);
  fill(255);
  noStroke();
  text("RETURN TO START", window.leaderboardBackBtnX, window.leaderboardBackBtnY);
  pop();
  
  // Debug visualization of button hitbox
  if (debugMode) {
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(1);
    rect(window.leaderboardBackBtnX - window.leaderboardBackBtnWidth/2, 
         window.leaderboardBackBtnY - window.leaderboardBackBtnHeight/2, 
         window.leaderboardBackBtnWidth, 
         window.leaderboardBackBtnHeight);
    pop();
  }
  
  // Add this at the end of the function to ensure the back button is visible
  // Draw back button
  fill(0, 0, 0);
  rect(150, height - 50, 100, 40, 10);
  
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("", 150, height - 50);
  
  // If on mobile, add extra instructions
  if (isMobileDevice) {
    textSize(14);
    fill(255, 200, 0);
    text("Tap BACK to return to mobile warning", width/2, height - 20);
  }
}

// Add score submission form
function drawSubmitScoreForm() {
  // Draw enhanced background
  drawArcadeBackground();
  
  // Add particle effects
  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 5);
    
    push();
    fill(0, 255, 255, 100);
    noStroke();
    ellipse(x, y, size);
    pop();
  }
  
  // Draw game logo with glow
  if (gameLogo) {
    push();
    imageMode(CENTER);
    
    // Draw glow behind logo
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(255, 100, 100, 0.7)';
    image(gameLogo, width/2, 100, 320, 110);
    
    // Draw logo
    drawingContext.shadowBlur = 0;
    image(gameLogo, width/2, 100, 300, 100);
    pop();
  } else {
    push();
    textAlign(CENTER);
    textSize(40);
    
    // Text glow effect
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(255, 0, 0, 0.7)';
    
    fill(255, 50, 50);
    stroke(0);
    strokeWeight(4);
    text("BELIZEAN FOOD FIGHT", width/2, 100);
    pop();
  }
  
  // Draw title with enhanced styling
  push();
  textAlign(CENTER);
  textSize(42);
  
  // Text glow effect
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.7)';
  
  fill(255);
  stroke(0);
  strokeWeight(3);
  text("SUBMIT YOUR SCORE", width/2, 200);
  
  // Add decorative elements
  noFill();
  stroke(255, 255, 255, 150);
  strokeWeight(2);
  rect(width/2 - 220, 165, 440, 50, 10);
  pop();
  
  // Draw score with enhanced styling
  push();
  textAlign(CENTER);
  textSize(36);
  
  // Text glow effect
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(255, 255, 0, 0.6)';
  
  // Format score with commas
  const formattedScore = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  fill(255, 255, 0);
  stroke(0);
  strokeWeight(2);
  text("SCORE: " + formattedScore, width/2, 250);
  pop();
  
  // Create form if it doesn't exist
  if (!document.getElementById('nameInput')) {
    createLeaderboardForm();
  }
}

// Create leaderboard form
function createLeaderboardForm() {
  removeAllFormElements();
  
  // Create name input with enhanced styling
  nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'nameInput';
  nameInput.placeholder = 'Your Name';
  nameInput.style.position = 'absolute';
  nameInput.style.left = '50%';
  nameInput.style.top = '350px';
  nameInput.style.transform = 'translateX(-50%)';
  nameInput.style.width = '300px';
  nameInput.style.padding = '12px 15px';
  nameInput.style.fontSize = '16px';
  nameInput.style.backgroundColor = 'rgba(20, 20, 20)';
  nameInput.style.color = 'white';
  nameInput.style.border = '2px solid #4CAF50';
  nameInput.style.borderRadius = '8px';
  nameInput.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
  nameInput.style.zIndex = '100';
  nameInput.style.outline = 'none';
  document.body.appendChild(nameInput);
  
  // Create email input with enhanced styling
  emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'emailInput';
  emailInput.placeholder = 'Your Email';
  emailInput.style.position = 'absolute';
  emailInput.style.left = '50%';
  emailInput.style.top = '420px';
  emailInput.style.transform = 'translateX(-50%)';
  emailInput.style.width = '300px';
  emailInput.style.padding = '12px 15px';
  emailInput.style.fontSize = '16px';
  emailInput.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  emailInput.style.color = 'white';
  emailInput.style.border = '2px solid #4CAF50';
  emailInput.style.borderRadius = '8px';
  emailInput.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
  emailInput.style.zIndex = '100';
  emailInput.style.outline = 'none';
  document.body.appendChild(emailInput);
  
  // Create location input with enhanced styling
  locationInput = document.createElement('input');
  locationInput.type = 'text';
  locationInput.id = 'locationInput';
  locationInput.placeholder = 'Your Location';
  locationInput.style.position = 'absolute';
  locationInput.style.left = '50%';
  locationInput.style.top = '490px';
  locationInput.style.transform = 'translateX(-50%)';
  locationInput.style.width = '300px';
  locationInput.style.padding = '12px 15px';
  locationInput.style.fontSize = '16px';
  locationInput.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  locationInput.style.color = 'white';
  locationInput.style.border = '2px solid #4CAF50';
  locationInput.style.borderRadius = '8px';
  locationInput.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
  locationInput.style.zIndex = '100';
  locationInput.style.outline = 'none';
  document.body.appendChild(locationInput);
  
  // Create submit button with enhanced styling
  submitButton = document.createElement('button');
  submitButton.id = 'submitButton';
  submitButton.textContent = 'SUBMIT';
  submitButton.style.position = 'absolute';
  submitButton.style.left = '50%';
  submitButton.style.top = '560px';
  submitButton.style.transform = 'translateX(-50%)';
  submitButton.style.width = '300px';
  submitButton.style.padding = '15px';
  submitButton.style.fontSize = '20px';
  submitButton.style.fontWeight = 'bold';
  submitButton.style.backgroundColor = '#4CAF50';
  submitButton.style.color = 'white';
  submitButton.style.border = 'none';
  submitButton.style.borderRadius = '8px';
  submitButton.style.cursor = 'pointer';
  submitButton.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.7)';
  submitButton.style.zIndex = '100';
  submitButton.style.transition = 'all 0.2s ease';
  submitButton.onclick = submitLeaderboardScore;
  
  // Add hover effect
  submitButton.onmouseover = function() {
    this.style.backgroundColor = '#45a049';
    this.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.9)';
  };
  submitButton.onmouseout = function() {
    this.style.backgroundColor = '#4CAF50';
    this.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.7)';
  };
  
  document.body.appendChild(submitButton);
  
  // Set canvas to lower z-index
  let canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.style.zIndex = '1';
  }
  
  // Focus on name input
  nameInput.focus();
}

// Improved function to remove all form elements
function removeAllFormElements() {
  try {
    // Remove individual elements
    const elements = ['nameInput', 'emailInput', 'locationInput', 'submitButton'];
    elements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        document.body.removeChild(element);
      }
    });
  } catch (error) {
    console.log('Error removing form elements:', error);
  }
}

// Submit score to leaderboard
async function submitLeaderboardScore() {
  // Get values from form inputs
  const name = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const location = document.getElementById('locationInput').value.trim();
  
  // Validate inputs
  if (!name) {
    alert('Please enter your name');
    return;
  }
  
  if (!email || !validateEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }
  
  if (!location) {
    alert('Please enter your location');
    return;
  }
  
  try {
    // Show loading state
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
      submitButton.textContent = 'Submitting...';
      submitButton.disabled = true;
    }
    
    // Get character from player object or use a default value
    const characterParty = player ? player.party : 'unknown';
    
    // Log the score being submitted for debugging
    console.log("Submitting score to database:", score);
    
    // Submit score to Supabase - ensure score is converted to a number
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([
        { 
          name: name, 
          email: email, 
          location: location,
          score: Number(score), // Ensure score is a number
          character: characterParty
        }
      ]);
    
    if (error) throw error;
    
    console.log("Score submitted successfully:", data);
    
    // Reset button state
    if (submitButton) {
      submitButton.textContent = 'SUBMIT';
      submitButton.disabled = false;
    }
    
    // Remove form and show leaderboard
    removeAllFormElements();
    gameState = 'leaderboard';
    await fetchLeaderboard();
    
  } catch (error) {
    console.error('Error submitting score:', error);
    alert('Error submitting score. Please try again.');
    
    // Reset button state
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
      submitButton.textContent = 'SUBMIT';
      submitButton.disabled = false;
    }
  }
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Find player's rank in leaderboard - updated to take parameters
function findPlayerRank(name, score) {
  for (let i = 0; i < leaderboardData.length; i++) {
    if (leaderboardData[i].name === name && 
        leaderboardData[i].score === score) {
      return i + 1;
    }
  }
  return 0;
}

// Fetch leaderboard data
async function fetchLeaderboard() {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false });
    
    if (error) throw error;
    
    // Assign to the global variable
    leaderboardData = data || [];
    console.log("Leaderboard data fetched:", leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    leaderboardData = []; // Reset to empty array on error
  }
}

// Handle keyboard input
function keyPressed() {
  // Handle game controls
  if (gameState === "play") {
    // Pause game with Escape key
    if (keyCode === ESCAPE) {
      gameState = "paused";
    }
    
    // Shoot with spacebar
    if (key === ' ' && player) {
      player.shoot();
    }
    
    // Weapon switching with number keys
    if (player && key >= '1' && key <= '7') {
      let weaponIndex = parseInt(key) - 1;
      if (weaponIndex < projectileTypes.length) {
        player.currentProjectile = projectileTypes[weaponIndex];
        
        // Show weapon switch message
        floatingTexts.push(new FloatingText(
          `${player.currentProjectile.name} ${player.currentProjectile.emoji}`,
          player.x,
          player.y - 50,
          'powerUp'
        ));
      }
    }
    
    // Cycle weapons with Q and E
    if (player && key === 'q') {
      player.prevWeapon();
    }
    if (player && key === 'e') {
      player.nextWeapon();
    }
    
    // Debug: Spawn power-up with P key
    if (key === 'p') {
      let types = ['weapon', 'health', 'ammo'];
      let type = random(types);
      powerUps.push(new PowerUp(
        player.x + random(-100, 100),
        player.y + random(-100, 100),
        type
      ));
      console.log(`Debug: Spawned ${type} power-up`);
    }
    
    // Debug: Toggle debug mode with D key
    if (key === 'd') {
      debugMode = !debugMode;
      console.log(`Debug mode: ${debugMode}`);
    }
  } else if (gameState === "paused") {
    // Resume game with Escape key
    if (keyCode === ESCAPE) {
      gameState = "play";
    }
  }
  
  // Debug controls
  if (key === 'g') {
    // Game over for testing
    gameState = "gameOver";
  } else if (key === 'w') {
    // Win for testing
    gameState = "win";
  }
}

// Enemy class
class Enemy {
  constructor() {
    this.size = 40;
    this.health = 35; // Increased from 30 to 35
    this.x = width + this.size;
    this.y = random(this.size, height - this.size);
    this.party = random(enemyParties);
    this.speed = random(2, 4);
    
    // Adjust shoot timer based on level - enemies shoot more frequently in higher levels
    let baseShootDelay = 120;
    let levelFactor = Math.max(0, 1 - (level * 0.1)); // Reduces delay by 10% per level
    this.shootTimer = random(baseShootDelay * levelFactor, baseShootDelay * 1.5 * levelFactor);
    
    this.direction = 'left';  // They're always moving left
    // Randomly select a projectile type for this enemy
    this.projectileType = random(projectileTypes.slice(0, 3)); // Use first 3 types
    this.hitFlashTimer = 0;
  }

  draw() {
    push();
    imageMode(CENTER);
    
    // Get the correct sprite based on party
    let characterImage = gameCharacterSprites[this.party];
    if (characterImage) {
      let baseHeight = 100;  // Slightly smaller than player
      let baseWidth = baseHeight * (characterAspectRatios[this.party] || 1);
      
      // Add hit flash effect
      if (this.hitFlashTimer > 0) {
        tint(255, 0, 0);
        this.hitFlashTimer--;
      }
      
      // Draw the character sprite facing left
      push();
      scale(-1, 1);  // Flip horizontally since they're moving left
      image(characterImage, -this.x, this.y, baseWidth, baseHeight);
      pop();
    } else {
      // Fallback if sprite not loaded
      fill(getPartyColor(this.party));
      noStroke();
      ellipse(this.x, this.y, this.size, this.size);
    }
    
    // Draw health bar
    let healthBarWidth = 50;
    let healthBarHeight = 5;
    noStroke();
    fill(255, 0, 0);
    rect(this.x - healthBarWidth/2, this.y - 50, healthBarWidth, healthBarHeight);
    fill(0, 255, 0);
    rect(this.x - healthBarWidth/2, this.y - 50, 
         (this.health/30) * healthBarWidth, healthBarHeight);
    
    pop();
  }

  move() {
    this.x -= this.speed;
    
    // Handle shooting
    this.shootTimer--;
    if (this.shootTimer <= 0) {
      this.shoot();
      this.shootTimer = random(60, 120);
    }
  }

  shoot() {
    let projectile = new Projectile(
      this.x - this.size/2,
      this.y,
      this.projectileType,  // Use enemy's projectile type
      1
    );
    projectile.vx = -8;  // Move left
    projectiles.push(projectile);
    
    // Add visual effects for enemy shooting
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(
        this.x - this.size/2,
        this.y,
        this.projectileType.color
      ));
    }
  }

  hit(damage) {
    this.health -= damage;
    this.hitFlashTimer = 5;  // Flash for 5 frames
    
    // Log hit for debugging
    console.log(`Enemy hit! Health: ${this.health}, Damage: ${damage}`);
    
    // Add small screen shake on hit
    addScreenShake(3);
    
    return this.health <= 0;
  }
}

// Update enemy spawning to ensure different party from player
function spawnEnemy() {
  if (enemies.length < totalEnemiesPerLevel[level - 1]) {
    let enemy = new Enemy();
    // Make sure enemy is from a different party than player
    while (enemy.party === player.party) {
      enemy.party = random(enemyParties);
    }
    enemies.push(enemy);
    
    // Occasionally spawn a power-up with each new enemy (REDUCED from 5% to 2% chance)
    if (random() < 0.02) {
      let powerUpType = random(['weapon', 'health', 'ammo']);
      let x = random(width * 0.2, width * 0.8);
      let y = random(height * 0.2, height * 0.8);
      powerUps.push(new PowerUp(x, y, powerUpType));
      console.log(`Spawned ${powerUpType} power-up at ${x}, ${y}`);
    }
  }
}

// Add this to your draw or drawGame function
function updateEnemySpawning() {
  spawnCounter++;
  if (spawnCounter >= spawnInterval) {
    // Only spawn if we haven't reached the level's enemy count
    if (enemies.length + enemiesKilled < totalEnemiesPerLevel[level - 1]) {
      spawnEnemy();
      console.log(`Spawned enemy. Total spawned: ${enemies.length + enemiesKilled}`); // Debug log
    }
    spawnCounter = 0;
  }
  
  // Remove enemies that have gone off screen
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].x < -enemies[i].size) {
      enemies.splice(i, 1);
      // Don't count escaped enemies towards defeated total
    }
  }
}

// Add level progression bonuses
function checkLevelCompletion() {
  console.log(`Checking level completion: ${enemiesKilled} / ${totalEnemiesPerLevel[level - 1]}`); // Debug log
  
  if (enemiesKilled >= totalEnemiesPerLevel[level - 1]) {
    if (level < totalEnemiesPerLevel.length) {
      // Add level completion bonus
      let levelBonus = level * 500;
      
      // FIX: Update both score variables
      score += levelBonus;
      player.score += levelBonus;
      
      console.log(`Level ${level} completed! Bonus: ${levelBonus}, New score: ${score}`);
      
      // Show level completion message with bonus
      floatingTexts.push(new FloatingText(
        `Level ${level} Complete! +${levelBonus} points!`, 
        width/2, 
        height/2 - 50, 
        'powerUp'
      ));
      
      level++;
      enemiesKilled = 0;  // Reset counter for next level
      floatingTexts.push(new FloatingText(`Level ${level}! 🎮`, width/2, height/2, 'powerUp'));
      
      // Clear any remaining enemies
      enemies = [];
      
      console.log(`Level up! Now on level ${level}`); // Debug log
    } else {
      gameState = 'win';
    }
  }
}

function checkCollisions() {
  // Check projectile hits on enemies
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let projectile = projectiles[i];
    
    if (projectile.vx > 0) {  // Player projectile
      for (let j = enemies.length - 1; j >= 0; j--) {
        let enemy = enemies[j];
        let d = dist(projectile.x, projectile.y, enemy.x, enemy.y);
        
        if (d < enemy.size/2 + projectile.size/2) {
          // Calculate damage - ensure it's significant enough
          let damage = projectile.damage || 1;
          let actualDamage = damage * 10;
          
          console.log(`Hit enemy with ${projectile.type.name}, damage: ${actualDamage}, enemy health: ${enemy.health}`);
          
          if (enemy.hit(actualDamage)) {
            // Enemy defeated - REDUCED chance to spawn power-up (from 50% to 25%)
            if (random() < 0.25) {
              // Weighted random selection for power-up type
              let powerUpRoll = random();
              let powerUpType;
              
              if (powerUpRoll < 0.4) {
                powerUpType = 'ammo';  // 40% chance for ammo
              } else if (powerUpRoll < 0.7) {
                powerUpType = 'health'; // 30% chance for health
              } else {
                powerUpType = 'weapon'; // 30% chance for weapon
              }
              
              powerUps.push(new PowerUp(enemy.x, enemy.y, powerUpType));
              console.log(`Enemy defeated! Spawned ${powerUpType} power-up`);
            }
            
            enemies.splice(j, 1);
            enemiesKilled++;
            
            // Add to player's combo
            player.addCombo();
            
            // Calculate score with multiplier
            let baseScore = 100;
            let bonusScore = baseScore * player.scoreMultiplier;
            
            // Update both score variables
            score += bonusScore;
            player.score += bonusScore;
            
            console.log(`Score updated: Global score = ${score}, Player score = ${player.score}`);
            
            // Show score popup
            floatingTexts.push(new FloatingText(
              `+${bonusScore}`,
              enemy.x,
              enemy.y - 60,
              'hit'
            ));
            
            // Add bigger screen shake for defeat
            addScreenShake(5);
            
            // Show defeat phrase
            floatingTexts.push(new FloatingText(
              random(belizeanPhrases.defeat),
              enemy.x,
              enemy.y - 30,
              'defeat'
            ));
            
            // Create defeat effect with more particles
            for (let k = 0; k < 15; k++) {
              let particle = new Particle(
                enemy.x,
                enemy.y,
                '#FFD700'
              );
              particle.size = random(5, 15);  // Larger particles
              particle.life = random(200, 300);  // Longer life
              particles.push(particle);
            }
            
            checkLevelCompletion();
          }
          
          // Show hit phrase
          if (random() < 0.3) {  // 30% chance to show phrase
            floatingTexts.push(new FloatingText(
              random(belizeanPhrases.hit),
              enemy.x,
              enemy.y - 30,
              'hit'
            ));
          }
          
          // Create hit effect with particles matching projectile color
          for (let k = 0; k < 8; k++) {
            particles.push(new Particle(
              enemy.x,
              enemy.y,
              projectile.type.color
            ));
          }
          
          projectiles.splice(i, 1);
          break;
        }
      }
    } else {  // Enemy projectile
      // Check collision with player
      if (player) {
        let d = dist(projectile.x, projectile.y, player.x, player.y);
        if (d < player.size/2 + projectile.size/2 && !player.invincible) {
          projectiles.splice(i, 1);
          player.hit();  // Call player hit method
          
          // Create hit effect
          for (let k = 0; k < 8; k++) {
            particles.push(new Particle(
              player.x,
              player.y,
              '#FF0000'
            ));
          }
          break;
        }
      }
    }
  }

  // Check power-up collisions with player
  if (player) {
    for (let i = powerUps.length - 1; i >= 0; i--) {
      let powerUp = powerUps[i];
      let d = dist(powerUp.x, powerUp.y, player.x, player.y);
      
      if (d < (player.size/2 + powerUp.size/2)) {
        console.log(`Player collected ${powerUp.type} power-up`);
        powerUp.collect(player);
        powerUps.splice(i, 1);
      }
    }
  }

  // Check enemy collision with player
  if (player) {
    for (let enemy of enemies) {
      let d = dist(enemy.x, enemy.y, player.x, player.y);
      if (d < (enemy.size + player.size)/2 && !player.invincible) {
        player.hit();
        
        // Create collision effect
        for (let k = 0; k < 12; k++) {
          particles.push(new Particle(
            player.x,
            player.y,
            '#FF0000'
          ));
        }
      }
    }
  }
}

// New function to spawn random power-ups with reduced frequency
function spawnRandomPowerUp() {
  // Don't spawn too many power-ups
  if (powerUps.length > 3) return; // Reduced max from 5 to 3
  
  // Weighted random selection for power-up type
  let powerUpRoll = random();
  let powerUpType;
  
  if (powerUpRoll < 0.4) {
    powerUpType = 'ammo';  // 40% chance for ammo
  } else if (powerUpRoll < 0.7) {
    powerUpType = 'health'; // 30% chance for health
  } else {
    powerUpType = 'weapon'; // 30% chance for weapon
  }
  
  // Spawn in a visible area, not too close to edges
  let x = random(width * 0.2, width * 0.8);
  let y = random(height * 0.2, height * 0.8);
  
  powerUps.push(new PowerUp(x, y, powerUpType));
  console.log(`Randomly spawned ${powerUpType} power-up at ${x}, ${y}`);
  
  // Create a visual effect to draw attention
  for (let i = 0; i < 8; i++) {
    let particle = new Particle(x, y, powerUpType === 'health' ? '#FF0000' : 
                                      powerUpType === 'ammo' ? '#FFD700' : '#00FFFF');
    particle.size = random(5, 10);
    particle.life = 120;
    particles.push(particle);
  }
}

function preload() {
  try {
    // Set assetsLoaded to false initially
    assetsLoaded = false;
    
    console.log('Starting to load images...');
    
    // Load Marie Sharp sprite with better error handling
    loadImage('assets/foods/marie-sharp-bottle.png', 
      // Success callback
      (img) => {
        console.log('Marie Sharp bottle loaded successfully:', img.width, 'x', img.height);
        marieSharpSprite = img;
      },
      // Error callback
      (err) => {
        console.error('Error loading Marie Sharp bottle:', err);
        marieSharpSprite = null;
      }
    );

    // Load food sprites with correct associations and error handling
    const foodSpritePaths = {
      'Marie Sharp': 'assets/foods/marie-sharp.png',
      'Fry Jack': 'assets/foods/fry-jack.png',
      'Tamales': 'assets/foods/tamales.png',
      'Hudut': 'assets/foods/hudut.png',
      'Bukut': 'assets/foods/bukut.png',
      'Rice and Beans': 'assets/foods/rice-and-beans.png',
      'Chancla': 'assets/foods/chancla.png'
    };

    for (let spriteName in foodSpritePaths) {
      loadImage(foodSpritePaths[spriteName], 
        img => {
          foodSprites[spriteName] = img;
          console.log(`Loaded ${spriteName} sprite successfully: ${img.width}x${img.height}`);
        },
        (err) => {
          console.error(`Failed to load ${spriteName} sprite:`, err);
        }
      );
    }
    
    // Load character sprites with direct paths based on the file structure
    console.log("Loading character sprites...");
    
    // Load fight character sprites directly from the correct paths
    loadImage('characters/pup-fight-character.png', 
      img => {
        console.log('Loaded PUP fight character successfully');
        gameCharacterSprites['PUP'] = img;
        characterAspectRatios['PUP'] = img.width / img.height;
      },
      (err) => console.error('Failed to load PUP fight character:', err)
    );
    
    loadImage('characters/udp-fight-character.png', 
      img => {
        console.log('Loaded UDP fight character successfully');
        gameCharacterSprites['UDP'] = img;
        characterAspectRatios['UDP'] = img.width / img.height;
      },
      (err) => console.error('Failed to load UDP fight character:', err)
    );
    
    loadImage('characters/alliance-fight-character.png', 
      img => {
        console.log('Loaded ALLIANCE fight character successfully');
        gameCharacterSprites['ALLIANCE'] = img;
        characterAspectRatios['ALLIANCE'] = img.width / img.height;
      },
      (err) => console.error('Failed to load ALLIANCE fight character:', err)
    );

    // Load game logo
    loadImage('assets/game_logo.png', 
      img => {
        gameLogo = img;
        console.log('Game logo loaded successfully');
      },
      (err) => {
        console.error('Failed to load game logo:', err);
        // Try alternate path
        loadImage('game_logo.png', 
          img => {
            gameLogo = img;
            console.log('Game logo loaded from alternate path');
          },
          () => console.error('Failed to load game logo from all paths')
        );
      }
    );

    // Load George Price sprite for health power-up
    loadImage('characters/george-price-character.png', 
      img => {
        georgePriceSprite = img;
        console.log('Loaded George Price sprite successfully');
      }, 
      (err) => {
        console.error('Failed to load George Price sprite:', err);
      }
    );

    // Load Exploring Belize logo
    exploringBelizeLogo = loadImage('assets/exploringbelize_logo_small.png');

    // Load Fencepost Gear logo
    fencepostLogo = loadImage('assets/fencepost_logo_official_small.png');

    // Set a timeout to mark assets as loaded even if some fail
    setTimeout(() => {
      if (!assetsLoaded) {
        console.log('Setting assetsLoaded to true after timeout');
        assetsLoaded = true;
      }
    }, 5000);

    // Load logo images with correct paths
    console.log("Loading logo images...");
    try {
      risiLogo = loadImage('characters/risi_bobblehead.png', 
        () => console.log("Risi logo loaded successfully"),
        () => console.error("Failed to load Risi logo")
      );
      fencepostLogo = loadImage('assets/fencepost_logo_official_small.png',
        () => console.log("Fencepost logo loaded successfully"),
        () => console.error("Failed to load Fencepost logo")
      );
      exploringBelizeLogo = loadImage('assets/exploringbelize_logo_small.png',
        () => console.log("Exploring Belize logo loaded successfully"),
        () => console.error("Failed to load Exploring Belize logo")
      );
    } catch (e) {
      console.error("Error loading logo images:", e);
    }

  } catch (err) {
    console.error('Critical error in preload:', err);
    marieSharpSprite = null;
    loadingError = true;
    assetsLoaded = true;
  }
}

// Add this function to create colored fallback characters
function createFallbackCharacters() {
  console.log("Creating fallback character images");
  
  // Create fallback character sprites if they failed to load
  if (!gameCharacterSprites['PUP']) {
    console.log("Creating fallback PUP character");
    let pg = createGraphics(100, 150);
    pg.background(0, 0, 255);
    pg.fill(255);
    pg.textSize(20);
    pg.textAlign(CENTER, CENTER);
    pg.text("PUP", 50, 75);
    gameCharacterSprites['PUP'] = pg;
    characterAspectRatios['PUP'] = 2/3;
  }
  
  if (!gameCharacterSprites['UDP']) {
    console.log("Creating fallback UDP character");
    let pg = createGraphics(100, 150);
    pg.background(255, 0, 0);
    pg.fill(255);
    pg.textSize(20);
    pg.textAlign(CENTER, CENTER);
    pg.text("UDP", 50, 75);
    gameCharacterSprites['UDP'] = pg;
    characterAspectRatios['UDP'] = 2/3;
  }
  
  if (!gameCharacterSprites['ALLIANCE']) {
    console.log("Creating fallback ALLIANCE character");
    let pg = createGraphics(100, 150);
    pg.background(0, 255, 0);
    pg.fill(255);
    pg.textSize(20);
    pg.textAlign(CENTER, CENTER);
    pg.text("ALLIANCE", 50, 75);
    gameCharacterSprites['ALLIANCE'] = pg;
    characterAspectRatios['ALLIANCE'] = 2/3;
  }
  
  // Create fallback game logo if it failed to load
  if (!gameLogo) {
    console.log("Creating fallback game logo");
    let pg = createGraphics(400, 120);
    pg.background(100, 0, 50);
    pg.fill(255, 50, 50);
    pg.textSize(40);
    pg.textAlign(CENTER, CENTER);
    pg.text("BELIZEAN FOOD FIGHT", 200, 40);
    pg.fill(255, 215, 0);
    pg.textSize(24);
    pg.text("ELECTIONS 2025 EDITION", 200, 80);
    gameLogo = pg;
  }
}

// Add this after the Projectile class
class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // Can be 'weapon', 'health', 'ammo', etc.
    this.size = 40; // Increased size for better visibility
    this.collected = false;
    this.pulseAmount = 0;
    this.pulseDirection = 1;
    
    // Make weapon power-ups more balanced - higher chance of less powerful weapons
    if (type === 'weapon') {
      // Weighted random selection - higher chance for lower spread weapons
      let weights = [0, 30, 25, 20, 15, 10]; // Weights for indices 1-5 (skipping 0 and 6)
      let totalWeight = weights.reduce((a, b) => a + b, 0);
      let random_num = random(0, totalWeight);
      let weightSum = 0;
      
      this.weaponIndex = 1; // Default to Fry Jack (index 1)
      for (let i = 0; i < weights.length; i++) {
        weightSum += weights[i];
        if (random_num <= weightSum) {
          this.weaponIndex = i + 1; // +1 because we're skipping index 0
          break;
        }
      }
      
      // Ensure it's a valid index
      if (this.weaponIndex >= projectileTypes.length || this.weaponIndex === 6) {
        this.weaponIndex = 1; // Default to Fry Jack if something went wrong
      }
    } else {
      this.weaponIndex = 0;
    }
    
    this.healAmount = 20; // Reduced from 25 to 20
    this.ammoAmount = 10; // Reduced from 15 to 10
    this.floatOffset = 0;
    this.floatSpeed = random(0.03, 0.06);
    this.rotationAngle = 0;
    this.rotationSpeed = random(-0.02, 0.02);
  }

  update() {
    // Add a pulsing effect
    this.pulseAmount += 0.05 * this.pulseDirection;
    if (this.pulseAmount > 1) {
      this.pulseDirection = -1;
    } else if (this.pulseAmount < 0) {
      this.pulseDirection = 1;
    }
    
    // Add floating motion
    this.floatOffset = sin(frameCount * this.floatSpeed) * 5;
    
    // Add rotation
    this.rotationAngle += this.rotationSpeed;
    
    return !this.collected;
  }

  draw() {
    push();
    imageMode(CENTER);
    
    // Apply floating motion
    translate(this.x, this.y + this.floatOffset);
    
    // Apply rotation
    rotate(this.rotationAngle);
    
    // Pulse effect
    let scale = 1 + this.pulseAmount * 0.2;
    
    // Draw based on type
    if (this.type === 'weapon') {
      // Draw weapon power-up
      let weaponType = projectileTypes[this.weaponIndex];
      
      // Draw glow effect first
      drawingContext.shadowBlur = 15 + this.pulseAmount * 5;
      drawingContext.shadowColor = weaponType.color;
      
      // Draw outer ring
      noFill();
      strokeWeight(3);
      stroke(weaponType.color);
      circle(0, 0, this.size * scale * 1.2);
      
      // Draw inner circle
      fill(weaponType.color);
      noStroke();
      circle(0, 0, this.size * scale);
      
      // Draw weapon emoji in center
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(255);
      text(weaponType.emoji, 0, 0);
      
    } else if (this.type === 'health') {
      // Draw health power-up
      
      // Draw glow effect
      drawingContext.shadowBlur = 15 + this.pulseAmount * 5;
      drawingContext.shadowColor = 'red';
      
      // Draw outer ring
      noFill();
      strokeWeight(3);
      stroke(255, 0, 0);
      circle(0, 0, this.size * scale * 1.2);
      
      // Draw inner circle
      fill(255, 0, 0);
      noStroke();
      circle(0, 0, this.size * scale);
      
      // Draw health emoji
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(255);
      text('❤️', 0, 0);
      
    } else if (this.type === 'ammo') {
      // Draw ammo power-up
      
      // Draw glow effect
      drawingContext.shadowBlur = 15 + this.pulseAmount * 5;
      drawingContext.shadowColor = 'gold';
      
      // Draw outer ring
      noFill();
      strokeWeight(3);
      stroke(255, 215, 0);
      circle(0, 0, this.size * scale * 1.2);
      
      // Draw inner circle
      fill(255, 215, 0);
      noStroke();
      circle(0, 0, this.size * scale);
      
      // Draw ammo emoji
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(255);
      text('🔄', 0, 0);
    }
    
    pop();
  }

  collect(player) {
    if (this.type === 'weapon') {
      // Unlock this weapon type
      let weaponIndex = this.weaponIndex;
      player.addWeapon(weaponIndex);
      
      // Change player's weapon to the new one
      player.currentProjectile = projectileTypes[weaponIndex];
      player.weaponSwitchTimer = 15; // 15 frames of effect
      
      // Give ammo based on weapon type - less ammo for spread weapons
      let weaponType = projectileTypes[weaponIndex];
      let ammoAmount = Math.max(5, Math.floor(15 - weaponType.spread * 2));
      player.ammo = Math.min(player.maxAmmo, player.ammo + ammoAmount);
      
      // Add screen shake
      addScreenShake(3);
      
      // Show power-up message
      floatingTexts.push(new FloatingText(
        `${player.currentProjectile.name} ${player.currentProjectile.emoji} +${ammoAmount} Ammo`,
        player.x,
        player.y - 50,
        'powerUp'
      ));
      
      // Also show a Belizean phrase
      floatingTexts.push(new FloatingText(
        random(belizeanPhrases.powerUp),
        player.x,
        player.y - 80,
        'powerUp'
      ));
    } else if (this.type === 'health') {
      // Restore player health
      let oldHealth = player.health;
      player.health = min(100, player.health + this.healAmount);
      let actualHeal = player.health - oldHealth;
      
      // Add screen shake
      addScreenShake(2);
      
      // Show health message
      floatingTexts.push(new FloatingText(
        `+${actualHeal} Health ❤️`,
        player.x,
        player.y - 50,
        'powerUp'
      ));
    } else if (this.type === 'ammo') {
      // Add ammo - amount depends on current weapon type
      let oldAmmo = player.ammo;
      let ammoBonus = this.ammoAmount;
      
      // Reduce ammo bonus for spread weapons
      if (player.currentProjectile.spread > 0) {
        ammoBonus = Math.floor(ammoBonus / (1 + player.currentProjectile.spread * 0.3));
      }
      
      player.ammo = min(player.maxAmmo, player.ammo + ammoBonus);
      let actualAmmo = player.ammo - oldAmmo;
      
      // Add screen shake
      addScreenShake(2);
      
      // Show ammo message
      floatingTexts.push(new FloatingText(
        `+${actualAmmo} Ammo 🔄`,
        player.x,
        player.y - 50,
        'powerUp'
      ));
    }
    
    // Create collection effect
    for (let i = 0; i < 15; i++) {
      let color;
      if (this.type === 'weapon') {
        color = player.currentProjectile.color;
      } else if (this.type === 'health') {
        color = '#FF0000';
      } else {
        color = '#FFD700';
      }
      
      let particle = new Particle(
        this.x,
        this.y,
        color
      );
      particle.size = random(5, 15);
      particle.life = random(100, 200);
      particles.push(particle);
    }
    
    this.collected = true;
  }
}

// Add this function to spawn power-ups
function spawnPowerUp() {
  // Randomly decide if we should spawn a power-up
  if (random() < 0.3) { // 30% chance
    // Determine power-up type
    let types = ['weapon', 'health', 'ammo'];
    let type = random(types);
    
    // Create power-up at random position (not too close to edges)
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    
    powerUps.push(new PowerUp(x, y, type));
  }
}

// Add screen shake effect
function addScreenShake(intensity) {
  shakeScreen = intensity;
}

// Add this function near the end of your file
function detectMobileDevice() {
  // Check if the device is mobile based on screen size and user agent
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
  const isTablet = /tablet|ipad|playbook|silk|android(?!.*mobile)/i.test(userAgent);
  
  // Also check screen size as a backup method
  const touchScreen = (window.innerWidth <= 800 || window.innerHeight <= 600);
  
  // Set the flag if any of the checks indicate a mobile device
  isMobileDevice = isMobile || isTablet || touchScreen;
  
  // Log detailed device information for debugging
  console.log("Device detection details:");
  console.log("- User Agent:", userAgent);
  console.log("- Window Size:", window.innerWidth, "x", window.innerHeight);
  console.log("- Is Mobile:", isMobile);
  console.log("- Is Tablet:", isTablet);
  console.log("- Touch Screen:", touchScreen);
  console.log("- Final Decision:", isMobileDevice ? "Mobile/Tablet" : "Desktop");
  
  return isMobileDevice;
}

// Update the drawMobileWarning function to place sponsor logos side by side
function drawMobileWarning() {
  // Clear the background
  background(0);
  
  // Log canvas dimensions for debugging
  console.log("Drawing mobile warning on canvas:", width, "x", height);
  
  // Draw grid background similar to the arcade background
  push();
  stroke(20, 20, 40);
  strokeWeight(1);
  
  // Draw responsive grid lines based on screen size
  const gridSize = min(30, width / 20); // Responsive grid size
  
  // Draw vertical grid lines
  for (let x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  
  // Draw horizontal grid lines
  for (let y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }
  pop();
  
  // Calculate responsive spacing based on screen height
  const topMargin = height * 0.05;
  const contentWidth = min(width * 0.9, 500); // Limit maximum width
  
  // Draw game logo at the top with responsive sizing
  if (gameLogo) {
    // Make logo smaller and centered
    const logoWidth = min(width * 0.8, 300);
    const logoHeight = logoWidth * (gameLogo.height / gameLogo.width);
    
    // Center the logo horizontally
    const logoX = width/2 - logoWidth/2;
    const logoY = topMargin;
    
    image(gameLogo, logoX, logoY, logoWidth, logoHeight);
    console.log("Drawing logo at:", logoX, logoY, logoWidth, logoHeight);
  }
  
  // Update blink timer (oscillates between 0 and 1 every second)
  warningBlinkTimer = (warningBlinkTimer + 0.05) % 2;
  const blinkAlpha = warningBlinkTimer < 1 ? 255 : 200; // Blink effect
  
  // Calculate positions based on logo
  const logoHeight = gameLogo ? min(width * 0.8, 300) * (gameLogo.height / gameLogo.width) : 0;
  const warningY = topMargin + logoHeight + height * 0.05;
  
  // Draw warning text with improved wrapping
  textAlign(CENTER, CENTER);
  
  // Main warning text - bold, yellow, and blinking
  const warningTextSize = min(24, width/20);
  textSize(warningTextSize);
  fill(255, 255, 0, blinkAlpha); // Yellow with blinking effect
  textStyle(BOLD); // Make text bold
  
  // Always split the text into two lines for better readability on mobile
  text("This game is designed", width/2, warningY);
  text("for desktop browsers!", width/2, warningY + warningTextSize * 1.2);
  
  // Secondary warning text
  textStyle(NORMAL);
  const secondaryTextSize = min(18, width/25);
  textSize(secondaryTextSize);
  fill(255);
  
  const secondaryY = warningY + warningTextSize * 2.5;
  
  // Always split the secondary text into two lines for better readability
  text("Please visit on a desktop computer", width/2, secondaryY);
  text("for the best experience.", width/2, secondaryY + secondaryTextSize * 1.2);
  
  // Draw leaderboard button with improved positioning - moved down further by 50px total
  const btnY = secondaryY + secondaryTextSize * 5 + 50; // Added 50px to move it down (20px + 30px more)
  const btnWidth = min(250, width * 0.7);
  const btnHeight = min(50, height * 0.07);
  
  mobileUI.leaderboardBtn = {
    x: width/2,
    y: btnY,
    width: btnWidth,
    height: btnHeight
  };
  
  // Draw button with hover effect
  if (mouseX > width/2 - btnWidth/2 && 
      mouseX < width/2 + btnWidth/2 &&
      mouseY > btnY - btnHeight/2 &&
      mouseY < btnY + btnHeight/2) {
    fill(80, 80, 220); // Lighter blue on hover
  } else {
    fill(50, 50, 200);
  }
  
  rect(width/2 - btnWidth/2, 
       btnY - btnHeight/2, 
       btnWidth, btnHeight, 10);
  
  fill(255);
  textSize(min(20, width/25));
  text("VIEW LEADERBOARD", width/2, btnY);
  
  // Calculate footer position - moved up by 60px (30px more)
  const footerY = height * 0.8 - 60;
  
  // Draw sponsor and creator sections at the bottom (swapped order)
  drawMobileCreditsAndSponsors(footerY);
}

// Update the drawMobileCreditsAndSponsors function to swap the order of "Created by" and "Sponsored by" sections
function drawMobileCreditsAndSponsors(yPosition) {
  // Draw "Sponsored by" section first (moved up by 15px)
  textSize(min(16, width/30));
  fill(255);
  textAlign(CENTER, CENTER);
  text("Sponsored by:", width/2, yPosition - 15);
  
  // Calculate logo dimensions and positions - increased by 40%
  const logoHeight = min(25 * 1.4, height * 0.045);
  const spacing = min(20, width * 0.05);
  
  // Initialize sponsors object if it doesn't exist
  if (!mobileUI.sponsors) {
    mobileUI.sponsors = {};
  }
  
  // Calculate Fencepost logo dimensions
  let fencepostWidth = 0;
  if (fencepostLogo) {
    fencepostWidth = logoHeight * (fencepostLogo.width / fencepostLogo.height);
  }
  
  // Calculate Exploring Belize logo dimensions
  let exploringWidth = 0;
  if (exploringBelizeLogo) {
    exploringWidth = logoHeight * (exploringBelizeLogo.width / exploringBelizeLogo.height);
  }
  
  // Calculate total width and positions
  const totalWidth = fencepostWidth + exploringWidth;
  const totalWidthWithSpacing = totalWidth + spacing;
  
  // Position logos side by side
  const fencepostX = width/2 - totalWidthWithSpacing/2 + fencepostWidth/2;
  const exploringX = width/2 + totalWidthWithSpacing/2 - exploringWidth/2;
  
  // Draw Fencepost logo
  if (fencepostLogo) {
    image(fencepostLogo, 
          fencepostX - fencepostWidth/2, 
          yPosition + 5, // Adjusted for the moved up text
          fencepostWidth, logoHeight);
    
    // Store position for click detection
    mobileUI.sponsors.fencepost = {
      x: fencepostX,
      y: yPosition + 5 + logoHeight/2,
      width: fencepostWidth,
      height: logoHeight,
      url: "https://fencepostgear.com/"
    };
  }
  
  // Draw Exploring Belize logo
  if (exploringBelizeLogo) {
    image(exploringBelizeLogo, 
          exploringX - exploringWidth/2, 
          yPosition + 5, // Adjusted for the moved up text
          exploringWidth, logoHeight);
    
    // Store position for click detection
    mobileUI.sponsors.exploringBelize = {
      x: exploringX,
      y: yPosition + 5 + logoHeight/2,
      width: exploringWidth,
      height: logoHeight,
      url: "https://www.facebook.com/profile.php?id=61573064769739"
    };
  }
  
  // Draw "Created by" section second (moved down)
  const createdByY = yPosition + 60; // Position below the sponsor section
  textSize(min(16, width/30));
  fill(255);
  text("Created by:", width/2, createdByY);
  
  // Draw creator logo if available
  if (risiLogo) {
    // Fix aspect ratio - use the original image's aspect ratio
    // Increased size by 40%
    const logoWidth = min(50 * 1.4, width * 0.16);
    const aspectRatio = risiLogo.width / risiLogo.height;
    const logoHeight = logoWidth / aspectRatio;
    const logoY = createdByY + 25;
    
    // Center the logo horizontally
    image(risiLogo, width/2 - logoWidth/2, logoY, logoWidth, logoHeight);
    
    // Store position for click detection
    mobileUI.creator = {
      x: width/2,
      y: logoY + logoHeight/2,
      width: logoWidth,
      height: logoHeight,
      url: "https://www.facebook.com/risi.petillo"
    };
  } else {
    // Fallback text
    text("Risi Avila", width/2, createdByY + 30);
  }
}

// Update the handleMobileTouch function to work with the new layout
function handleMobileTouch(x, y) {
  console.log("Mobile touch at:", x, y);
  
  // If showing mobile leaderboard, check for back button
  if (showingMobileLeaderboard) {
    if (mobileUI.backBtn && 
        abs(x - mobileUI.backBtn.x) < mobileUI.backBtn.width/2 && 
        abs(y - mobileUI.backBtn.y) < mobileUI.backBtn.height/2) {
      console.log("Mobile back button clicked");
      showingMobileLeaderboard = false;
      return true;
    }
    return false;
  }
  
  // Check if leaderboard button was clicked
  if (mobileUI.leaderboardBtn &&
      abs(x - mobileUI.leaderboardBtn.x) < mobileUI.leaderboardBtn.width/2 && 
      abs(y - mobileUI.leaderboardBtn.y) < mobileUI.leaderboardBtn.height/2) {
    console.log("Mobile leaderboard button clicked");
    showingMobileLeaderboard = true;
    fetchMobileLeaderboard();
    return true;
  }
  
  // Check if creator logo was clicked
  if (mobileUI.creator && 
      abs(x - mobileUI.creator.x) < mobileUI.creator.width/2 && 
      abs(y - mobileUI.creator.y) < mobileUI.creator.height/2) {
    console.log("Creator logo clicked");
    window.open(mobileUI.creator.url, '_blank');
    return true;
  }
  
  // Check if sponsor logos were clicked
  if (mobileUI.sponsors) {
    for (const sponsor in mobileUI.sponsors) {
      const s = mobileUI.sponsors[sponsor];
      if (abs(x - s.x) < s.width/2 && abs(y - s.y) < s.height/2) {
        console.log("Sponsor logo clicked:", sponsor);
        window.open(s.url, '_blank');
        return true;
      }
    }
  }
  
  return false;
}

// Create a dedicated mobile leaderboard function
function drawMobileLeaderboard() {
  // Clear the background
  background(0);
  
  // Log canvas dimensions for debugging
  console.log("Drawing mobile leaderboard on canvas:", width, "x", height);
  
  // Draw grid background
  push();
  stroke(20, 20, 40);
  strokeWeight(1);
  
  // Draw responsive grid lines based on screen size
  const gridSize = min(30, width / 20);
  
  // Draw vertical grid lines
  for (let x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  
  // Draw horizontal grid lines
  for (let y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }
  pop();
  
  // Calculate responsive spacing
  const topMargin = height * 0.05;
  
  // Draw game logo at the top with responsive sizing
  if (gameLogo) {
    const logoWidth = min(width * 0.7, 250);
    const logoHeight = logoWidth * (gameLogo.height / gameLogo.width);
    image(gameLogo, width/2 - logoWidth/2, topMargin, logoWidth, logoHeight);
  }
  
  // Calculate logo height for positioning
  const logoHeight = gameLogo ? min(width * 0.7, 250) * (gameLogo.height / gameLogo.width) : 0;
  const titleY = topMargin + logoHeight + height * 0.05;
  
  // Draw leaderboard title
  textAlign(CENTER, CENTER);
  textSize(min(32, width/15));
  fill(255, 215, 0); // Gold color
  textStyle(BOLD);
  text("LEADERBOARD", width/2, titleY);
  
  // Draw leaderboard entries
  const startY = titleY + height * 0.08;
  const entryHeight = min(40, height * 0.06);
  const maxEntries = min(8, Math.floor((height - startY - 100) / entryHeight)); // Ensure entries fit on screen
  
  textAlign(LEFT, CENTER);
  textSize(min(16, width/30));
  textStyle(NORMAL);
  
  // Draw header
  fill(200);
  const rankWidth = width * 0.15;
  const nameWidth = width * 0.5;
  
  text("RANK", width * 0.05, startY);
  text("NAME", width * 0.05 + rankWidth, startY);
  textAlign(RIGHT, CENTER);
  text("SCORE", width * 0.95, startY);
  textAlign(LEFT, CENTER);
  
  // Check if leaderboard data exists
  if (!leaderboardData || leaderboardData.length === 0) {
    textAlign(CENTER, CENTER);
    fill(255);
    text("No leaderboard data available", width/2, startY + entryHeight * 2);
    textAlign(LEFT, CENTER);
  } else {
    // Draw entries
    for (let i = 0; i < min(leaderboardData.length, maxEntries); i++) {
      const entry = leaderboardData[i];
      const y = startY + (i + 1) * entryHeight;
      
      // Alternate row colors
      if (i % 2 === 0) {
        fill(30, 30, 50, 150);
        rect(width * 0.03, y - entryHeight/2, width * 0.94, entryHeight);
      }
      
      // Highlight player's score if found and playerName is defined
      if (typeof playerName !== 'undefined' && entry.name === playerName) {
        fill(255, 215, 0, 100); // Gold highlight
        rect(width * 0.03, y - entryHeight/2, width * 0.94, entryHeight);
      }
      
      // Draw rank
      fill(255);
      text("#" + (i + 1), width * 0.05, y);
      
      // Draw name (truncate if too long)
      const displayName = entry.name.length > 12 ? entry.name.substring(0, 10) + "..." : entry.name;
      text(displayName, width * 0.05 + rankWidth, y);
      
      // Draw score
      textAlign(RIGHT, CENTER);
      text(entry.score, width * 0.95, y);
      textAlign(LEFT, CENTER);
    }
  }
  
  // Draw back button in the lower left corner
  const backBtnY = height - 60;
  const backBtnWidth = min(120, width * 0.3); // Smaller width for corner placement
  const backBtnHeight = min(50, height * 0.07);
  const backBtnX = width * 0.1 + backBtnWidth/2; // Position in lower left corner
  
  mobileUI.backBtn = {
    x: backBtnX,
    y: backBtnY,
    width: backBtnWidth,
    height: backBtnHeight
  };
  
  // Draw button with hover effect
  if (mouseX > backBtnX - backBtnWidth/2 && 
      mouseX < backBtnX + backBtnWidth/2 &&
      mouseY > backBtnY - backBtnHeight/2 &&
      mouseY < backBtnY + backBtnHeight/2) {
    fill(80, 80, 220); // Lighter blue on hover
  } else {
    fill(50, 50, 200);
  }
  
  textAlign(CENTER, CENTER);
  rect(backBtnX - backBtnWidth/2, 
       backBtnY - backBtnHeight/2, 
       backBtnWidth, backBtnHeight, 10);
  
  fill(255);
  textSize(min(20, width/25));
  text("BACK", backBtnX, backBtnY);
}

// Function to fetch leaderboard data for mobile
function fetchMobileLeaderboard() {
  console.log("Fetching mobile leaderboard data");
  
  // Use the same leaderboard data as the desktop version
  if (leaderboardData && leaderboardData.length > 0) {
    console.log("Using existing leaderboard data:", leaderboardData);
    return;
  }
  
  // If no data exists yet, fetch it
  fetchLeaderboard();
}

// Add the drawCreditsAndSponsors function
function drawCreditsAndSponsors() {
  // Save the current drawing state
  push();
  
  // Define clickable areas for credits - will be updated with proper aspect ratio
  // Move everything up by an additional 10 pixels (total 60px from original position)
  window.creditAreas = {
    creator: {x: 80, y: height - 155, width: 80, height: 80, url: LOGO_URLS.risi}, // Moved up from height - 145
    fencepost: {x: width - 180, y: height - 125, width: 80, height: 40, url: LOGO_URLS.fencepost}, // Moved down by 10px (was height - 135)
    exploringBelize: {x: width - 80, y: height - 125, width: 70, height: 40, url: LOGO_URLS.exploringBelize} // Moved down by 10px (was height - 135)
  };
  
  // Draw Risi logo in lower left - with proper aspect ratio
  if (risiLogo) {
    // Calculate height based on original aspect ratio
    let risiWidth = 80; // Increased from 60 to 80
    let risiHeight = risiWidth * (risiLogo.height / risiLogo.width);
    
    // Update the clickable area height to match the actual image height
    window.creditAreas.creator.height = risiHeight;
    
    // Check if mouse is over creator area for hover effect
    if (mouseX > window.creditAreas.creator.x && 
        mouseX < window.creditAreas.creator.x + window.creditAreas.creator.width &&
        mouseY > window.creditAreas.creator.y && 
        mouseY < window.creditAreas.creator.y + window.creditAreas.creator.height) {
      // Add subtle highlight for hover
      tint(255, 255, 255, 255);
      // Show hand cursor
      cursor(HAND);
    } else {
      tint(255, 255, 255, 200);
    }
    
    // Draw creator logo with proper aspect ratio
    image(risiLogo, window.creditAreas.creator.x, window.creditAreas.creator.y, risiWidth, risiHeight);
    
    // Log the actual dimensions and aspect ratio for verification
    console.log("Risi logo dimensions:", risiLogo.width, "x", risiLogo.height, 
                "Aspect ratio:", risiLogo.width/risiLogo.height,
                "Displayed as:", risiWidth, "x", risiHeight);
  } else {
    // Fallback if image not loaded - use a reasonable aspect ratio estimate
    fill(100, 100, 255);
    rect(window.creditAreas.creator.x, window.creditAreas.creator.y, 80, 80); // Default to square if image not available
    fill(255);
    textAlign(CENTER, CENTER);
    text("CREATOR", window.creditAreas.creator.x + 40, window.creditAreas.creator.y + 40);
  }
  
  // Add "Created by" text with shadow for better visibility - adjusted position
  textSize(12);
  textAlign(CENTER);
  // Draw text shadow
  fill(0, 0, 0, 180);
  text("Created by:", window.creditAreas.creator.x + 40 + 1, window.creditAreas.creator.y - 5 + 1);
  // Draw main text
  fill(255);
  text("Created by:", window.creditAreas.creator.x + 40, window.creditAreas.creator.y - 5);
  
  // Draw Fencepost logo in lower right
  if (fencepostLogo) {
    // Check if mouse is over fencepost area for hover effect
    if (mouseX > window.creditAreas.fencepost.x && 
        mouseX < window.creditAreas.fencepost.x + window.creditAreas.fencepost.width &&
        mouseY > window.creditAreas.fencepost.y && 
        mouseY < window.creditAreas.fencepost.y + window.creditAreas.fencepost.height) {
      // Add subtle highlight for hover
      tint(255, 255, 255, 255);
      // Show hand cursor
      cursor(HAND);
    } else {
      tint(255, 255, 255, 200);
    }
    
    // Draw with proper aspect ratio
    let fenceWidth = 80;
    let fenceHeight = fenceWidth * (fencepostLogo.height / fencepostLogo.width);
    image(fencepostLogo, window.creditAreas.fencepost.x, window.creditAreas.fencepost.y, fenceWidth, fenceHeight);
  } else {
    // Fallback if image not loaded
    fill(255, 100, 100);
    rect(window.creditAreas.fencepost.x, window.creditAreas.fencepost.y, 80, 40);
    fill(255);
    textAlign(CENTER, CENTER);
    text("FENCEPOST", window.creditAreas.fencepost.x + 40, window.creditAreas.fencepost.y + 20);
  }
  
  // Draw Exploring Belize logo in lower right
  if (exploringBelizeLogo) {
    // Check if mouse is over exploring belize area for hover effect
    if (mouseX > window.creditAreas.exploringBelize.x && 
        mouseX < window.creditAreas.exploringBelize.x + window.creditAreas.exploringBelize.width &&
        mouseY > window.creditAreas.exploringBelize.y && 
        mouseY < window.creditAreas.exploringBelize.y + window.creditAreas.exploringBelize.height) {
      // Add subtle highlight for hover
      tint(255, 255, 255, 255);
      // Show hand cursor
      cursor(HAND);
    } else {
      tint(255, 255, 255, 200);
    }
    
    // Draw with proper aspect ratio
    let exploringWidth = 70;
    let exploringHeight = exploringWidth * (exploringBelizeLogo.height / exploringBelizeLogo.width);
    image(exploringBelizeLogo, window.creditAreas.exploringBelize.x, window.creditAreas.exploringBelize.y, exploringWidth, exploringHeight);
  } else {
    // Fallback if image not loaded
    fill(100, 255, 100);
    rect(window.creditAreas.exploringBelize.x, window.creditAreas.exploringBelize.y, 70, 40);
    fill(255);
    textAlign(CENTER, CENTER);
    text("EXPLORING BELIZE", window.creditAreas.exploringBelize.x + 35, window.creditAreas.exploringBelize.y + 20);
  }
  
  // Add "Sponsored by" text with shadow for better visibility
  textSize(12);
  textAlign(CENTER);
  // Draw text shadow
  fill(0, 0, 0, 180);
  text("Sponsored by:", width - 130 + 1, window.creditAreas.fencepost.y - 5 + 1);
  // Draw main text
  fill(255);
  text("Sponsored by:", width - 130, window.creditAreas.fencepost.y - 5);
  
  // Reset cursor and tint
  noTint();
  cursor(ARROW);
  
  // Restore drawing state
  pop(); 
}