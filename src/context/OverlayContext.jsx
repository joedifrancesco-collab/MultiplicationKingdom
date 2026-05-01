import { createContext, useContext } from 'react';

export const OverlayContext = createContext();

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within OverlayProvider');
  }
  return context;
}
