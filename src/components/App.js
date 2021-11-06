/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import GameOfLife from '../game-of-life';

const GOL = new GameOfLife();

function App() {
  const canvasRef = useRef(null);

  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      GOL.startGame(canvasRef.current);

      const setGOTrue = () => setGameOver(true);
      GOL.on('gameOver', setGOTrue);
    }
    return () => GOL.removeAllListeners();
  }, []);

  return (
    <div>
      {gameOver && (
        <button
          type="button"
          onClick={() => {
            GOL.startGame(canvasRef.current);
            setGameOver(false);
          }}
        >
          New Game
        </button>
      )}
      <canvas ref={canvasRef}>
        <p>fallback</p>
      </canvas>
    </div>
  );
}

export default App;
