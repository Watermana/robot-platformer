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
            { x: 700, y: canvas.height - 260, originalX: 700},
            { x: 900, y: canvas.height - 260, originalX: 900},
            { x: 550, y: canvas.height - 490, originalX: 700},
            { x: 750, y: canvas.height - 490, originalX: 900},
            { x: 1100, y: canvas.height - 150, originalX: 1100},
            { x: 1300, y: canvas.height - 200, originalX: 1300},
            { x: 1500, y: canvas.height - 250, originalX: 1500},
            { x: 1700, y: canvas.height - 150, originalX: 1700},
            { x: 1900, y: canvas.height - 200, originalX: 1900}
        ],
        platforms: [
            { x: 0, y: canvas.height - 50, originalX: 0},
            { x: 1500, y: canvas.height - 50, originalX: 1200},
            { x: 1200, y: canvas.height - 50, originalX: 1200},
            { x: 2100, y: canvas.height - 50, originalX: 1800},
            { x: 1800, y: canvas.height - 50, originalX: 1800},
            { x: 2400, y: canvas.height - 50, originalX: 2400},
            { x: 2400, y: canvas.height - 400, originalX: 2400},
            { x: 2800, y: canvas.height - 50, originalX: 2400},
            {x: 400, y: canvas.height - 400, originalX: 300}
        ],
        flag: {
            x:2600,
            y: canvas.height - 620,
            originalX: 2600
        },
        ladders: [
            {x: 300, y: canvas.height - 310, originalX: 200},
            {x: 3000, y: canvas.height -310, originalX: 3000}
        ]
    }

export let levelStr = JSON.stringify(_levels);