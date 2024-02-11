/* eslint-disable no-plusplus */
import { EventEmitter } from 'events';
import {
  gameInterval,
  gridSize as gs,
  yellow,
  baseSize,
} from '../config';
import calculateCellSize from '../utils/calculateCellSize';
import {
  Cell, Grid, HSLColor, HSLColorsMap, PatterNames, Pattern, Row,
} from '../types';

const hsl: HSLColorsMap = {
  red: { h: 0, s: 100, l: 33 },
  gold: { h: 42, s: 36, l: 53 },
  // white: { h: 0, s: 0, l: 100 },
  black: { h: 0, s: 0, l: 0 },
  // red: { h: 345, s: 79, l: 40 },
  // orange: { h: 18, s: 95, l: 53 },
  // yellow: { h: 46, s: 96, l: 62 },
  // teal: { h: 188, s: 43, l: 40 },
  // darkPurple: { h: 231, s: 58, l: 10 },
};

// const colors = [hsl.darkPurple, hsl.teal, hsl.red, hsl.orange, hsl.yellow];
// const steps = [34, 21, 13, 8, 5];
const colors = [hsl.black, hsl.gold, hsl.red];
const steps = [21, 34, 55];
const fadeTotal = steps.reduce((acc, num) => {
  const result = acc + num;
  return result;
}, 0);

function interpolateColor(startColor: HSLColor, endColor: HSLColor, progress: number) {
  const h = startColor.h + (endColor.h - startColor.h) * progress;
  const s = startColor.s + (endColor.s - startColor.s) * progress;
  const l = startColor.l + (endColor.l - startColor.l) * progress;
  const hslString = `hsl(${h}, ${s}%, ${l}%)`;
  return hslString;
}

function generateColorsFade(startColor: HSLColor, endColor: HSLColor, stepsCount: number) {
  const colorsFade = [];

  for (let i = 0; i < stepsCount; i++) {
    const progress = i / (stepsCount - 1);
    const color = interpolateColor(startColor, endColor, progress);
    colorsFade.push(color);
  }

  return colorsFade;
}

let colorsFade: string[] = [];

for (let i = 0; i < colors.length - 1; i++) {
  const startColor = colors[i];
  const endColor = colors[i + 1];
  const stepsCount = steps[i];
  const fade = generateColorsFade(startColor, endColor, stepsCount);
  colorsFade = colorsFade.concat(fade);
}

const aliveIndex = colorsFade.length - 1;

function determineIfAlive(cell: Cell, numNeighbors: number) {
  const aliveWithCorrectNeighbors = cell.isAlive === 1 && (numNeighbors === 2 || numNeighbors === 3);
  const deadWithCorrectNeighbors = cell.isAlive === 0 && numNeighbors === 3;
  if (aliveWithCorrectNeighbors || deadWithCorrectNeighbors) {
    return 1;
  }
  return 0;
}

function determineIfImmortal(x: number, y: number, gridSize: number) {
  return x === 0 || x === gridSize - 1 || y === 0 || y === gridSize - 1;
}

class GameOfLife extends EventEmitter {
  canvas: HTMLCanvasElement | null;

  mouseCanvas: HTMLCanvasElement | null;

  mouseDiv: HTMLDivElement | null;

  grid: Grid;

  gridSize: number;

  totalAlive: number;

  turnsTotalSame: number;

  gameInterval: ReturnType<typeof setInterval> | null;

  initialized: boolean;

  mousePosition: [number, number];

  cellSize: number;

  gridWidth: number;

  gridHeight: number;

  patternEditor: Pattern;

  constructor({ gridSize }: { gridSize: number }) {
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
    this.cellSize = calculateCellSize(gridSize, baseSize);
    this.gridWidth = this.cellSize * gridSize;
    this.gridHeight = this.cellSize * gridSize;
    this.patternEditor = [];
  }

  createGrid(initialGrid?: Grid) {
    if (initialGrid) {
      this.grid = initialGrid;
      // make edges immortal
      for (let row = 0; row < this.gridSize; row += 1) {
        for (let col = 0; col < this.gridSize; col += 1) {
          const alreadyImmortal = this.grid[row][col].isImmortal;
          const isImmortal = determineIfImmortal(col, row, this.gridSize);
          this.grid[row][col].isImmortal = isImmortal || alreadyImmortal;
          this.grid[row][col].colorIndex = alreadyImmortal ? aliveIndex : this.grid[row][col].colorIndex;
        }
      }
    } else {
      for (let row = 0; row < this.gridSize; row += 1) {
        this.grid.push([]);
        for (let col = 0; col < this.gridSize; col += 1) {
          const isAlive = Math.random() > 0.5 ? 1 : 0;
          const isImmortal = determineIfImmortal(col, row, this.gridSize);
          let colorIndex;
          if (isImmortal) {
            colorIndex = 0;
          } else {
            colorIndex = isAlive ? aliveIndex : 0;
          }
          const cell: Cell = {
            isAlive,
            colorIndex,
            isImmortal,
          };
          this.grid[row][col] = cell;
        }
      }
    }
  }

