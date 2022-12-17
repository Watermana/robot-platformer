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

// Cross-browser support for requestAnimationFrame
const w = window;
const requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Load background image
const bgImage = new Image();
bgImage.src = 'assets/background-left.png';

// Load hero image
const heroImage = new Image();
heroImage.src = 'assets/hero.png';

// Load platform image
const platformImage = new Image();
platformImage.src = 'assets/platform.png';

// Load gold coin image
const coinImage = new Image();
coinImage.src = 'assets/coinImage.png';

// Create initial set of gold coins
const initialCoins = [
  { x: 100, y: 100 },
  { x: 250, y: 200 },
  { x: 400, x: 100 }
];
let coins = initialCoins.map(function(coin) {
  return {
    x: coin.x,
    y: coin.y,
    originalX: coin.x
  };
});

// Create hero object
const hero = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  speed: 5,
  direction: '',
  isOnGround: true,
  isJumping: false,
  gravity: 0.5,
  jumpForce: 10
};

// Create platforms
const platforms = [
  { x: 0, y: canvas.height - platformImage.height, width: canvas.width, height: platformImage.height },
  { x: canvas.width / 2, y: canvas.height * 0.8, width: canvas.width / 2, height: platformImage.height },
  { x: canvas.width * 0.25, y: canvas.height * 0.5, width: canvas.width / 2, height: platformImage.height }
];

// Update game objects
const update = function() {
    // Move hero left or right
    if (hero.direction === 'left') {
      hero.x -= hero.speed;
    }
    if (hero.direction === 'right') {
      hero.x += hero.speed;
    }
  
    // Apply gravity to hero
    hero.y += hero.gravity;
  
    // Make hero jump
    if (hero.isJumping) {
      hero.y -= hero.jumpForce;
      hero.jumpForce -= hero.gravity;
  
      // Check if hero has landed on a platform
      platforms.forEach(function(platform) {
        if (hero.x + hero.width > platform.x &&
            hero.x < platform.x + platform.width &&
            hero.y + hero.height > platform.y &&
            hero.y < platform.y + platform.height) {
          // Hero has landed on a platform
          hero.isJumping = false;
          hero.jumpForce = 10;
          hero.y = platform.y;
          hero.isOnGround = true;
        }
      });
  
      // Check if hero has fallen off the bottom of the screen
      if (hero.y + hero.height > canvas.height) {
        // Hero has fallen off the bottom of the screen
        showGameOver();
      }
    }
  
    // Check if hero has collected a gold coin
    coins.forEach(function(coin, index) {
      if (hero.x + hero.width > coin.x &&
          hero.x < coin.x + coinImage.width &&
          hero.y + hero.height > coin.y &&
          hero.y < coin.y + coinImage.height) {
        // Hero has collected a gold coin
        coins.splice(index, 1);
      }
    });
  
    // Check if hero is on ground
    if (hero.y + hero.height >= canvas.height - platformImage.height) {
      hero.isOnGround = true;
    } else {
      hero.isOnGround = false;
    }
  };
  
 // Draw game objects
const render = function() {
    // Draw background
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  
    // Draw platforms
    platforms.forEach(function(platform) {
      ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
    });
  
    // Draw gold coins
    coins.forEach(function(coin) {
      ctx.drawImage(coinImage, coin.x, coin.y, coinImage.width, coinImage.height);
    });
  
    // Draw hero
    ctx.drawImage(heroImage, hero.x, hero.y, hero.width, hero.height);
  
    // Draw coin count
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Coins: ' + coins.length, 16, 16);
  };
  
  // Show game over screen
