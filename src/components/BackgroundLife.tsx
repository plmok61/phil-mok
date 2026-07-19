import React, { RefObject, useEffect, useRef } from 'react';
import BGL from '../gol/background-life';
import { spawnDistance, spawnScrollThreshold } from '../config';

interface BackgroundLifeProps {
  heroRef: RefObject<HTMLElement | null>;
}

// Full-viewport Game of Life board fixed behind the page content.
// Once the user scrolls below the hero demo, mouse/touch movement spawns
// spaceships heading in the movement direction (every spawnDistance px),
// and on touch devices scrolling spawns them at the last touch point.
function BackgroundLife({ heroRef }: BackgroundLifeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    BGL.init(canvas);

    let active = false;
    let distance = 0;
    let dirX = 0;
    let dirY = 0;
    let lastMouse: [number, number] | null = null;
    let lastTouch: [number, number] | null = null;
    let lastScrollY = window.scrollY;

    // Octant 0 is east, increasing clockwise (screen y points down):
    // E, SE, S, SW, W, NW, N, NE — matches BGL's headingPatterns.
    const octantFromDirection = () => {
      const angle = Math.atan2(dirY, dirX);
      return (Math.round(angle / (Math.PI / 4)) + 8) % 8;
    };

    const accumulate = (dx: number, dy: number, x: number, y: number) => {
      if (!active) {
        distance = 0;
        return;
      }
      // low-pass the direction so pixel jitter doesn't flip the heading
      dirX = dirX * 0.7 + dx * 0.3;
      dirY = dirY * 0.7 + dy * 0.3;
      distance += Math.hypot(dx, dy);
      if (distance >= spawnDistance) {
        distance = 0;
        BGL.spawnHeading(x, y, octantFromDirection());
      }
    };

    const mouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      if (lastMouse) {
        accumulate(clientX - lastMouse[0], clientY - lastMouse[1], clientX, clientY);
      }
      lastMouse = [clientX, clientY];
    };

    const touchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      lastTouch = [touch.clientX, touch.clientY];
    };

    const touchMove = (event: TouchEvent) => {
      const { clientX, clientY } = event.touches[0];
      if (lastTouch) {
        accumulate(clientX - lastTouch[0], clientY - lastTouch[1], clientX, clientY);
      }
      lastTouch = [clientX, clientY];
    };

    // Spawning is enabled only once the user has scrolled past a fraction
    // of the hero; the simulation itself keeps running so in-flight
    // spaceships don't freeze when the user scrolls back up. (The page is
    // currently short enough that the hero never fully leaves the viewport,
    // so this is a scroll threshold rather than an IntersectionObserver.)
    let activationY = (hero ? hero.offsetHeight : window.innerHeight) * spawnScrollThreshold;
    const updateActive = () => {
      const nowActive = window.scrollY > activationY;
      if (nowActive !== active) {
        active = nowActive;
        distance = 0;
      }
    };
    updateActive();

    // Momentum scrolling on touch devices: spawn at the last touch point,
    // heading straight down/up with the scroll. Desktop wheel scrolling
    // spawns nothing (no touch point recorded).
    const scroll = () => {
      const deltaY = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      updateActive();
      if (!lastTouch || !active) {
        return;
      }
      distance += Math.abs(deltaY);
      if (distance >= spawnDistance) {
        distance = 0;
        BGL.spawnHeading(lastTouch[0], lastTouch[1], deltaY > 0 ? 2 : 6);
      }
    };

    const resize = () => {
      activationY = (hero ? hero.offsetHeight : window.innerHeight) * spawnScrollThreshold;
      updateActive();
      BGL.resize();
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
      BGL.pauseGame();
    };
  }, [heroRef]);

  return <canvas className="backgroundCanvas" ref={canvasRef} aria-hidden="true" />;
}

export default BackgroundLife;