  countNeighbors(col: number, row: number) {
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

  checkGameOver(totalAlive: number) {
    this.turnsTotalSame = this.totalAlive === totalAlive
      ? this.turnsTotalSame + 1
      : 0;
    this.totalAlive = totalAlive;

    if (this.turnsTotalSame > fadeTotal) {
      if (this.gameInterval) clearInterval(this.gameInterval);
      this.emit('gameOver');
    }
  }

  buildNextGrid() {
    const newGrid: Grid = [];
    let totalAlive = 0;

    this.grid.forEach((row, y) => {
      newGrid.push([]);
      row.forEach((cell, x) => {
        if (cell.isImmortal) {
          newGrid[y].push({
            isAlive: Math.random() > 0.5 ? 1 : 0,
            colorIndex: 0,
            isImmortal: true,
          });
          return;
        }
        const { isAlive, colorIndex } = cell;
        totalAlive += isAlive;
        const neightbors = this.countNeighbors(x, y);
        const newIsAlive = determineIfAlive(cell, neightbors);
        const minusOne = colorIndex > 0 ? colorIndex - 1 : 0;
        const newIndex = newIsAlive ? aliveIndex : minusOne;
        const newCell: Cell = {
          isAlive: newIsAlive,
          colorIndex: newIndex,
          isImmortal: false,
        };
        newGrid[y].push(newCell);
      });
    });

    this.grid = newGrid;

    this.checkGameOver(totalAlive);
  }

  drawCanvas() {
    if (!this.canvas) {
      return;
    }
    // console.log(JSON.stringify(this.grid));
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
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
    console.log(JSON.stringify(this.grid));
  }

  setCellAlive(x: number, y: number) {
    this.grid[y][x].isAlive = 1;
  }

  setCellDead(x: number, y: number) {
    this.grid[y][x].isAlive = 0;
  }

  editGrid(x: number, y: number) {
    if (this.grid[y] && this.grid[y][x]) {
      const newIsAlive = this.grid[y][x].isAlive ? 0 : 1;
      this.grid[y][x].isAlive = newIsAlive;
      this.grid[y][x].colorIndex = newIsAlive ? aliveIndex : 0;
      this.drawCanvas();
    }
  }

  addPattern(x: number, y: number, pattern: PatterNames) {
    this.patternEditor.forEach((row, yInd) => {
      row.forEach((col, xInd) => {
        const r = this.grid[y + yInd];
        if (!r) {
          return;
        }
        const cell = r[x + xInd];
        if (!cell) {
          return;
        }

        cell.isAlive = col;
        cell.colorIndex = col ? aliveIndex : 0;
        cell.isImmortal = pattern === 'quad';
      });
    });
    this.drawCanvas();
  }

  newFrame() {
    this.buildNextGrid();
    this.drawCanvas();
  }

  trackMouseHover(event: globalThis.MouseEvent) {
    if (!this.mouseDiv) {
      return;
    }
    const { x, y } = this.getXY(event.clientX, event.clientY);
    this.mousePosition = [x, y];
    this.mouseDiv.style.left = `${x * this.cellSize}px`;
    this.mouseDiv.style.top = `${y * this.cellSize}px`;
  }

  initGrid(
    canvas: HTMLCanvasElement | null,
    mouseCanvas: HTMLCanvasElement | null,
    mouseDiv: HTMLDivElement | null,
    initialGrid?: Grid,
  ) {
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
    if (!ctx) {
      return;
    }
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
    const blankGrid: Grid = [];
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    for (let y = 0; y < rows; y += 1) {
      const row: Row = [];
      for (let x = 0; x < cols; x += 1) {
        row.push({ isAlive: 0, colorIndex: 0, isImmortal: false });
      }
      blankGrid.push(row);
    }
    this.createGrid(blankGrid);
    this.drawCanvas();
  }

  resizeGrid() {
    if (!this.canvas) {
      return;
    }
    this.cellSize = calculateCellSize(this.gridSize, baseSize);
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
  getXY(elementX: number, elementY: number) {
    const x = Math.round(elementX / this.cellSize);
    const y = Math.round(elementY / this.cellSize);
    return { x, y };
  }
}

const GOL = new GameOfLife({ gridSize: gs });

export default GOL;
