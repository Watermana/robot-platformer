// Setup canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


// Set canvas size to match window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

// Background image
const bgImage = new Image();
bgImage.src = 'assets/background.png';

// Hero image
const heroImage = new Image();
heroImage.src = 'assets/hero.png';

// Platform image
const platformImage = new Image();
platformImage.src = 'assets/platform.png';

// Gold coin image
const coinImage = new Image();
coinImage.src = 'assets/coinImage.png';
coinImage.height /= 2;
coinImage.width /= 2;

// Create hero object
const hero = {
    speed: 384, // movement in pixels per second
    x: 0,
    y: 0,
    isOnGround: false,
    yVelocity: 0,
    jumpForce: -650, //controls jump height
    coinCount: 0 // Initial number of coins collected
  };

// Create platform objects
const platforms = [
    { x: 0, y: canvas.height - 50, originalX: 0},
    { x: 600, y: canvas.height - 50, originalX: 600},
    { x: 1200, y: canvas.height - 50, originalX: 1200},
    { x: 1800, y: canvas.height - 50, originalX: 1800},
    { x: 2400, y: canvas.height - 50, originalX: 2400}
  ];

  // Create gold coin objects
const initialCoins = [
    { x: 100, y: canvas.height - 200, originalX: 100},
    { x: 300, y: canvas.height - 250, originalX: 300},
    { x: 500, y: canvas.height - 150, originalX: 500},
    { x: 700, y: canvas.height - 200, originalX: 700},
    { x: 900, y: canvas.height - 250, originalX: 900},
    { x: 1100, y: canvas.height - 150, originalX: 1100},
    { x: 1300, y: canvas.height - 200, originalX: 1300},
    { x: 1500, y: canvas.height - 250, originalX: 1500},
    { x: 1700, y: canvas.height - 150, originalX: 1700},
    { x: 1900, y: canvas.height - 200, originalX: 1900}
  ];

  let coins = initialCoins.map(function(coin) {
    return {
      x: coin.x,
      y: coin.y,
      originalX: coin.x
    };
  });


// Handle keyboard controls
const keysDown = {};
addEventListener('keydown', function(e) {
  keysDown[e.keyCode] = true;
}, false);
addEventListener('keyup', function(e) {
  delete keysDown[e.keyCode];
}, false);


// Update game objects
const update = function(modifier) {
    if (38 in keysDown || 32 in keysDown) { // Player holding up or space bar
      if (hero.isOnGround) {
        hero.yVelocity = hero.jumpForce;
        hero.isOnGround = false;
      }
    }
    if (40 in keysDown) { // Player holding down
      hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
      
        // Scroll left if hero hits left edge of canvas
        if (hero.x < 0) {
          hero.x = 0;
          bgImage.src = 'assets/background-left.png';
          platforms.forEach(function(platform) {
            platform.x += hero.speed * modifier;
          });
          // Modify coin positions if player moves left
          coins.forEach(function(coin) {
            coin.x += hero.speed * modifier;
          });
        }
      }
      if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
      
        // Scroll right if hero hits right edge of canvas
        if (hero.x > canvas.width - heroImage.width) {
          hero.x = canvas.width - heroImage.width;
          bgImage.src = 'assets/background-right.png';
          platforms.forEach(function(platform) {
            platform.x -= hero.speed * modifier;
          });
          // Modify coin positions if player moves right
          coins.forEach(function(coin) {
            coin.x -= hero.speed * modifier;
          });
        }
      }
  
    // Update hero's vertical position
    hero.y += hero.yVelocity * modifier;
    hero.yVelocity += 1000 * modifier; // Gravity
  
    // Check if hero is on ground
    hero.isOnGround = false;
    platforms.forEach(function(platform) {
      if (
        hero.y + heroImage.height > platform.y &&
        hero.y < platform.y &&
        hero.x + heroImage.width > platform.x &&
        hero.x < platform.x + platformImage.width
      ) {
        hero.isOnGround = true;
        hero.y = platform.y - heroImage.height;
        hero.yVelocity = 0;
      }
    });
  
    // Check if hero is touching a gold coin
    coins.forEach(function(coin, index) {
      if (
        hero.y + heroImage.height > coin.y &&
        hero.y < coin.y + coinImage.height &&
        hero.x + heroImage.width > coin.x &&
        hero.x < coin.x + coinImage.width
      ) {
        // Remove the coin from the coins array
        coins.splice(index, 1);
        // Increment coin count
        hero.coinCount++;
      }
    });
  };

      // Create reset button
      const button = document.createElement('button');
      button.innerHTML = 'Reset';
      button.style.position = 'absolute';
      button.style.left = '32px';
      button.style.top = '64px';
      document.body.appendChild(button);
    

// Draw everything
const render = function() {
    // Draw background
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  
    // Draw platforms
    platforms.forEach(function(platform) {
      ctx.drawImage(platformImage, platform.x, platform.y);
    });
  
  // Draw gold coins if they exist
    if (coins.length > 0) {
        coins.forEach(function(coin) {
        ctx.drawImage(coinImage, coin.x, coin.y);
        });
    }
    // Draw hero
    ctx.drawImage(heroImage, hero.x, hero.y);

      // Draw "you died" message if hero has fallen off the platforms
    if (hero.y > canvas.height) {
        ctx.font = '48px fantasy';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('You died!', canvas.width / 2, canvas.height / 2);
        button.style.top = (canvas.height / 2) + (48 / 2) + 32 + 'px';
        button.style.left = (canvas.width / 2) - 32 + 'px';
    }
  
    // Draw coin count
    ctx.font = '24px fantasy';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Coins: ' + hero.coinCount, 32, 32);

    // Listen for clicks on reset button and reset game when clicked
    button.addEventListener('click', function() {
        // Reset hero position
        hero.x = 0;
        hero.y = 0;
        hero.coinCount = 0;
    
        // Reset platform positions
        platforms.forEach(function(platform) {
          platform.x = platform.originalX;
        });
    
        // Reset gold coin positions
        coins = initialCoins.map(function(coin) {
            return {
              x: coin.x,
              y: coin.y,
              originalX: coin.x
            };
          });

          //reset the reset button position
          button.style.left = '32px';
          button.style.top = '64px';
      });

  };    

// The main game loop
const main = function() {
    const now = Date.now();
    const delta = now - then;
  
    update(delta / 1000);
    render();
  
    then = now;
  
    // Request to do this again ASAP
    requestAnimationFrame(main);
  };
  
  // Cross-browser support for requestAnimationFrame
  const w = window;
  const requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
  
  // Let's play this game!
  let then = Date.now();
  main();
  
  
  
  