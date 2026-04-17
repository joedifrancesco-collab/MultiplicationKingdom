import React, { useContext, lazy, Suspense } from 'react';
import { OverlayContext } from '../../context/OverlayContext.jsx';
import './OverlayWrapper.css';

const TrainingTable = lazy(() => import('../../subjects/math-kingdom/multiplication-kingdom/components/TrainingTable'));

export default function OverlayWrapper() {
  const { isOpen, overlayType, closeOverlay } = useContext(OverlayContext);

  if (!isOpen) return null;

  return (
    <div className="overlay-wrapper">
      {/* Blurred background */}
      <div className="overlay-backdrop" onClick={closeOverlay} />
      
      {/* Overlay content */}
      <div className="overlay-container">
        {/* Close button */}
        <button className="overlay-close-btn" onClick={closeOverlay} aria-label="Close overlay">
          ✕
        </button>

        {/* Content based on overlay type */}
        <div className="overlay-content">
          {overlayType === 'times-table' && (
            <Suspense fallback={<div>Loading...</div>}>
              <TrainingTable isOverlay={true} onClose={closeOverlay} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
