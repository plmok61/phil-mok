/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-mixed-operators */
import { EventEmitter } from 'events';
import {
  gameInterval,
  gridSize as gs,
  yellow,
} from '../config';
import calculateCellSize from '../utils/calculateCellSize';

const hsl = {
  yellow: { h: 46, s: 96, l: 62 },
  orange: { h: 18, s: 95, l: 53 },
  red: { h: 345, s: 79, l: 40 },
  teal: { h: 188, s: 43, l: 40 },
  darkPurple: { h: 231, s: 58, l: 10 },
};

const colors = [hsl.darkPurple, hsl.teal, hsl.red, hsl.orange, hsl.yellow];
const steps = [34, 21, 8, 3, 1];
const fadeTotal = steps.reduce((acc, num) => {
  const result = acc + num;
  return result;
}, 0);

function interpolateColor(startColor, endColor, progress) {
  const h = startColor.h + (endColor.h - startColor.h) * progress;
  const s = startColor.s + (endColor.s - startColor.s) * progress;
  const l = startColor.l + (endColor.l - startColor.l) * progress;
  const hsl = `hsl(${h}, ${s}%, ${l}%)`;
  return hsl;
}

function generateColorsFade(startColor, endColor, steps) {
  const colorsFade = [];

  for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1);
    const color = interpolateColor(startColor, endColor, progress);
    colorsFade.push(color);
  }

  return colorsFade;
}

let colorsFade = [];

