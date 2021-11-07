import React, { useEffect, useRef, useState } from 'react';
import GameOfLife from '../gol/game-of-life';
import initialGrid from '../gol/initialGrid.json';

const GOL = new GameOfLife({ gridSize: 100 });

function GameOfLifeGrid() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasClick = (event) => {
      const { clientX, clientY } = event;
      const x = Math.round(clientX / Math.ceil(window.innerWidth / GOL.gridSize));
      const y = Math.round(clientY / Math.ceil(window.innerHeight / GOL.gridSize));
      GOL.editGrid(x, y);
    };

    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      GOL.initGrid(canvasRef.current, initialGrid);
      setTimeout(() => {
        GOL.startGame();
      }, 1000);

      const setGOTrue = () => setGameOver(true);
      GOL.on('gameOver', setGOTrue);

      canvas.addEventListener('click', canvasClick);
    }
    return () => {
      GOL.removeAllListeners();
      if (canvas) canvas.removeEventListener('click', canvasClick);
    };
  }, []);

  useEffect(() => {
    if (gameOver) {
      GOL.initGrid(canvasRef.current);
      GOL.startGame();
      setGameOver(false);
    }
  }, [gameOver]);

  return (
    <div>
      <canvas ref={canvasRef}>
        <p>fallback</p>
      </canvas>
      <button
        className="gameButton randomButton"
        type="button"
        onClick={() => {
          GOL.initGrid(canvasRef.current);
          GOL.startGame();
        }}
      >
        Random Game
      </button>
      <button
        className="gameButton resetButton"
        type="button"
        onClick={() => {
          GOL.initGrid(canvasRef.current, initialGrid);
          GOL.startGame();
        }}
      >
        Reset Game
      </button>
    </div>
  );
}

export default GameOfLifeGrid;
