export interface Cell {
  isAlive: 0 | 1;
  colorIndex: number;
  isImmortal: boolean;
}

export type Row = Cell[];

export type Grid = Row[];

export type BinaryCell = 0 | 1;

export type Pattern = BinaryCell[][];

export type PatterNames = 'single' |
  'blinker' |
  'fireship' |
  'glider' |
  'gosperGliderGun' |
  'pulsar' |
  'quasar' |
  'quad' |
  'vampire' |
  'deadSingle';

export interface HSLColor {
  h: number,
  s: number,
  l: number,
}

export type HSLColorsMap = Record<string, HSLColor>;
