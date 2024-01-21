export interface Cell {
  isAlive: 0 | 1;
  colorIndex: number;
}

export type Row = Cell[];

export type Grid = Row[];

export type BinaryCell = 0 | 1;

export type Pattern = BinaryCell[][];

export interface HSLColor {
  h: number,
  s: number,
  l: number,
}

export type HSLColorsMap = Record<string, HSLColor>;
