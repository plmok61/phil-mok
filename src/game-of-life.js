import { EventEmitter } from 'events';

function determineIfAlive(cell, numNeighbors) {
  const aliveWithCorrectNeighbors = cell === 1 && (numNeighbors === 2 || numNeighbors === 3);
  const deadWithCorrectNeighbors = cell === 0 && numNeighbors === 3;
  if (aliveWithCorrectNeighbors || deadWithCorrectNeighbors) {
    return 1;
  }
  return 0;
}

class GameOfLife extends EventEmitter {
  constructor() {
    super();
    this.canvas = null;
    this.grid = [];
    this.gridSize = 20;
    this.gameOver = false;
  }

  createGrid() {
    const grid = [];
    for (let row = 0; row < this.gridSize; row += 1) {
      const r = [];
      for (let col = 0; col < this.gridSize; col += 1) {
        r.push(Math.round(Math.random()));
      }
      grid.push(r);
    }
    this.grid = grid;
  }

  countNeighbors(row, col) {
    let count = 0;

    // left
    count += this.grid[row][col - 1] ? 1 : 0;

    // right
    count += this.grid[row][col + 1] ? 1 : 0;

    if (row > 0) {
      // above
      count += this.grid[row - 1][col];
      if (col > 0) {
        // above left
        count += this.grid[row - 1][col - 1];
      }
      if (col < this.gridSize - 1) {
        // above right
        count += this.grid[row - 1][col + 1];
      }
    }

    if (row < this.gridSize - 1) {
      // below
      count += this.grid[row + 1][col];
      if (col > 0) {
        // below left
        count += this.grid[row + 1][col - 1];
      }
      if (col < this.gridSize - 1) {
        // below right
        count += this.grid[row + 1][col + 1];
      }
    }

    return count;
  }

  buildNextGrid() {
    const newGrid = [];
    let totalAlive = 0;
    let noChange = true;

    this.grid.forEach((row, x) => {
      newGrid.push([]);
      row.forEach((col, y) => {
        const cell = this.grid[x][y];
        totalAlive += cell;
        const neightbors = this.countNeighbors(x, y);
        const lifeState = determineIfAlive(cell, neightbors);
        if (lifeState !== cell) {
          noChange = false;
        }
        newGrid[x][y] = lifeState;
      });
    });

    this.grid = newGrid;
    this.gameOver = totalAlive === 0 || noChange;
  }

  drawCanvas() {
    const { innerWidth, innerHeight } = window;
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    ctx.fillStyle = 'black';
    this.grid.forEach((row, x) => {
      row.forEach((col, y) => {
        if (col === 1) {
          ctx.fillRect(x * 25, y * 25, 25, 25);
        }
      });
    });
  }

  startGame(canvas) {
    this.canvas = canvas;
    this.createGrid();
    this.gameOver = false;

    const gameInt = setInterval(() => {
      if (!this.gameOver) {
        this.buildNextGrid();
        this.drawCanvas();
      } else {
        clearInterval(gameInt);
        this.emit('gameOver');
      }
    }, 10);
  }
}

export default GameOfLife;
