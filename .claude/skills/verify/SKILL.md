---
name: verify
description: Build, launch, and drive phil-mok to verify changes at the browser surface.
---

# Verifying phil-mok

- `npm run dev` (background). Port 3000 is often taken by another local app —
  Next falls back to **3001**; read the dev-server output for the actual port.
- Surface is a browser page (fully client-rendered, canvas-heavy). Drive it
  with Playwright: `npm install playwright` in the scratchpad, plus
  `npx playwright install chromium` if the browser cache is empty.
- The hero Game of Life and the background board are `<canvas>` — assert via
  pixels, not DOM. Useful pattern: `ctx.getImageData` in `page.evaluate`,
  count alpha > 0 pixels and compute their centroid; sample twice ~1s apart
  to measure spaceship drift direction.
- Background-board spawning only activates after scrolling past
  `spawnScrollThreshold` × hero height (see `src/config.js`); the page is
  short, so `window.scrollTo(0, document.body.scrollHeight)` is enough.
- Touch handlers accept synthetic `TouchEvent`s dispatched on `window` from
  `page.evaluate` (construct `Touch` objects with `clientX/clientY`).
- Reduced-motion path: `browser.newContext({ reducedMotion: 'reduce' })`.
