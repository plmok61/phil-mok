# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal website (phil-mok) built with Next.js 14 (App Router). The centerpiece is an interactive Conway's Game of Life rendered to a full-screen `<canvas>`, plus a GitHub profile widget. There is no test suite.

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm start` — serve the production build
- `npx eslint src` — lint (config in `.eslintrc`, airbnb-typescript, `max-len` 120)

Node 20.x is required (`engines` in package.json).

## Architecture

The app is rendered fully client-side. `src/app/page.tsx` dynamically imports `components/App` with `{ ssr: false }` because the Game of Life depends on `window`/`canvas` and a module-level singleton; nothing in the game can run during SSR. `App.tsx` renders just `<GameOfLifeGrid />` and `<Profile />`.

### Game of Life engine (`src/gol/game-of-life.ts`)

The engine is a **single shared instance** — `GOL`, an `EventEmitter` subclass exported as a module-level singleton (`new GameOfLife(...)`). All React components import and mutate the same `GOL` object; this is the key architectural fact. The class owns the grid state, canvas refs, the `setInterval` game loop, and rendering. React components are thin controllers over it.

Lifecycle and data flow:
- `initGrid(canvas, mouseCanvas, mouseDiv, initialGrid?)` wires up the DOM canvases and builds the grid. With no `initialGrid` it generates a random board; otherwise it loads one (e.g. `src/gol/initialGrid.json`).
- `startGame()` / `pauseGame()` drive the loop via `setInterval` at `gameInterval` ms. Each tick calls `newFrame()` → `buildNextGrid()` (standard Conway rules in `determineIfAlive` + `countNeighbors`) → `drawCanvas()`.
- The engine emits `'gameOver'` and `'pause'` events; `GameOfLifeGrid` subscribes with `GOL.on(...)` to sync React state. Stagnation detection (`checkGameOver`) fires `'gameOver'` once the live-cell count is unchanged for more than `fadeTotal` turns.
- **Edge cells are "immortal"** (`determineIfImmortal`): the grid border is randomly reseeded every frame to keep the simulation alive and feed in new patterns.

Color/fade: cells don't just toggle on/off. Each `Cell` has a `colorIndex` into a precomputed `colorsFade` gradient (built from `colors` + `steps` at module load). A cell snaps to `aliveIndex` when alive and decrements its index each frame when dead, producing a trailing fade-out effect.

### Patterns and the editor

- `src/gol/patterns/` holds Conway patterns as `Pattern` (`BinaryCell[][]`) arrays, aggregated in `patterns/index.ts`. Pattern names are a union type `PatterNames` in `src/types.ts` — keep these three in sync (the file, the index export, and the union).
- Clicking the canvas stamps the currently selected pattern via `GOL.addPattern(x, y, name)`. The selected pattern lives in `GOL.patternEditor`.
- `PatternEditor.tsx` previews/transforms a pattern (`rotateMatrix`, `flipMatrixX`, `flipMatrixY` from `utils/matrixModifiers.js`) and writes the result back to `GOL.patternEditor`.
- `utils/convertTextToMatrix.ts` parses plaintext (`O` = alive) into a `Pattern` for authoring new patterns.

### Config and sizing

`src/config.js` holds tunables: `gridSize` (cells per side), `gameInterval` (ms/tick), `baseSize`, and color palette. `utils/calculateCellSize.js` computes pixel cell size from `window.innerWidth`, so the canvas is responsive; `resizeGrid()` recomputes on window resize.

## Conventions

- Mixed JS/TS by design — engine, components, and types are `.ts`/`.tsx`; some utils and `config.js`/`Profile.js` are plain JS (`allowJs` is on). Match the existing extension when editing a file.
- TypeScript is `strict: false` but `strictNullChecks: true`.
- `next.config.js` is fully commented out; the `output: 'export'` / `distDir: './dist'` SPA-export config is dormant. A stale `dist/` exists from a prior build — `.next/` is the active build output.
