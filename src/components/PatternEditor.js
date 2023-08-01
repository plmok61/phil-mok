import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GOL from '../gol/game-of-life';
import {
  darkPurple, red,
} from '../config';
import { rotateMatrix, flipMatrixX, flipMatrixY } from '../utils/matrixModifiers';
import patterns from '../gol/patterns';

function PatternEditor({
  pattern, patternName, setPattern, setDisplayEditor,
}) {
  const canvasRef = useRef(null);
  const [edit, setEdit] = useState(pattern);

  useEffect(() => {
    GOL.patternEditor = edit;
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      const cellSize = 10;
      const canvasWidth = cellSize * edit[0].length;
      const canvasHeight = cellSize * edit.length;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvasRef.current.getContext('2d');

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

PatternEditor.propTypes = {
  pattern: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  patternName: PropTypes.string.isRequired,
  setPattern: PropTypes.func.isRequired,
  setDisplayEditor: PropTypes.func.isRequired,
};

export default PatternEditor;
