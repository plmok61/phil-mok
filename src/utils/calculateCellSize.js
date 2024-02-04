function calculateCellSize(gridSize, baseSize = 10) {
  const windowWidth = window.innerWidth - 16;
  const baseWidth = gridSize * baseSize;
  const width = windowWidth > baseWidth ? baseWidth : windowWidth;
  return Math.floor((width / gridSize) * 10) / 10;
}

export default calculateCellSize;
