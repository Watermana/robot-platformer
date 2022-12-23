import { levelStr } from './levels.js';
let levels = JSON.parse(levelStr);
console.log(levels)
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

// Global Variables
let requestId;
let gameState = 'menu';
const keysDown = {};
let inv = {
  coinAmount: 0,
  cosmetics: [],
  equipped: [0, 0, 0]
};
const scrollSpeed = 50;
let stageX = 0;
let playerImage = 'assets/hero-images/hero-0-0-0';
// Load game assets

    // Load background image
    const bgImage = new Image();
    bgImage.src = 'assets/background-left.png';

    // Load hero image
    const heroImage = new Image();
    heroImage.src = playerImage + '.png';

    // Load platform image
    const platformImage = new Image();
    platformImage.src = 'assets/platform.png';

    // Load gold coin image
    const coinImage = new Image();
    coinImage.src = 'assets/coinImage.png';

    //Load flag image
    const flagImage = new Image();
    flagImage.src = 'assets/flagImage.png';

    //Load coinDisplay image
    const coinDisplay = new Image();
    coinDisplay.src = 'assets/coinDisplay.png';

    //Load ladder image
    const ladderImage = new Image();
    ladderImage.src = 'assets/ladder.png';

//Event listeners
const eventListeners = () => {
    const _startBtn = document.getElementById("start-button");
    _startBtn.addEventListener('click', function() {
      mainMenuScreen.style.display = 'none';
      gameScreen.style.display = 'block';
        gameState = 'playing';
    });

    const _selectBtn = document.getElementById('lvl-select-btn');
    _selectBtn.addEventListener('click', function() {
        gameState = 'lvl-select';
    });

    const _return2Main = document.getElementById('return-2-main');
    _return2Main.addEventListener('click', function() {
      mainMenuScreen.style.display = 'block';
      lvlSelectScreen.style.display = 'none';
      pauseScreen.style.display = 'none';
      gameScreen.style.display = 'none';
      shopScreen.style.display = 'none';  
      gameState = 'menu';
    })

    const _gameReturn2Menu = document.getElementById('game-return-to-menu');
    _gameReturn2Menu.addEventListener('click', function() {
        resetGame();
        mainMenuScreen.style.display = 'block';
        lvlSelectScreen.style.display = 'none';
        pauseScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        shopScreen.style.display = 'none';
        gameState = 'menu';
    })

    const _gameLvlReset = document.getElementById('game-reset-lvl');
    _gameLvlReset.addEventListener('click', function() {
        resetGame();
    })

    const _shopBtn = document.getElementById('shop-btn');
    _shopBtn.addEventListener('click', function() {
      shopScreen.style.display = 'block';
      mainMenuScreen.style.display = 'none';
      gameState = 'shop';
    })

    const _shopReturn = document.getElementById('shop-return-to-menu');
    _shopReturn.addEventListener('click', function() {
      mainMenuScreen.style.display = 'block';
      lvlSelectScreen.style.display = 'none';
      pauseScreen.style.display = 'none';
      gameScreen.style.display = 'none';
      shopScreen.style.display = 'none';
      gameState = 'menu';
    })

    const _purchaseBtns = document.getElementById('button-grid');
    _purchaseBtns.addEventListener('click', function(e) {
        console.log(e.target.parentNode.id)
        switch(e.target.parentNode.id) {
          case '100':
            inv.cosmetics.push('prop-hat');
            inv.coinAmount = inv.coinAmount - 5;
            break;
          case '200':
            inv.cosmetics.push('top-hat');
            inv.coinAmount = inv.coinAmount - 10;
            break;
          case '300':
            inv.cosmetics.push('santa-hat');
            inv.coinAmount = inv.coinAmount - 15;
            break;
          case '010':
            inv.cosmetics.push('red-armor');
            inv.coinAmount = inv.coinAmount - 5;
            break;
          case '020':
            inv.cosmetics.push('blue-armor');
            inv.coinAmount = inv.coinAmount - 10;
            break;
          case '030':
            inv.cosmetics.push('camo-armor');
            inv.coinAmount = inv.coinAmount - 15;
            break;
          case '001':
            inv.cosmetics.push('timb-shoes');
            inv.coinAmount = inv.coinAmount - 5;
            break;
          case '002':
            inv.cosmetics.push('human-legs');
            inv.coinAmount = inv.coinAmount - 10;
            break;
          case '003':
            inv.cosmetics.push('peg-legs');
            inv.coinAmount = inv.coinAmount - 15;
            break;
          default:
            break;
    }
    savePlayerData();
    })

    const _equipBtns = document.getElementById('equip-grid');
    _equipBtns.addEventListener('click', function(e) {
      let t = e.target.id;

          if(t == '000') {
            inv.equipped[0] = 0;
            inv.equipped[1] = 0;
            inv.equipped[2] = 0;
          }

          if(t == '100' && inv.cosmetics.includes('prop-hat')) inv.equipped[0] = 1;

          if(t == '200' && inv.cosmetics.includes('top-hat')) inv.equipped[0] = 2;

          if(t == '300' && inv.cosmetics.includes('santa-hat')) inv.equipped[0] = 3;

          if(t == '010' && inv.cosmetics.includes('red-armor')) inv.equipped[1] = 1;

          if(t == '020' && inv.cosmetics.includes('blue-armor')) inv.equipped[1] = 1;

          if(t == '030' && inv.cosmetics.includes('camo-armor')) inv.equipped[1] = 1;

          if(t == '001' && inv.cosmetics.includes('timb-shoes')) inv.equipped[2] = 1;

          if(t == '002' && inv.cosmetics.includes('human-legs')) inv.equipped[2] = 2;

          if(t == '003' && inv.cosmetics.includes('peg-legs')) inv.equipped[2] = 3;

          if(t == 'player-reset') {
            inv.cosmetics = [];
            inv.equipped[0] = 0;
            inv.equipped[1] = 0;
            inv.equipped[2] = 0;
          }

      console.log(inv);
      savePlayerData();
      loadPlayerImage();
    })

    document.addEventListener('keydown', function(e) {
        if(e.keyCode == 27 && gameState == 'playing') {
            gameState = 'paused';
        } else if (e.keyCode == 27 && gameState == 'paused'){
          pauseScreen.style.display = 'none';
          pauseScreen.classList.remove('z-index-2');
            gameState = 'playing';
        }
    })

    addEventListener('keydown', function(e) {
        keysDown[e.keyCode] = true;

        if(e.repeat) return;

        if(e.keyCode == 65) {
          heroImage.src = playerImage + 'left.png';
        }
        if(e.keyCode == 68) {
          heroImage.src = playerImage + '.png';
        }

      }, false);

    addEventListener('keyup', function(e) {
        delete keysDown[e.keyCode];

      }, false);
}

