'use client';

import { useEffect, useReducer, useRef } from 'react';
import { ReaderEngine } from '../_lib/ReaderEngine';

export function useReaderEngine(): ReaderEngine {
  const engineRef = useRef<ReaderEngine | null>(null);
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  if (!engineRef.current) {
    engineRef.current = new ReaderEngine();
  }

  useEffect(() => {
    const engine = engineRef.current!;
    const unsubscribe = engine.subscribe(forceRender);
    return () => {
      unsubscribe();
      engine.destroy();
    };
  }, []);

  return engineRef.current;
}
