/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import GameOfLife from '../gol/game-of-life';

const GOL = new GameOfLife({ gridSize: 100 });

// function getMousePos(canvas, evt) {
//   const rect = canvas.getBoundingClientRect();
//   return {
//     x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
//     y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height,
//   };
// }

function App() {
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      GOL.initGrid(canvasRef.current);
      setGrid(GOL.grid);
      const setGOTrue = () => setGameOver(true);
      GOL.on('gameOver', setGOTrue);
    }
    return () => GOL.removeAllListeners();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.addEventListener('click', (event) => {
        const { clientX, clientY } = event;
        const x = Math.floor(clientX / Math.ceil(window.innerHeight / GOL.gridSize));
        const y = Math.floor(clientY / Math.ceil(window.innerHeight / GOL.gridSize));
        GOL.editGrid(x, y);
      });
      // let mouseDown = false;
      // canvasRef.current.addEventListener('mousedown', () => {
      //   mouseDown = true;
      // });

      // canvasRef.current.addEventListener('mouseup', () => {
      //   mouseDown = false;
      // });

      // canvasRef.current.addEventListener('mousemove', (event) => {
      //   if (mouseDown) {
      //     const { clientX, clientY } = event;
      //     const x = Math.floor(clientX / Math.ceil(window.innerHeight / GOL.gridSize));
      //     const y = Math.floor(clientY / Math.ceil(window.innerHeight / GOL.gridSize));
      //     GOL.editGrid(x, y);
      //   }
      // });
    }
    // return () => canvasRef.current.removeEventListener();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}>
        <p>fallback</p>
      </canvas>
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
    </div>
  );
}

export default App;
