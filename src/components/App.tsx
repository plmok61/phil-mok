'use client';

import React from 'react';
import '../styles/index.css';
import '../styles/App.css';
import SiteHeader from './SiteHeader';
import GameOfLifeGrid from './GameOfLifeGrid';
import AppLinks from './AppLinks';

function App() {
  return (
    <>
      <SiteHeader />
      <GameOfLifeGrid />
      <AppLinks />
      <footer className="siteFooter">
        ©
        {' '}
        {new Date().getFullYear()}
        {' '}
        Phil Mok
      </footer>
    </>
  );
}

export default App;
