import React, { useEffect, useRef, useState } from 'react';
import GameOfLife from '../gol/game-of-life';
import initialGrid from '../gol/initialGrid.json';

const gridSize = 100;

const GOL = new GameOfLife({ gridSize });

function getXY({ clientX, clientY }) {
  const x = Math.round(clientX / Math.ceil(window.innerWidth / gridSize));
  const y = Math.round(clientY / Math.ceil(window.innerHeight / gridSize));
  return { x, y };
}

function GameOfLifeGrid() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasClick = (event) => {
      const { x, y } = getXY(event);
      GOL.editGrid(x, y);
    };

    const canvasHover = (event) => {
      const { x, y } = getXY(event);
      GOL.trackMouse(x, y);
    };

    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      GOL.initGrid(canvas, initialGrid);
      setTimeout(() => {
        GOL.startGame();
      }, 1000);

      const setGOTrue = () => setGameOver(true);
      const setPausePlay = (p) => setPaused(p);

      GOL.on('gameOver', setGOTrue);
      GOL.on('pause', setPausePlay);

      canvas.addEventListener('click', canvasClick);
      canvas.addEventListener('mousemove', canvasHover);
    }
    return () => {
      GOL.removeAllListeners();
      if (canvas) {
        canvas.removeEventListener('click', canvasClick);
        canvas.removeEventListener('mousemove', canvasHover);
      }
    };
  }, []);

  useEffect(() => {
    if (gameOver) {
      GOL.pauseGame();
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
      <button
        className="gameButton pausePlayButton"
        type="button"
        onClick={() => {
          if (paused) {
            GOL.startGame();
          } else {
            GOL.pauseGame();
          }
        }}
      >
        {paused ? 'Play' : 'Pause'}
      </button>

      <button
        className="gameButton clearButton"
        type="button"
        onClick={() => {
          GOL.pauseGame();
          GOL.clearGame();
        }}
      >
        Clear
      </button>
    </div>
  );
}

export default GameOfLifeGrid;
