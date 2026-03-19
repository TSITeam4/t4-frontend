'use client';

import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type CursorState = 'default' | 'hover' | 'view' | 'text';

interface CursorContextValue {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
}

export const CursorContext = createContext<CursorContextValue | null>(null);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>('default');

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
    if (target) {
      const state = target.dataset.cursor as CursorState;
      if (state === 'hover' || state === 'view' || state === 'text') {
        setCursorState(state);
      }
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
    if (target) {
      setCursorState('default');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseOver, handleMouseOut]);

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState }}>
      {children}
    </CursorContext.Provider>
  );
}
