'use client';

import { useEffect } from 'react';
import type { ReaderEngine } from '../_lib/ReaderEngine';

export function useKeyboardControls(engine: ReaderEngine): void {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent): void {
      const target = event.target;
      if (target instanceof HTMLElement && target.tagName === 'TEXTAREA') return;

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          engine.toggle();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          engine.prevWord();
          break;
        case 'ArrowRight':
          event.preventDefault();
          engine.nextWord();
          break;
        case 'ArrowUp':
          event.preventDefault();
          engine.setWpm(engine.wpm + 25);
          break;
        case 'ArrowDown':
          event.preventDefault();
          engine.setWpm(engine.wpm - 25);
          break;
      }
    }

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [engine]);
}