// Create All the screens needed for the game

// Create the main menu screen element
const mainMenuScreen = document.createElement('div');
mainMenuScreen.style.display = 'none';
mainMenuScreen.classList.add('screen', 'screen-start');
mainMenuScreen.innerHTML = `
    <header class='screen-pause'>
        <h1>Platformer Game</h1>
        <ul>
          <li><button type='button' id='start-button'>Start Game</button></li>
          <li><button type='button' id='lvl-select-btn'>Level Select</button></li>
          <li><button type='button' id='shop-btn'>Shop</button></li>
        </ul>
        
    </header>
`;
mainMenuScreen.style.color = "black";    
// Add the main menu screen element to the game canvas
document.body.appendChild(mainMenuScreen);

// Create Game Screen
const gameScreen = document.createElement('div');
gameScreen.classList.add('screen', 'screen-game');
gameScreen.style.display = 'none';
gameScreen.innerHTML = `<h1></h1>`;
document.body.appendChild(gameScreen)

// Level Select
const lvlSelectScreen = document.createElement('div');
lvlSelectScreen.classList.add('screen', 'screen-lvl-select');
lvlSelectScreen.innerHTML = `
<h1>Hello World!</h1>
<button type='button' id='return-2-main'>Return to Main Menu</button>
`;
lvlSelectScreen.style.display = 'none';
document.body.appendChild(lvlSelectScreen)


// Pause Screen
const pauseScreen = document.createElement('div');
pauseScreen.style.display = 'none';
pauseScreen.classList.add('screen', 'screen-pause');
pauseScreen.innerHTML = `
    <h1>Game is Paused. Press ESC to resume</h1>
    <button type='button' id='game-return-to-menu'>Return to main menu</button>
    <button type='button' id='game-reset-lvl'>Reset Level</button>
`;
document.body.appendChild(pauseScreen);

// You Win! Screen
const winScreen = document.createElement('div');
winScreen.style.display = 'none';
pauseScreen.classList.add('screen', 'screen-pause')
winScreen.innerHTML = `
  <h1> You Win! </h1>

`;
document.body.appendChild(winScreen);

