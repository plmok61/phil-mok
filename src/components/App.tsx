'use client';

import React, { useRef } from 'react';
import '../styles/index.css';
import '../styles/App.css';
import GameOfLifeGrid from './GameOfLifeGrid';
import AppLinks from './AppLinks';
import BackgroundLife from './BackgroundLife';

function App() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <>
      <BackgroundLife heroRef={heroRef} />
      <div className="motes" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <main className="hero" ref={heroRef}>
        <h1 className="siteTitle">
          Phil Mok
        </h1>
        <GameOfLifeGrid />
        <div className="scrollHint" aria-hidden="true">▾</div>
      </main>
      <AppLinks />
      <section className="appsSection connectSection">
        <h2>Connect</h2>
        <div className="appCards">
          <a
            className="appCard"
            href="https://github.com/plmok61"
            target="_blank"
            rel="noreferrer"
          >
            <p className="appCardName">GitHub</p>
            <p className="appCardDescription">Code and side projects — including the source for this site.</p>
          </a>
          <a
            className="appCard"
            href="https://www.linkedin.com/in/philiplmok/"
            target="_blank"
            rel="noreferrer"
          >
            <p className="appCardName">LinkedIn</p>
            <p className="appCardDescription">Work history and professional profile.</p>
          </a>
        </div>
      </section>
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
