import React, { createContext, useState, useCallback } from 'react';

export const OverlayContext = createContext();

export function useOverlay() {
  const context = React.useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within OverlayProvider');
  }
  return context;
}

export function OverlayProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [overlayType, setOverlayType] = useState(null);

  const openOverlay = useCallback((type) => {
    setOverlayType(type);
    setIsOpen(true);
    // Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeOverlay = useCallback(() => {
    setIsOpen(false);
    setOverlayType(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  }, []);

  const value = {
    isOpen,
    overlayType,
    openOverlay,
    closeOverlay,
  };

  return (
    <OverlayContext.Provider value={value}>
      {children}
    </OverlayContext.Provider>
  );
}
