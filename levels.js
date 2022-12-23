let canvas = {};
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

let _levels =
    {
        initialCoins: [
            { x: 500, y: canvas.height - 150, originalX: 500, originalY: canvas.height - 150},
            { x: 550, y: canvas.height - 490, originalX: 550, originalY: canvas.height - 490},
            { x: 750, y: canvas.height - 490, originalX: 750, originalY: canvas.height - 490},
            { x: 1100, y: canvas.height - 600, originalX: 1100, originalY: canvas.height - 600},
            { x: 1300, y: canvas.height - 600, originalX: 1300, originalY: canvas.height - 600}
        ],
        platforms: [
            { x: 0, y: canvas.height - 50, originalX: 0, originalY: canvas.height - 50},
            { x: 700, y: canvas.height - 750, originalX: 700, originalY: canvas.height - 750},
            { x: 2100, y: canvas.height - 50, originalX: 1800, originalY: canvas.height - 50},
            { x: 2400, y: canvas.height - 50, originalX: 2400, originalY: canvas.height - 50},
            { x: 3400, y: canvas.height - 400, originalX: 2400, originalY: canvas.height - 400},
            { x: 2800, y: canvas.height - 50, originalX: 2400, originalY: canvas.height - 50},
            {x: 400, y: canvas.height - 400, originalX: 400, originalY: canvas.height - 400},
            {x: 1500, y: canvas.height - 400, originalX: 1500, originalY: canvas.height - 400}
        ],
        flag: {
            x:3600,
            y: canvas.height - 620,
            originalX: 2600,
            originalY: canvas.height - 620
        },
        ladders: [
            {x: 300, y: canvas.height - 310, originalX: 300, originalY: canvas.height - 310},
            {x: 600, y: canvas.height - 650, originalX: 500, originalY: canvas.height - 650},
            {x: 4000, y: canvas.height - 310, originalX: 3000, originalY: canvas.height - 310}
        ]
    }

export let levelStr = JSON.stringify(_levels);