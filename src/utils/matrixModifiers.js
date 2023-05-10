/**
 * Rotates a matrix 90 degrees clockwise
 * @param {*} matrix
 * @returns matrix
 */
export function rotateMatrix(matrix) {
  const newMatrix = [];
  const newRowLength = matrix.length;

  matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      if (y === 0) {
        newMatrix.push(new Array(newRowLength));
      }

      const r = newMatrix[x];

      r[newRowLength - 1 - y] = val;
    });
  });
  return newMatrix;
}

export function flipMatrixY(matrix) {
  return matrix.map((row) => row.reverse());
}

export function flipMatrixX(matrix) {
  return [...matrix.reverse()];
}
