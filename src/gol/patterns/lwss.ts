import { Pattern } from '../../types';

// Lightweight spaceship — this phase travels west (orthogonally)
const lwss: Pattern = [
  [0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 0],
];

export default lwss;
