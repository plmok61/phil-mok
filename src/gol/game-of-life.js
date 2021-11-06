/* eslint-disable no-unused-vars */
import { EventEmitter } from 'events';

const red = '#c81837';
const orange = '#f77524';
const yellow = '#fcd549';
const teal = '#39818e';
const darkPurple = '#0d1036';

const colors = [darkPurple, teal, yellow, orange, red];
const fade = [34, 21, 8, 3, 1];
const fadeTotal = fade.reduce((acc, num) => {
  const result = acc + num;
  return result;
}, 0);

const colorsFade = [];
colors.forEach((color, idx) => {
  for (let i = 0; i < fade[idx]; i += 1) {
    colorsFade.push(color);
  }
});

const aliveIndex = colorsFade.length - 1;

function determineIfAlive(cell, numNeighbors) {
  const aliveWithCorrectNeighbors = cell.isAlive === 1 && (numNeighbors === 2 || numNeighbors === 3);
  const deadWithCorrectNeighbors = cell.isAlive === 0 && numNeighbors === 3;
  if (aliveWithCorrectNeighbors || deadWithCorrectNeighbors) {
    return 1;
  }
  return 0;
}

class GameOfLife extends EventEmitter {
  constructor({ gridSize, initialGrid }) {
    super();
    this.canvas = null;
    this.grid = initialGrid;
    this.gridSize = gridSize;
    this.totalAlive = 0;
    this.turnsTotalSame = 0;
    this.gameOver = false;
    this.gameInterval = null;
    this.initialized = false;
  }

  createGrid() {
    const grid = [...this.grid];
    for (let row = 0; row < this.gridSize; row += 1) {
      for (let col = 0; col < this.gridSize; col += 1) {
        if (!grid[row][col].isAlive && grid[row][col].colorIndex === 0) {
          const isAlive = Math.random() > 0.85 ? 1 : 0;
          const cell = {
            isAlive,
            colorIndex: isAlive ? aliveIndex : 0,
          };
          grid[row][col] = cell;
        }
      }
    }
    this.grid = grid;
  }

  countNeighbors(col, row) {
    let count = 0;

    // left
    if (col > 0) {
      count += this.grid[row][col - 1].isAlive;
    }

    // right
    if (col < this.gridSize - 1) {
      count += this.grid[row][col + 1].isAlive;
    }

    if (row > 0) {
      // above
      count += this.grid[row - 1][col].isAlive;
      if (col > 0) {
        // above left
        count += this.grid[row - 1][col - 1].isAlive;
      }
      if (col < this.gridSize - 1) {
        // above right
        count += this.grid[row - 1][col + 1].isAlive;
      }
    }

    if (row < this.gridSize - 1) {
      // below
      count += this.grid[row + 1][col].isAlive;
      if (col > 0) {
        // below left
        count += this.grid[row + 1][col - 1].isAlive;
      }
      if (col < this.gridSize - 1) {
        // below right
        count += this.grid[row + 1][col + 1].isAlive;
      }
    }

    return count;
  }

  checkGameOver(totalAlive) {
    this.turnsTotalSame = this.totalAlive === totalAlive
      ? this.turnsTotalSame + 1
      : 0;
    this.totalAlive = totalAlive;
    this.gameOver = this.turnsTotalSame > fadeTotal;
  }

  buildNextGrid() {
    const newGrid = [];
    let totalAlive = 0;
    let noChange = true;

    this.grid.forEach((row, y) => {
      newGrid.push([]);
      row.forEach((cell, x) => {
        const { isAlive, colorIndex } = cell;
        totalAlive += isAlive;
        const neightbors = this.countNeighbors(x, y);
        const newIsAlive = determineIfAlive(cell, neightbors);
        if (newIsAlive !== isAlive) {
          noChange = false;
        }
        const minusOne = colorIndex > 0 ? colorIndex - 1 : 0;
        const newIndex = newIsAlive ? aliveIndex : minusOne;
        const newCell = {
          isAlive: newIsAlive,
          colorIndex: newIndex,
        };
        newGrid[y].push(newCell);
      });
    });

    this.grid = newGrid;

    this.checkGameOver(totalAlive);
  }

  drawCanvas() {
    const { innerWidth, innerHeight } = window;
    const cellWidth = Math.ceil(innerWidth / this.gridSize);
    const cellHeight = Math.ceil(innerHeight / this.gridSize);
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        ctx.fillStyle = colorsFade[cell.colorIndex];
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      });
    });
  }

  editGrid(x, y) {
    if (this.grid[y] && this.grid[y][x]) {
      const newIsAlive = this.grid[y][x].isAlive ? 0 : 1;
      this.grid[y][x].isAlive = newIsAlive;
      this.grid[y][x].colorIndex = newIsAlive ? aliveIndex : 0;
      // this.grid[y][x].colorIndex = newIsAlive ? aliveIndex : aliveIndex - 1;
      this.drawCanvas();
    }
  }

  initGrid(canvas) {
    this.canvas = canvas;
    const { innerWidth, innerHeight } = window;
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    this.turnsTotalSame = 0;
    this.gameOver = false;
    this.createGrid();
    this.drawCanvas();
    this.initialized = true;
  }

  startGame() {
    if (!this.initialized) {
      return;
    }

    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }

    this.gameInterval = setInterval(() => {
      if (!this.gameOver) {
        this.buildNextGrid();
        this.drawCanvas();
      } else {
        clearInterval(this.gameInterval);
        this.emit('gameOver');
      }
    }, 100);
  }
}

export default GameOfLife;
