import { useState, useEffect } from 'react';

/**
 * Hook to detect device type based on viewport width
 * - mobile: width < 768px
 * - tablet: 768px <= width < 1024px
 * - desktop: width >= 1024px
 * @returns {string} 'mobile' | 'tablet' | 'desktop'
 */
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Detect on mount
    detectDevice();

    // Attach resize listener
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  return deviceType;
}

export default useDeviceType;
