import React, {
  useRef, useEffect, useState, Dispatch, SetStateAction,
} from 'react';
import GOL from '../gol/game-of-life';
import { darkPurple, red } from '../config';
import { rotateMatrix, flipMatrixX, flipMatrixY } from '../utils/matrixModifiers';
import patterns from '../gol/patterns';
import { Pattern } from '../types';

interface Props {
  pattern: Pattern,
  patternName: string,
  setPattern: Dispatch<SetStateAction<string>>,
  setDisplayEditor: Dispatch<SetStateAction<boolean>>,
}

function PatternEditor({
  pattern, patternName, setPattern, setDisplayEditor,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [edit, setEdit] = useState(pattern);

  useEffect(() => {
    GOL.patternEditor = edit;
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const cellSize = 10;
      const canvasWidth = cellSize * edit[0].length;
      const canvasHeight = cellSize * edit.length;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      edit.forEach((row, y) => {
        row.forEach((cell, x) => {
          ctx.fillStyle = cell ? red : darkPurple;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
      });
    };
    if (canvasRef.current) {
      drawCanvas();
    }
  }, [edit]);

  useEffect(() => {
    setEdit(pattern);
  }, [pattern]);

  return (
    <div className="patternEditor">
      <p>{patternName}</p>
      <div className="patternControlBar">
        <select
          className="gameButton"
          id="pattern-select"
          value={patternName}
          onChange={(event) => {
            setPattern(event.target.value);
          }}
        >
          {Object.keys(patterns).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          className="gameButton"
          type="button"
          onClick={() => {
            setEdit(rotateMatrix(edit));
          }}
        >
          Rotate
        </button>
        <button
          className="gameButton"
          type="button"
          onClick={() => {
            setEdit(flipMatrixX(edit));
          }}
        >
          Flip X
        </button>
        <button
          className="gameButton"
          type="button"
          onClick={() => {
            setEdit(flipMatrixY(edit));
          }}
        >
          Flip Y
        </button>
      </div>
      <div className="patternEditorCanvas">
        <canvas ref={canvasRef} />
      </div>
      <div>
        <button
          className="gameButton patternEditorCloseButton"
          type="button"
          onClick={() => {
            setDisplayEditor(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PatternEditor;
