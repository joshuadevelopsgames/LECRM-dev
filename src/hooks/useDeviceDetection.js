import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Custom hook to detect device type and display mode
 * Use this to conditionally apply styles/features for mobile/PWA without affecting desktop
 */
export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState({
    isNativeApp: false,        // True if running in Capacitor native app (iOS/Android)
    isPWA: false,              // True if running as PWA (installed from website)
    isStandalone: false,       // True if in standalone mode (PWA or native app)
    isMobile: false,           // True if mobile device (phone/tablet)
    isIOS: false,              // True if iOS device
    isAndroid: false,          // True if Android device
    isDesktop: false,          // True if desktop browser
    isWebApp: false,           // True if web app (PWA) but not native app
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectDevice = () => {
      // Check if native app (Capacitor)
      const isNativeApp = Capacitor.isNativePlatform();
      
      // Check if PWA/standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://');
      
      // Check if PWA (standalone but not native)
      const isPWA = isStandalone && !isNativeApp;
      
      // Check device type
      const userAgent = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      const isAndroid = /Android/.test(userAgent);
      
      // Check if mobile device
      const isMobile = isIOS || isAndroid || window.innerWidth < 768;
      
      // Check if desktop
      const isDesktop = !isMobile && !isNativeApp;
      
      // Check if web app (browser, including PWA)
      const isWebApp = !isNativeApp;

      setDeviceInfo({
        isNativeApp,
        isPWA,
        isStandalone,
        isMobile,
        isIOS,
        isAndroid,
        isDesktop,
        isWebApp,
        screenWidth: window.innerWidth,
      });
    };

    detectDevice();

    // Listen for resize events
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceInfo;
}