const shopScreen = document.createElement('div');
shopScreen.style.display = 'none';
shopScreen.classList.add('screen', 'screen-shop');
shopScreen.innerHTML = `
  <header class='screen-pause'>
  <h1>Welcome to the shop!</h1>
  <h3>Here you can spend coins to customize your player charater.</h3>
  <button type='button' id='shop-return-to-menu'>Return to Main Menu</button>
  </header>
  <div class='flex'>
  <div class='shop-purchase' id="button-grid">
  <button class="" id="100"><p>Propeller Hat - 5</p><img src="assets/prophat.png"/></button>
  <button class="" id='200'><p>Top Hat - 10</p><img src="assets/tophat.png"/></button>
  <button class="" id='300'><p>Santa Hat - 15</p><img src="assets/santahat.png"/></button>
  <button class="" id='010'><p>Red Armor - 5</p><img src="assets/hero-images/hero-0-1-0.png"</button>
  <button class="" id='020'>Blue Armor - 10</button>
  <button class="" id='030'>Camo Armor - 15</button>
  <button class="" id='001'>Timberland Shoes - 5</button>
  <button class="" id='002'>Human Legs - 10</button>
  <button class="" id='003'>Peg legs - 15</button>
</div>
<div class='shop-equip' id="equip-grid">
<button class="button" id='100'>Propeller Hat</button>
<button class="button" id='200'>Top Hat</button>
<button class="button" id='300'>Santa Hat</button>
<button class="button" id='010'>Red Armor</button>
<button class="button" id='020'>Blue Armor</button>
<button class="button" id='030'>Camo Armor</button>
<button class="button" id='001'>Timberland Shoe</button>
<button class="button" id='002'>Human Legs</button>
<button class="button" id='003'>Peg legs</button>
<button class="button" id='000'>Default</button>
<button class="button" id='player-reset'>Reset Inventory</button
</div>
</div>
`;
document.body.appendChild(shopScreen);


// initialize all event listeners
eventListeners();

// ********************************************* //

// Create Game Objects
    const hero = {
        speed: 384,
        x: 0,
        y: 0,
        isOnGround: false,
        isOnLadder: false,
        yVelocity: 0,
        jumpForce: -600,
        coinCount: 0,
        direction: 'right'
    };

const {initialCoins, platforms, flag, ladders } = levels;

// Create gold coin objects

let coins = initialCoins.map(function(coin) {
    return {
        x: coin.x,
        y: coin.y,
        originalX: coin.x
    };
});


