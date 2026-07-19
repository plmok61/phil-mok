/* eslint-disable no-plusplus */
import { gameInterval, bgCellSize } from '../config';
import { Pattern } from '../types';
import glider from './patterns/glider';
import lwss from './patterns/lwss';
import { rotateMatrix, flipMatrixX, flipMatrixY } from '../utils/matrixModifiers';

// Dimmer cousin of the hero board's bioluminescence: alive cells glow
// dim aqua and decay through teal -> deep blue -> fully transparent,
// so the canvas stays see-through behind the page content.
interface HSLAColor {
  h: number;
  s: number;
  l: number;
  a: number;
}

const hsla: Record<string, HSLAColor> = {
  gone: {
    h: 204, s: 62, l: 12, a: 0,
  },
  deepBlue: {
    h: 204, s: 62, l: 18, a: 0.3,
  },
  teal: {
    h: 187, s: 58, l: 32, a: 0.45,
  },
  aqua: {
    h: 168, s: 82, l: 52, a: 0.6,
  },
};

const colors = [hsla.gone, hsla.deepBlue, hsla.teal, hsla.aqua];
const steps = [20, 13, 8]; // one entry per gradient segment (colors.length - 1)

function interpolateColor(startColor: HSLAColor, endColor: HSLAColor, progress: number) {
  const h = startColor.h + (endColor.h - startColor.h) * progress;
  const s = startColor.s + (endColor.s - startColor.s) * progress;
  const l = startColor.l + (endColor.l - startColor.l) * progress;
  const a = startColor.a + (endColor.a - startColor.a) * progress;
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

let colorsFade: string[] = [];

for (let i = 0; i < colors.length - 1; i++) {
  const stepsCount = steps[i];
  const fade: string[] = [];
  for (let j = 0; j < stepsCount; j++) {
    fade.push(interpolateColor(colors[i], colors[i + 1], j / (stepsCount - 1)));
  }
  colorsFade = colorsFade.concat(fade);
}

const aliveIndex = colorsFade.length - 1;

// Spawnable spaceships by heading octant. Octant 0 is east, increasing
// clockwise in screen coordinates (y down): E, SE, S, SW, W, NW, N, NE.
// Diagonals are gliders (base phase travels SE), orthogonals are LWSS
// (base phase travels W); the rest are mirrors/rotations of those two.
const headingPatterns: Pattern[] = [
  flipMatrixX(lwss), // E
  glider, // SE
  rotateMatrix(flipMatrixX(lwss)), // S
  flipMatrixX(glider), // SW
  lwss, // W
  flipMatrixY(flipMatrixX(glider)), // NW
  rotateMatrix(lwss), // N
  flipMatrixY(glider), // NE
];

interface BgCell {
  isAlive: 0 | 1;
  colorIndex: number;
}

function determineIfAlive(cell: BgCell, numNeighbors: number) {
  const aliveWithCorrectNeighbors = cell.isAlive === 1 && (numNeighbors === 2 || numNeighbors === 3);
  const deadWithCorrectNeighbors = cell.isAlive === 0 && numNeighbors === 3;
  if (aliveWithCorrectNeighbors || deadWithCorrectNeighbors) {
    return 1;
  }
  return 0;
}

class BackgroundLife {
  canvas: HTMLCanvasElement | null;

  grid: BgCell[][];

  cols: number;

  rows: number;

  cellSize: number;

  population: number;

  visibleCells: number;

  gameInterval: ReturnType<typeof setInterval> | null;

  constructor() {
    this.canvas = null;
    this.grid = [];
    this.cols = 0;
    this.rows = 0;
    this.cellSize = bgCellSize;
    this.population = 0;
    this.visibleCells = 0;
    this.gameInterval = null;
  }

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.resize();
  }

  // Size the canvas to the viewport and rebuild the grid, keeping any
  // overlapping cells (mobile URL-bar show/hide fires resize mid-scroll;
  // wiping the board there would clear it constantly).
  resize() {
    if (!this.canvas) {
      return;
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;

    const cols = Math.ceil(width / this.cellSize);
    const rows = Math.ceil(height / this.cellSize);
    const newGrid: BgCell[][] = [];
    let population = 0;
    for (let y = 0; y < rows; y++) {
      const row: BgCell[] = [];
      for (let x = 0; x < cols; x++) {
        const oldCell = this.grid[y] && this.grid[y][x];
        const cell: BgCell = oldCell || { isAlive: 0, colorIndex: 0 };
        population += cell.isAlive;
        row.push(cell);
      }
      newGrid.push(row);
    }
    this.grid = newGrid;
    this.cols = cols;
    this.rows = rows;
    this.population = population;
    this.drawCanvas();
  }

  countNeighbors(col: number, row: number) {
    let count = 0;
    for (let y = row - 1; y <= row + 1; y++) {
      for (let x = col - 1; x <= col + 1; x++) {
        if (y === row && x === col) {
          continue; // eslint-disable-line no-continue
        }
        if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
          count += this.grid[y][x].isAlive;
        }
      }
    }
    return count;
  }

  // Pure Conway rules: no immortal edges, no stagnation detection.
  // Out-of-bounds neighbors count as dead, so spaceships die at the edges.
  buildNextGrid() {
    const newGrid: BgCell[][] = [];
    let population = 0;
    let visibleCells = 0;

    this.grid.forEach((row, y) => {
      newGrid.push([]);
      row.forEach((cell, x) => {
        const neighbors = this.countNeighbors(x, y);
        const isAlive = determineIfAlive(cell, neighbors);
        population += isAlive;
        const minusOne = cell.colorIndex > 0 ? cell.colorIndex - 1 : 0;
        const colorIndex = isAlive ? aliveIndex : minusOne;
        if (colorIndex > 0) {
          visibleCells += 1;
        }
        newGrid[y].push({ isAlive, colorIndex });
      });
    });

    this.grid = newGrid;
    this.population = population;
    this.visibleCells = visibleCells;
  }

  drawCanvas() {
    if (!this.canvas) {
      return;
    }
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.colorIndex === 0) {
          return; // transparent — the board is mostly empty
        }
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

  // Stamp the spaceship for the given heading octant (see headingPatterns),
  // centered on the given viewport pixel position. Additive: only live cells
  // are stamped, so spawning over debris merges instead of carving holes.
  spawnHeading(clientX: number, clientY: number, octant: number) {
    const pattern = headingPatterns[octant];
    if (!pattern || !this.canvas) {
      return;
    }
    const originX = Math.floor(clientX / this.cellSize) - Math.floor(pattern[0].length / 2);
    const originY = Math.floor(clientY / this.cellSize) - Math.floor(pattern.length / 2);

    pattern.forEach((row, yInd) => {
      row.forEach((col, xInd) => {
        if (!col) {
          return;
        }
        const r = this.grid[originY + yInd];
        const cell = r && r[originX + xInd];
        if (!cell) {
          return;
        }
        this.population += 1 - cell.isAlive;
        cell.isAlive = 1;
        cell.colorIndex = aliveIndex;
      });
    });

    this.drawCanvas();
    this.startGame();
  }

  startGame() {
    if (this.gameInterval || !this.canvas) {
      return;
    }
    this.gameInterval = setInterval(() => {
      this.buildNextGrid();
      this.drawCanvas();
      // idle once everything is dead and the fade trails are gone
      if (this.population === 0 && this.visibleCells === 0) {
        this.pauseGame();
      }
    }, gameInterval);
  }

  pauseGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }
}

const BGL = new BackgroundLife();

export default BGL;