const showGameOver = function() {
    // Draw background
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  
    // Draw game over text
    ctx.font = '48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game over', canvas.width / 2, canvas.height / 2);
  
    // Draw reset button
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Reset', canvas.width / 2, canvas.height / 2 + 32);
  
    // Listen for clicks on the canvas
    canvas.addEventListener('click', function(e) {
      // Calculate the x and y position of the click relative to the canvas
      const x = e.pageX - canvas.offsetLeft;
      const y = e.pageY - canvas.offsetTop;
  
      // Check if the user clicked on the reset button
      if (x >= (canvas.width / 2) - (ctx.measureText('Reset').width / 2) &&
          x <= (canvas.width / 2) + (ctx.measureText('Reset').width / 2) &&
          y >= (canvas.height / 2) + 16 &&
          y <= (canvas.height / 2) + 48) {
        // Reset game
        canvas.removeEventListener('click', arguments.callee);
        coins = initialCoins.map(function(coin) {
          return {
            x: coin.x,
            y: coin.y,
            originalX: coin.x
          };
        });
        hero.x = 100;
        hero.y = canvas.height - platformImage.height - hero.height;
        hero.isJumping = false;
        hero.jumpForce = 10;
        hero.isOnGround = true;
        main();
      }
    });
  };
  
  // Game loop
  const main = function() {
    update();
    render();
    requestAnimationFrame(main);
  };
  
  
 // Initialize game
const init = function() {
    // Load images
    bgImage.src = 'assets/background.png';
    platformImage.src = 'assets/platform.png';
    heroImage.src = 'assets/hero.png';
    coinImage.src = 'assets/coinImage.png';
  
    // Create platforms
    platforms.push({
      x: 0,
      y: canvas.height - platformImage.height,
      width: canvas.width,
      height: platformImage.height
    });
    platforms.push({
      x: canvas.width / 2,
      y: canvas.height - platformImage.height * 2,
      width: canvas.width / 2,
      height: platformImage.height
    });
  
    // Create gold coins
    initialCoins.push({
      x: canvas.width / 4,
      y: canvas.height - platformImage.height * 2 - coinImage.height
    });
    initialCoins.push({
      x: canvas.width / 4 + coinImage.width * 2,
      y: canvas.height - platformImage.height * 2 - coinImage.height
    });
    initialCoins.push({
      x: canvas.width / 2 + canvas.width / 4,
      y: canvas.height - platformImage.height - coinImage.height
    });
    initialCoins.push({
      x: canvas.width / 2 + canvas.width / 4 + coinImage.width * 2,
      y: canvas.height - platformImage.height - coinImage.height
    });
  
    // Initialize hero
    hero.x = 100;
    hero.y = canvas.height - platformImage.height - hero.height;
  
    // Start game loop
    main();
  };
  
  // Main menu
  const mainMenu = function() {

  // Wait for background image to load
  bgImage.addEventListener('load', function() {
    // Draw background image
    ctx.drawImage(bgImage, 0, 0);

    // Draw title text
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Are Nine K', canvas.width / 2, canvas.height / 2);
  
    // Draw start game button
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Start game', canvas.width / 2, canvas.height / 2 + 32);
  });
    // Listen for clicks on the canvas
    canvas.addEventListener('click', function(e) {
      // Calculate the x and y position of the click relative to the canvas
      const x = e.pageX - canvas.offsetLeft;
      const y = e.pageY - canvas.offsetTop;

        // Check if the user clicked on the start game button
  if (x >= (canvas.width / 2) - (ctx.measureText('Start game').width / 2) &&
  x <= (canvas.width / 2) + (ctx.measureText('Start game').width / 2) &&
  y >= (canvas.height / 2) + 16 &&
  y <= (canvas.height / 2) + 48) {
// Start game
canvas.removeEventListener('click', arguments.callee);
init();
}
});
  };
// Initialize game
mainMenu();

  
//     // Listen for keyboard events
// document.addEventListener('keydown', function(e) {
//     // Space bar
//     if (e.keyCode === 32) {
//       // Make hero jump if on ground
//       if (hero.isOnGround) {
//         hero.isJumping = true;
//         hero.isOnGround = false;
//       }
//     }
  
//     // Left arrow
//     if (e.keyCode === 37) {
//       hero.direction = 'left';
//     }
  
//     // Right arrow
//     if (e.keyCode === 39) {
//       hero.direction = 'right';
//     }
//   });
  
//   document.addEventListener('keyup', function(e) {
//     // Left arrow
//     if (e.keyCode === 37) {
//       hero.direction = 'left';
//     }
  
//     // Right arrow
//     if (e.keyCode === 39) {
//       hero.direction = 'right';
//     }
//   });