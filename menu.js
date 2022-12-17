// Setup canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let requestId;
let gameStatus = 'menu';
let isGamePaused = false;
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

// Create platform objects
const platforms = [
    { x: 0, y: canvas.height - 50, originalX: 0},
    { x: 600, y: canvas.height - 50, originalX: 600},
    { x: 1200, y: canvas.height - 50, originalX: 1200},
    { x: 1800, y: canvas.height - 50, originalX: 1800},
    { x: 2400, y: canvas.height - 50, originalX: 2400}
  ];

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
    if(27 in keysDown) {

        if(gameStatus == 'paused') {
                    // Hide the pause menu screen
                    pauseMenu.style.display = 'none';
            
                    // Start the game loop
                    requestId = requestAnimationFrame(main);
            
                    // Set the game status to 'playing'
                    gameStatus = 'playing';
                    } 
                    else {
                        // Show the pause menu screen
                        pauseMenu.style.display = 'block';
            
                        console.log("hello")
                        
                        // Stop the game loop
                        // cancelAnimationFrame(requestId);
            
                        gameStatus = 'paused';
                    }
    }


    if (87 in keysDown || 32 in keysDown) { // Player holding up or space bar
      if (hero.isOnGround) {
        hero.yVelocity = hero.jumpForce;
        hero.isOnGround = false;
      }
    }
    if (83 in keysDown) { // Player holding down
      hero.y += hero.speed * modifier;
    }
    if (65 in keysDown) { // Player holding left
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
      if (68 in keysDown) { // Player holding right
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


// Create the pause menu screen
const pauseMenu = document.createElement('div');
pauseMenu.style.display = 'none';
pauseMenu.style.position = 'absolute';
pauseMenu.style.top = '0';
pauseMenu.style.left = '0';
pauseMenu.style.width = '100%';
pauseMenu.style.height = '100%';
pauseMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

// Add the pause menu screen to the HTML
document.body.appendChild(pauseMenu);

// Create the pause menu title
const pauseTitle = document.createElement('h1');
pauseTitle.innerHTML = 'Game Paused';
pauseTitle.style.color = 'white';
pauseTitle.style.textAlign = 'center';
pauseTitle.style.marginTop = '25%';

// Add the pause menu title to the pause menu screen
pauseMenu.appendChild(pauseTitle);

// Create the pause menu instructions
const pauseInstructions = document.createElement('p');
pauseInstructions.innerHTML = 'Press the escape key to resume the game';
pauseInstructions.style.color = 'white';
pauseInstructions.style.textAlign = 'center';
pauseInstructions.style.marginTop = '5%';

// Add the pause menu instructions to the pause menu screen
pauseMenu.appendChild(pauseInstructions);

// Create the reset button
const resetButton = document.createElement('button');
resetButton.innerHTML = 'Reset Level';
resetButton.style.display = 'block';
resetButton.style.margin = '0 auto';
resetButton.style.marginTop = '10%';
resetButton.style.padding = '10px 20px';
resetButton.style.fontSize = '20px';

// Add the reset button to the pause menu screen
pauseMenu.appendChild(resetButton);

// Create the main menu button
const mainMenuButton = document.createElement('button');
mainMenuButton.innerHTML = 'Main Menu';
mainMenuButton.style.display = 'block';
mainMenuButton.style.margin = '0 auto';
mainMenuButton.style.marginTop = '5%';
mainMenuButton.style.padding = '10px 20px';
mainMenuButton.style.fontSize = '20px';

// Add the main menu button to the pause menu screen
pauseMenu.appendChild(mainMenuButton);

// Draw everything
const render = function() {
  // Check if the game is paused


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
        button.style.top = (canvas.height / 2) + (48 / 2) + 32 + 'px';
        button.style.left = (canvas.width / 2) - 32 + 'px';
        showGameOver();
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
  
  // Show game over screen
const showGameOver = function() {
    // Draw background
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  
    // Draw game over text
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game over', canvas.width / 2, canvas.height / 2);

  };
  
// The main game loop
const main = function() {
    const now = Date.now();
    const delta = now - then;
  
    update(delta / 1000);
    render();
  
    then = now;
  
    // Request to do this again ASAP
    requestId = requestAnimationFrame(main);
  };
  

  // Initialize Game
  const init = function() {
    gameStatus = 'playing';
      // Listen for keydown events
//   document.addEventListener('keydown', function(event) {
//     // Check if the escape key was pressed
//     if (event.keyCode === 27 && pauseMenu.style.display == 'none') {
//         console.log(gameStatus)
//         if(gameStatus == 'paused') {
//         // Hide the pause menu screen
//         pauseMenu.style.display = 'none';

//         // Start the game loop
//         requestId = requestAnimationFrame(main);

//         // Set the game status to 'playing'
//         gameStatus = 'playing';
//         } 
//         else {
//             // Show the pause menu screen
//             pauseMenu.style.display = 'block';

//             console.log("hello")
            
//             // Stop the game loop
//             // cancelAnimationFrame(requestId);

//             gameStatus = 'paused';
//         }
//     }
//   });
    // start game loop
    requestId = requestAnimationFrame(main);
  }
  
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
    y <= (canvas.height / 2) + 48) 
    {
        // Start game
        canvas.removeEventListener('click', arguments.callee);
        init();
    }
});
  };

// Initialize game
let then = Date.now();
mainMenu();