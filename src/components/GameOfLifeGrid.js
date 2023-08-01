import React, { useEffect, useRef, useState } from 'react';
import GOL from '../gol/game-of-life';
import initialGrid from '../gol/initialGrid.json';
import patterns from '../gol/patterns';
import PatternEditor from './PatternEditor';

function GameOfLifeGrid() {
  const canvasRef = useRef(null);
  const mouseCanvasRef = useRef(null);
  const mouseDivRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(true);
  const [pattern, setPattern] = useState('glider');
  const [displayEditor, setDisplayEditor] = useState(false);
  // const cellSize = useMemo(() => window.innerWidth / gridSize, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const mouseCanvas = mouseCanvasRef.current;
    const mouseDiv = mouseDivRef.current;

    const canvasHover = (event) => {
      GOL.trackMouseHover(event);
    };
    const resizeHandler = () => {
      GOL.resizeGrid();
    };

    if (canvas && mouseCanvas && mouseDiv) {
      GOL.initGrid(canvas, mouseCanvas, mouseDiv, initialGrid);
      setTimeout(() => {
        // GOL.startGame();
      }, 1000);

      const setGOTrue = () => setGameOver(true);
      const setPausePlay = (p) => setPaused(p);

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
    const canvas = canvasRef.current;
    const canvasClick = (event) => {
      const { x, y } = GOL.getXY(event);
      if (pattern !== 'singleCell') {
        GOL.addPattern(x, y);
      } else {
        GOL.editGrid(x, y);
      }
    };

    if (canvas) {
      canvas.addEventListener('click', canvasClick);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', canvasClick);
      }
    };
  }, [pattern]);

  useEffect(() => {
    if (gameOver) {
      GOL.pauseGame();
      setGameOver(false);
    }
  }, [gameOver]);

  return (
    <div>
      <div className="gameCanvasContainer">
        <canvas ref={canvasRef}>
          <p>fallback</p>
        </canvas>
      </div>
      <div
        className="mouseCanvas"
        ref={mouseDivRef}
      >
        <canvas ref={mouseCanvasRef} />
      </div>
      <div className="controlBar">

        <button
          className="gameButton controlBarButton"
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
          Random Game
        </button>
        <button
          className="gameButton controlBarButton"
          type="button"
          onClick={() => {
            GOL.initGrid(
              canvasRef.current,
              mouseCanvasRef.current,
              mouseDivRef.current,
              initialGrid,
            );
            GOL.pauseGame();
          }}
        >
          Reset Game
        </button>
        <button
          className="gameButton controlBarButton"
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
          className="gameButton controlBarButton"
          type="button"
          onClick={() => {
            GOL.pauseGame();
            GOL.clearGame();
          }}
        >
          Clear
        </button>
        <button
          className="gameButton controlBarButton"
          type="button"
          onClick={() => {
            setDisplayEditor((prev) => !prev);
          }}
        >
          Editor
        </button>

      </div>
      <div>
        {displayEditor && (
        <PatternEditor
          pattern={patterns[pattern]}
          patternName={pattern}
          setPattern={setPattern}
          setDisplayEditor={setDisplayEditor}
        />
        )}
      </div>
    </div>
  );
}

export default GameOfLifeGrid;
