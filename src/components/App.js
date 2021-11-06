import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import GameOfLife from '../gol/game-of-life';
import initialGrid from '../gol/initialGrid.json';

const GOL = new GameOfLife({ gridSize: 100, initialGrid });

function App() {
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

      GOL.initGrid(canvasRef.current);
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

  return (
    <div>
      <canvas ref={canvasRef}>
        <p>fallback</p>
      </canvas>
      {gameOver && (
        <button
          className="newGameButton"
          type="button"
          onClick={() => {
            GOL.initGrid(canvasRef.current);
            GOL.startGame();
          }}
        >
          New Game
        </button>
      )}
    </div>
  );
}

export default App;