// Update game objects every frame
const updateGame = function(modifier) {
  // console.log(hero.yVelocity)
    if (32 in keysDown) { // Player holding space bar
        if (hero.isOnGround) {
          hero.yVelocity = hero.jumpForce;
          hero.isOnGround = false;
        }
      }
      if (83 in keysDown) { // Player holding s
        hero.y += hero.speed * modifier;
      }
      if (65 in keysDown) { // Player holding a
          hero.x -= hero.speed * modifier;

          // Scroll left if hero hits left edge of canvas
          if (hero.x < 0) {
            hero.x = 0;
            platforms.forEach(function(platform) {
              platform.x += hero.speed * modifier;
            });
            // Modify coin positions if player moves left
            coins.forEach(function(coin) {
              coin.x += hero.speed * modifier;
            });
            // Modify flag position
            flag.x += hero.speed * modifier;
            //Modify ladders
            ladders.forEach(function(ladder) {
              ladder.x += hero.speed * modifier;
            })
          }
        }
        if (68 in keysDown) { // Player holding d
          hero.x += hero.speed * modifier;

          // Scroll right if hero hits right edge of canvas
          if (hero.x > canvas.width - heroImage.width) {
            hero.x = canvas.width - heroImage.width;
            platforms.forEach(function(platform) {
              platform.x -= hero.speed * modifier;
            });
            // Modify coin positions if player moves right
            coins.forEach(function(coin) {
              coin.x -= hero.speed * modifier;
            });
            //Modify flag position
            flag.x -= hero.speed * modifier;
            //Modify ladders
            ladders.forEach(function(ladder) {
              ladder.x -= hero.speed * modifier;
            });
          }
        }
    
      // Update hero's vertical position
      hero.y += hero.yVelocity * modifier;
      hero.yVelocity += 1000 * modifier; // Gravity
    
      //Check if hero falls into the void
      if(hero.y > canvas.height) {
        gameState = 'over';
      }

      // Check if hero is on ground
      platforms.forEach(function(platform) {
        if (
          hero.y + heroImage.height > platform.y &&
          hero.y < platform.y &&
          hero.x + heroImage.width > platform.x &&
          hero.x < platform.x + platformImage.width && hero.yVelocity >= 0
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

      // Check if hero is touching a ladder
      ladders.forEach(function(ladder, index) {
        if(
          hero.y + ladderImage.height > ladder.y &&
          hero.y < ladder.y + ladderImage.height &&
          hero.x + heroImage.width > ladder.x &&
          hero.x < ladder.x + ladderImage.width
        ) {
          if(87 in keysDown) {
            hero.isOnLadder = true;
            hero.yVelocity = hero.jumpForce / 2;
          }
        }
      })


      // Check if hero is touching the flag
      if(
        hero.y + heroImage.height > flag.y &&
        hero.y < flag.y + flagImage.height &&
        hero.x + heroImage.width > flag.x &&
        hero.x < flag.x + flagImage.width
      ) {
        inv.coinAmount = inv.coinAmount + hero.coinCount;
        savePlayerData();
        gameState = 'win';

      }
}

//main render
//draw game objects after receiving updated position data
const renderGame = function() {
    //Draw background
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Draw platforms
    platforms.forEach(function(platform) {
        ctx.drawImage(platformImage, platform.x, platform.y);
      });

    // Draw ladders
    ladders.forEach(function(ladder) {
      ctx.drawImage(ladderImage, ladder.x, ladder.y);
    })

    // Draw flag
      ctx.drawImage(flagImage, flag.x, flag.y);
    
    // Draw gold coins if they exist
      if (coins.length > 0) {
          coins.forEach(function(coin) {
          ctx.drawImage(coinImage, coin.x, coin.y);
          });
      }

    // Draw coin count
    ctx.drawImage(coinDisplay, 32, 32)
    ctx.font = '24px fantasy';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Coins: ' + hero.coinCount, 41, 50);

      // Draw hero
      ctx.drawImage(heroImage, hero.x, hero.y);  
      

}

//Reset game environment
const resetGame = function() {
    gameState = 'playing';

          // Reset hero position
        hero.x = 0;
        hero.y = 0;
        hero.coinCount = 0;
    
        // Reset platform positions
        platforms.forEach(function(platform) {
          platform.x = platform.originalX;
        });
    
        // Resert Ladder postions
        ladders.forEach(function(ladder) {
          ladder.x = ladder.originalX;
        })

        // Reset gold coin positions
        coins = initialCoins.map(function(coin) {
            return {
              x: coin.x,
              y: coin.y,
              originalX: coin.x
            };
          });

        // Reset flag position
        flag.x = flag.originalX;
}

  // Show game over screen
  const showGameOver = function() {
  
    // Draw game over text
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game over', canvas.width / 2, canvas.height / 2);

  };

// Main Menu Rendering 
const renderMainMenu = function() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(coinDisplay, 24, 32, 150, 55);
    ctx.font = '24px fantasy';
    ctx.fillStyle = 'white';
    ctx.fillText('Coins: ' + inv.coinAmount, 42, 70);
        
}

const renderShop = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(heroImage, 1040, 225, 250, 250);
  ctx.drawImage(coinDisplay, 24, 32, 150, 55);
  ctx.font = '24px fantasy';
  ctx.fillStyle = 'white';
  ctx.fillText('Coins: ' + inv.coinAmount, 42, 70);
}

// Level Select Screen Rendering
const renderLvlSelect = function() {
    mainMenuScreen.style.display = 'none';
    lvlSelectScreen.style.display = 'block';
}

// Load player's data
const loadPlayerData = function() {
  let invJson = localStorage.getItem('playerInventory');
  inv = JSON.parse(invJson);
}

// Save player data
const savePlayerData = function() {
  let invJson = JSON.stringify(inv);
  localStorage.setItem('playerInventory', invJson);
}

// Load player image
const loadPlayerImage = function() {

  let top = inv.equipped[0];
  let torso = inv.equipped[1];
  let legs = inv.equipped[2];

  playerImage = `assets/hero-images/hero-${top}-${torso}-${legs}`;
  heroImage.src = playerImage + '.png';
  // console.log(playerImage)
}

const loadMainMenu = function() {
  mainMenuScreen.style.display = 'block';
  lvlSelectScreen.style.display = 'none';
  pauseScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  shopScreen.style.display = 'none';
}

// Game loop
const gameLoop = function() {

    if(gameState == 'shop') {

      renderShop();
    }

    if(gameState == 'win') {
      winScreen.style.display = 'block';
      resetGame();
      gameState = 'menu';
    }

    if(gameState == 'over') {
      showGameOver();
      resetGame();
    }

    if(gameState == 'menu') {
        renderMainMenu();
    }

    if(gameState == 'lvl-select') {
        renderLvlSelect();
    }
    
    if(gameState == 'playing') {
        const now = Date.now();
        const delta = now - then;
      
        updateGame(delta / 1000);
        renderGame();
      
        then = now;
    }

    if(gameState == 'paused') {
        pauseScreen.style.display = 'block';
    }

    // Request to do this again ASAP
    requestId = requestAnimationFrame(gameLoop);
}

// Main menu screen
const init = function() {
    loadPlayerData();
    loadPlayerImage();
    loadMainMenu();
    gameLoop();
}


//Initialize Game
let then = Date.now();
init();