let canvas = {};
canvas.height = 640;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

let _levels =
    {
        initialCoins: [
            { x: 500, y: canvas.height - 150, originalX: 500},
            { x: 550, y: canvas.height - 490, originalX: 550},
            { x: 750, y: canvas.height - 490, originalX: 750},
            { x: 1100, y: canvas.height - 600, originalX: 1100},
            { x: 1300, y: canvas.height - 600, originalX: 1300}
        ],
        platforms: [
            { x: 0, y: canvas.height - 50, originalX: 0},
            { x: 2100, y: canvas.height - 50, originalX: 1800},
            { x: 2400, y: canvas.height - 50, originalX: 2400},
            { x: 3400, y: canvas.height - 400, originalX: 2400},
            { x: 2800, y: canvas.height - 50, originalX: 2400},
            {x: 400, y: canvas.height - 400, originalX: 400},
            {x: 1500, y: canvas.height - 400, originalX: 1500}
        ],
        flag: {
            x:3600,
            y: canvas.height - 620,
            originalX: 2600
        },
        ladders: [
            {x: 300, y: canvas.height - 310, originalX: 200},
            {x: 4000, y: canvas.height -310, originalX: 3000}
        ]
    }

export let levelStr = JSON.stringify(_levels);