'use client';

import React from 'react';
import '../styles/index.css';
import '../styles/App.css';
import GameOfLifeGrid from './GameOfLifeGrid';
import Profile from './Profile';

function App() {
  return (
    <>
      <GameOfLifeGrid />
      <Profile />
    </>
  );
}

export default App;
