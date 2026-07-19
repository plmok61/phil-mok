import React, { useEffect, useRef, useState } from 'react';
import GOL from '../gol/game-of-life';
import initialGrid from '../gol/initialGrid.json';
import patterns from '../gol/patterns';
import { Grid } from '../types';

type StampMode = 'quad' | 'deadSingle';

function GameOfLifeGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseDivRef = useRef<HTMLDivElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(true);
  const [stampMode, setStampMode] = useState<StampMode>('quad');

  useEffect(() => {
    const canvas = canvasRef.current;
    const mouseCanvas = mouseCanvasRef.current;
    const mouseDiv = mouseDivRef.current;

    const canvasHover = (event: globalThis.MouseEvent) => {
      GOL.trackMouseHover(event);
    };
    const resizeHandler = () => {
      GOL.resizeGrid();
    };

    if (canvas && mouseCanvas && mouseDiv) {
      GOL.initGrid(canvas, mouseCanvas, mouseDiv, initialGrid as Grid);
      setTimeout(() => {
        GOL.startGame();
      }, 1000);

      const setGOTrue = () => setGameOver(true);
      const setPausePlay = (p: boolean) => setPaused(p);

      GOL.on('gameOver', setGOTrue);
      GOL.on('pause', setPausePlay);

      canvas.addEventListener('mousemove', canvasHover);
      window.addEventListener('resize', resizeHandler);
    }
    return () => {
      GOL.removeAllListeners();
      if (canvas) {
        canvas.removeEventListener('mousemove', canvasHover);
        window.removeEventListener('resize', resizeHandler);
      }
    };
  }, []);

  useEffect(() => {
    GOL.patternEditor = patterns[stampMode];
    const canvas = canvasRef.current;
    const canvasClick = (event: MouseEvent) => {
      const target = event.target as HTMLCanvasElement;
      const rect = target.getBoundingClientRect();
      const elX = event.clientX - rect.left;
      const elY = event.clientY - rect.top;
      const { x, y } = GOL.getXY(elX, elY);
      GOL.addPattern(x, y, stampMode);
    };

    if (canvas) {
      canvas.addEventListener('click', canvasClick);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', canvasClick);
      }
    };
  }, [stampMode]);

  useEffect(() => {
    if (gameOver) {
      GOL.pauseGame();
      setGameOver(false);
    }
  }, [gameOver]);

  return (
    <div className="container">
      <div className="gameCanvasContainer">
        <canvas ref={canvasRef}>
          <p>fallback</p>
        </canvas>
        <div
          className="mouseCanvas"
          ref={mouseDivRef}
        >
          <canvas ref={mouseCanvasRef} />
        </div>
      </div>
      <div className="controlBar">
        <button
          className="gameButton"
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
          className="gameButton"
          type="button"
          onClick={() => {
            GOL.initGrid(
              canvasRef.current,
              mouseCanvasRef.current,
              mouseDivRef.current,
            );
            GOL.startGame();
          }}
        >
          Random
        </button>
        <button
          className="gameButton"
          type="button"
          onClick={() => {
            GOL.initGrid(
              canvasRef.current,
              mouseCanvasRef.current,
              mouseDivRef.current,
              initialGrid as Grid,
            );
            GOL.pauseGame();
          }}
        >
          Reset
        </button>
        <button
          className="gameButton"
          type="button"
          onClick={() => {
            GOL.pauseGame();
            GOL.clearGame();
          }}
        >
          Clear
        </button>
        <button
          className="gameButton"
          type="button"
          onClick={() => {
            setStampMode((prev) => (prev === 'quad' ? 'deadSingle' : 'quad'));
          }}
        >
          {stampMode === 'quad' ? 'Stamp: quad' : 'Stamp: erase'}
        </button>
      </div>
    </div>
  );
}

export default GameOfLifeGrid;
