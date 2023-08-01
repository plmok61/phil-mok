function calculateCellSize(gridSize) {
  const width = window.innerWidth - 16;
  return Math.floor((width / gridSize) * 10) / 10;
}

export default calculateCellSize;
