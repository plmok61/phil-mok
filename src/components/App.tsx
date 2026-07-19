'use client';

import React from 'react';
import '../styles/index.css';
import '../styles/App.css';
import GameOfLifeGrid from './GameOfLifeGrid';
import AppLinks from './AppLinks';

function App() {
  return (
    <>
      <div className="motes" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <main className="hero">
        <h1 className="siteTitle">
          Phil Mok
          <span className="dot">.</span>
        </h1>
        <GameOfLifeGrid />
        <div className="scrollHint" aria-hidden="true">▾</div>
      </main>
      <AppLinks />
      <nav className="connect">
        <a
          href="https://github.com/plmok61"
          target="_blank"
          rel="noreferrer"
        >
          github
        </a>
        <a
          href="https://www.linkedin.com/in/philiplmok/"
          target="_blank"
          rel="noreferrer"
        >
          linkedin
        </a>
      </nav>
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