for (let i = 0; i < colors.length - 1; i++) {
  const startColor = colors[i];
  const endColor = colors[i + 1];
  const stepsCount = steps[i];
  const fade = generateColorsFade(startColor, endColor, stepsCount);
  colorsFade = colorsFade.concat(fade);
}

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
  constructor({ gridSize }) {
    super();
    this.canvas = null;
    this.mouseCanvas = null;
    this.mouseDiv = null;
    this.grid = [];
    this.gridSize = gridSize;
    this.totalAlive = 0;
    this.turnsTotalSame = 0;
    this.gameInterval = null;
    this.initialized = false;
    this.mousePosition = [0, 0];
    this.cellSize = calculateCellSize(gridSize);
    this.gridWidth = this.cellSize * gridSize;
    this.gridHeight = this.cellSize * gridSize;
    this.patternEditor = [];
  }

  createGrid(initialGrid) {
    if (initialGrid) {
      this.grid = initialGrid;
    } else {
      for (let row = 0; row < this.gridSize; row += 1) {
        this.grid.push([]);
        for (let col = 0; col < this.gridSize; col += 1) {
          const isAlive = Math.random() > 0.5 ? 1 : 0;
          const cell = {
            isAlive,
            colorIndex: isAlive ? aliveIndex : 0,
          };
          this.grid[row][col] = cell;
        }
      }
    }
  }

  countNeighbors(col, row) {
    let count = 0;

    // left
    // OOO
    // XOO
    // OOO
    if (col > 0) {
      count += this.grid[row][col - 1].isAlive;
    }

    // right
    // OOO
    // OOX
    // OOO
    if (col < this.gridSize - 1) {
      count += this.grid[row][col + 1].isAlive;
    }

    if (row > 0) {
      // above
      // OXO
      // OOO
      // OOO
      count += this.grid[row - 1][col].isAlive;
      if (col > 0) {
        // above left
        // XOO
        // OOO
        // OOO
        count += this.grid[row - 1][col - 1].isAlive;
      }
      if (col < this.gridSize - 1) {
        // above right
        // OOX
        // OOO
        // OOO
        count += this.grid[row - 1][col + 1].isAlive;
      }
    }

    if (row < this.gridSize - 1) {
      // below
      // OOO
      // OOO
      // OXO
      count += this.grid[row + 1][col].isAlive;
      if (col > 0) {
        // below left
        // OOO
        // OOO
        // XOO
        count += this.grid[row + 1][col - 1].isAlive;
      }
      if (col < this.gridSize - 1) {
        // below right
        // OOO
        // OOO
        // OOX
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

    if (this.turnsTotalSame > fadeTotal) {
      clearInterval(this.gameInterval);
      this.emit('gameOver');
    }
  }

  buildNextGrid() {
    const newGrid = [];
    let totalAlive = 0;

    this.grid.forEach((row, y) => {
      newGrid.push([]);
      row.forEach((cell, x) => {
        const { isAlive, colorIndex } = cell;
        totalAlive += isAlive;
        const neightbors = this.countNeighbors(x, y);
        const newIsAlive = determineIfAlive(cell, neightbors);
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
    // console.log(JSON.stringify(this.grid));
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.gridWidth, this.gridHeight);

    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        ctx.fillStyle = colorsFade[cell.colorIndex];
        ctx.fillRect(
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize,
          this.cellSize,
        );
      });
    });
  }

  setCellAlive(x, y) {
    this.grid[y][x].isAlive = 1;
  }

  setCellDead(x, y) {
    this.grid[y][x].isAlive = 0;
  }

  editGrid(x, y) {
    if (this.grid[y] && this.grid[y][x]) {
      const newIsAlive = this.grid[y][x].isAlive ? 0 : 1;
      this.grid[y][x].isAlive = newIsAlive;
      this.grid[y][x].colorIndex = newIsAlive ? aliveIndex : 0;
      this.drawCanvas();
    }
  }

  addPattern(x, y) {
    this.patternEditor.forEach((row, yInd) => {
      row.forEach((col, xInd) => {
        const row = this.grid[y + yInd];
        if (!row) {
          return;
        }
        const cell = row[x + xInd];
        if (!cell) {
          return;
        }

        cell.isAlive = col;
        cell.colorIndex = col ? aliveIndex : 0;
      });
    });
    this.drawCanvas();
  }

  newFrame() {
    this.buildNextGrid();
    this.drawCanvas();
  }

  trackMouseHover(event) {
    const { x, y } = this.getXY(event);
    this.mousePosition = [x, y];
    this.mouseDiv.style.left = `${x * this.cellSize}px`;
    this.mouseDiv.style.top = `${y * this.cellSize}px`;
  }

  initGrid(canvas, mouseCanvas, mouseDiv, initialGrid) {
    if (!canvas || !mouseCanvas || !mouseDiv) {
      console.error('You must pass a canvas element');
      return;
    }
    this.canvas = canvas;
    this.canvas.width = this.gridWidth;
    this.canvas.height = this.gridHeight;

    this.mouseCanvas = mouseCanvas;
    this.mouseCanvas.width = this.cellSize;
    this.mouseCanvas.height = this.cellSize;
    this.mouseDiv = mouseDiv;
    this.mouseDiv.style.width = `${this.cellSize}px`;
    this.mouseDiv.style.height = `${this.cellSize}px`;

    const ctx = this.mouseCanvas.getContext('2d');
    ctx.fillStyle = yellow;

    ctx.fillRect(
      0,
      0,
      this.cellSize,
      this.cellSize,
    );

    this.turnsTotalSame = 0;
    this.createGrid(initialGrid);
    this.drawCanvas();
    this.initialized = true;
  }

  startGame() {
    if (!this.initialized) {
      console.error('You must initGrid() first');
      return;
    }

    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }

    this.gameInterval = setInterval(() => {
      this.newFrame();
    }, gameInterval);

    this.emit('pause', false);
  }

  pauseGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
      this.emit('pause', true);
    }
  }

  clearGame() {
    const blankGrid = [];
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    for (let y = 0; y < rows; y += 1) {
      const row = [];
      for (let x = 0; x < cols; x += 1) {
        row.push({ isAlive: 0, colorIndex: 0 });
      }
      blankGrid.push(row);
    }
    this.createGrid(blankGrid);
    this.drawCanvas();
  }

  resizeGrid() {
    const cellSize = calculateCellSize(this.gridSize);
    this.cellSize = cellSize;
    this.gridWidth = this.cellSize * this.gridSize;
    this.gridHeight = this.cellSize * this.gridSize;
    this.canvas.width = this.gridWidth;
    this.canvas.height = this.gridHeight;
  }

  /**
   * Gets the x, y coordinates in the game grid of the cursor when the user clicks
   * @param {*} param0
   * @returns { x, y }
   */
  getXY({ clientX, clientY }) {
    const x = Math.round(clientX / this.cellSize);
    const y = Math.round(clientY / this.cellSize);
    return { x, y };
  }
}

const GOL = new GameOfLife({ gridSize: gs });

export default GOL;
