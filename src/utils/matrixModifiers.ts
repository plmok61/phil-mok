import { Pattern } from '../types';

// Rotate 90° clockwise
export function rotateMatrix(matrix: Pattern): Pattern {
  return matrix[0].map((_, col) => matrix.map((row) => row[col]).reverse());
}

// Mirror left/right (across the vertical axis)
export function flipMatrixX(matrix: Pattern): Pattern {
  return matrix.map((row) => [...row].reverse());
}

// Mirror top/bottom (across the horizontal axis)
export function flipMatrixY(matrix: Pattern): Pattern {
  return [...matrix].reverse();
}
