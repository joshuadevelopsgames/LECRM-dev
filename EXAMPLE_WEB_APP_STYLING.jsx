/**
 * EXAMPLE: How to adjust web app (mobile/PWA) without affecting desktop
 * 
 * This file shows practical examples of different methods you can use
 */

import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { Capacitor } from '@capacitor/core';

// ============================================
// METHOD 1: Using the useDeviceDetection Hook (RECOMMENDED)
// ============================================

function ExampleComponentWithHook() {
  const { isPWA, isMobile, isDesktop, isNativeApp, isStandalone } = useDeviceDetection();
  
  return (
    <div 
      className="base-styles"
      style={{
        // Adjust padding: smaller for PWA, normal for desktop
        padding: isPWA ? '16px' : isDesktop ? '32px' : '20px',
        
        // Adjust font size: larger on mobile for better touch experience
        fontSize: isMobile ? '16px' : '14px',
        
        // Add safe area padding for PWA and native app
        paddingTop: (isPWA || isNativeApp) ? 'calc(20px + env(safe-area-inset-top, 0px))' : '20px',
        paddingBottom: (isPWA || isNativeApp) ? 'calc(20px + env(safe-area-inset-bottom, 0px))' : '20px',
        
        // Adjust max width: full width on mobile, centered on desktop
        maxWidth: isDesktop ? '1200px' : '100%',
        margin: isDesktop ? '0 auto' : '0',
      }}
    >
      <h1 style={{ fontSize: isMobile ? '28px' : '36px' }}>
        Title
      </h1>
      
      {/* Show different content based on device */}
      {isPWA && <div>PWA Mode Active</div>}
      {isDesktop && <div>Desktop Mode</div>}
    </div>
  );
}

// ============================================
// METHOD 2: Using Capacitor Detection (Native App Only)
// ============================================

function ExampleWithCapacitor() {
  const isNativeApp = Capacitor.isNativePlatform();
  
  return (
    <div style={{
      // Only apply these styles in native app
      paddingTop: isNativeApp ? 'env(safe-area-inset-top, 0px)' : '0',
    }}>
      {isNativeApp ? 'Native App' : 'Web Browser'}
    </div>
  );
}

// ============================================
// METHOD 3: Using Tailwind Responsive Classes
// ============================================

function ExampleWithTailwind() {
  return (
    <div className="
      p-4           /* padding: 1rem on mobile */
      md:p-8        /* padding: 2rem on tablet+ */
      lg:p-12       /* padding: 3rem on desktop+ */
      text-sm       /* font-size: 0.875rem on mobile */
      md:text-base  /* font-size: 1rem on tablet+ */
      lg:text-lg    /* font-size: 1.125rem on desktop+ */
    ">
      Responsive Content
    </div>
  );
}

// ============================================
// METHOD 4: Combining Hook + Tailwind (BEST APPROACH)
// ============================================

function ExampleCombined() {
  const { isPWA, isMobile } = useDeviceDetection();
  
  return (
    <div 
      className="
        p-4 md:p-8 lg:p-12      /* Responsive padding */
        text-sm md:text-base     /* Responsive text */
        max-w-full lg:max-w-6xl  /* Responsive max-width */
        mx-auto                  /* Center on desktop */
      "
      style={{
        // Add PWA-specific adjustments
        paddingTop: isPWA ? 'calc(1rem + env(safe-area-inset-top, 0px))' : undefined,
        paddingBottom: isPWA ? 'calc(1rem + env(safe-area-inset-bottom, 0px))' : undefined,
        
        // Larger touch targets on mobile
        minHeight: isMobile ? '48px' : undefined,
      }}
    >
      <button 
        className="
          px-4 py-2           /* Base padding */
          md:px-6 md:py-3     /* Larger on desktop */
          text-base md:text-lg
        "
        style={{
          // Ensure minimum touch target size on mobile/PWA
          minHeight: (isPWA || isMobile) ? '48px' : undefined,
          minWidth: (isPWA || isMobile) ? '120px' : undefined,
        }}
      >
        Click Me
      </button>
    </div>
  );
}

// ============================================
// METHOD 5: Conditional Rendering
// ============================================

function ExampleConditional() {
  const { isPWA, isDesktop, isMobile } = useDeviceDetection();
  
  return (
    <div>
      {/* Show mobile menu on PWA/mobile */}
      {(isPWA || isMobile) && (
        <div className="mobile-menu">
          Mobile Navigation
        </div>
      )}
      
      {/* Show desktop menu on desktop */}
      {isDesktop && (
        <div className="desktop-menu">
          Desktop Navigation
        </div>
      )}
      
      {/* Show install prompt only in browser (not PWA) */}
      {!isPWA && <InstallPrompt />}
    </div>
  );
}

// ============================================
// METHOD 6: Real-World Example - Login Page
// ============================================

function LoginPageExample() {
  const { isPWA, isMobile, isDesktop } = useDeviceDetection();
  
  return (
    <div 
      className="min-h-screen bg-slate-50 flex items-center justify-center"
      style={{
        padding: isPWA ? '20px' : '40px',
        paddingTop: (isPWA || isMobile) ? `calc(${isPWA ? '20px' : '40px'} + env(safe-area-inset-top, 0px))` : '40px',
      }}
    >
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow"
        style={{
          padding: isPWA ? '20px' : isDesktop ? '32px' : '24px',
        }}
      >
        <input
          type="email"
          className="w-full border rounded"
          style={{
            padding: (isPWA || isMobile) ? '12px 14px' : '8px 12px',
            fontSize: (isPWA || isMobile) ? '16px' : '14px', // Prevent iOS zoom
          }}
        />
        
        <button
          className="w-full bg-blue-600 text-white rounded"
          style={{
            padding: (isPWA || isMobile) ? '14px 16px' : '10px 16px',
            minHeight: (isPWA || isMobile) ? '48px' : undefined,
            fontSize: (isPWA || isMobile) ? '16px' : '14px',
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export {
  ExampleComponentWithHook,
  ExampleWithCapacitor,
  ExampleWithTailwind,
  ExampleCombined,
  ExampleConditional,
  LoginPageExample,
};

