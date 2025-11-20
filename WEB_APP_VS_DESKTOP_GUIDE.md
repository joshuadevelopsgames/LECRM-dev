# Guide: Adjusting Web App (Mobile/PWA) Without Affecting Desktop

This guide explains all the methods to style and adjust the mobile/PWA experience without changing the desktop view.

## Methods Overview

### 1. **Using the `useDeviceDetection` Hook** (Recommended)

This is the cleanest way to detect what mode your app is in:

```jsx
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

function MyComponent() {
  const { isPWA, isMobile, isDesktop, isNativeApp } = useDeviceDetection();
  
  return (
    <div style={isPWA ? { padding: '20px' } : { padding: '40px' }}>
      {/* Mobile/PWA styles only */}
    </div>
  );
}
```

**Available properties:**
- `isNativeApp` - True in Capacitor iOS/Android app
- `isPWA` - True if installed from website (standalone mode, not native)
- `isStandalone` - True if standalone mode (PWA or native app)
- `isMobile` - True on mobile devices (< 768px width or iOS/Android)
- `isIOS` - True on iOS devices
- `isAndroid` - True on Android devices
- `isDesktop` - True on desktop browsers
- `isWebApp` - True if in browser (including PWA)
- `screenWidth` - Current window width

---

### 2. **Using Capacitor Detection** (For Native App Only)

Only detects if running in Capacitor native app (not PWA):

```jsx
import { Capacitor } from '@capacitor/core';

function MyComponent() {
  const isNativeApp = Capacitor.isNativePlatform();
  
  return (
    <div>
      {isNativeApp ? (
        <div>Native app specific content</div>
      ) : (
        <div>Web/browser content</div>
      )}
    </div>
  );
}
```

**Use when:** You need to differentiate between native app and everything else (web + PWA).

---

### 3. **Using CSS Media Queries** (Responsive Design)

Best for responsive layouts based on screen size:

```css
/* Mobile styles */
.my-component {
  padding: 20px;
}

/* Desktop styles (768px and up) */
@media (min-width: 768px) {
  .my-component {
    padding: 40px;
  }
}
```

**In Tailwind CSS:**

```jsx
<div className="p-5 md:p-10">
  {/* p-5 on mobile, p-10 on desktop */}
</div>
```

**Tailwind Breakpoints:**
- `sm:` - 640px and up
- `md:` - 768px and up (tablets)
- `lg:` - 1024px and up (desktop)
- `xl:` - 1280px and up (large desktop)
- `2xl:` - 1536px and up

**Use when:** You want responsive design based on screen width.

---

### 4. **Using PWA/Standalone Detection**

Detects if app is in standalone mode (PWA or native app):

```jsx
function MyComponent() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                      window.navigator.standalone ||
                      document.referrer.includes('android-app://');
  
  return (
    <div style={isStandalone ? { /* PWA styles */ } : { /* Browser styles */ }}>
      {/* Content */}
    </div>
  );
}
```

**Use when:** You need to style differently for installed PWA vs browser.

---

### 5. **Combining Multiple Methods**

You can combine methods for precise control:

```jsx
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

function MyComponent() {
  const { isPWA, isMobile, isDesktop } = useDeviceDetection();
  
  return (
    <div 
      className="base-styles"
      style={{
        // PWA-specific adjustments
        padding: isPWA ? '20px' : '40px',
        // Mobile-specific adjustments
        fontSize: isMobile ? '14px' : '16px',
        // Desktop-specific adjustments
        maxWidth: isDesktop ? '1200px' : '100%',
      }}
    >
      Content
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: Different Padding for PWA vs Desktop

```jsx
const { isPWA, isDesktop } = useDeviceDetection();

<div style={{ padding: isPWA ? '16px' : isDesktop ? '32px' : '20px' }}>
  {/* Content */}
</div>
```

### Pattern 2: Hide/Show Elements

```jsx
const { isMobile, isDesktop } = useDeviceDetection();

{isMobile && <MobileOnlyComponent />}
{isDesktop && <DesktopOnlyComponent />}
```

### Pattern 3: Conditional CSS Classes

```jsx
const { isPWA } = useDeviceDetection();

<div className={`container ${isPWA ? 'pwa-mode' : 'browser-mode'}`}>
  {/* Content */}
</div>
```

### Pattern 4: Responsive + PWA Combination

```jsx
const { isPWA } = useDeviceDetection();

<div className={`px-4 md:px-8 ${isPWA ? 'pt-safe' : 'pt-6'}`}>
  {/* Combines responsive classes with PWA detection */}
</div>
```

---

## Examples in Your Codebase

### Example 1: Login Page (Current Implementation)

```jsx
// src/pages/Login.jsx
import { Capacitor } from '@capacitor/core';

const isMobile = Capacitor.isNativePlatform();
const safeAreaTop = isMobile ? 'env(safe-area-inset-top, 0px)' : '0px';

<div style={{
  padding: isMobile ? '20px' : '24px',
  fontSize: isMobile ? '16px' : '14px',
}}>
```

**Better approach with hook:**

```jsx
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

const { isPWA, isMobile } = useDeviceDetection();
const safeAreaTop = (isPWA || isMobile) ? 'env(safe-area-inset-top, 0px)' : '0px';
```

### Example 2: Layout Component (Current Implementation)

```jsx
// src/components/Layout.jsx
const isNativeApp = Capacitor.isNativePlatform();

<nav style={isNativeApp ? {
  paddingTop: 'max(0px, calc(env(safe-area-inset-top, 0px) - 0.5rem))',
} : {}}>
```

**Can be improved to:**

```jsx
const { isPWA, isNativeApp } = useDeviceDetection();

<nav style={(isPWA || isNativeApp) ? {
  paddingTop: 'max(0px, calc(env(safe-area-inset-top, 0px) - 0.5rem))',
} : {}}>
```

---

## Quick Reference

| Method | When to Use | Example |
|--------|-------------|---------|
| `useDeviceDetection()` hook | Best for most cases | `const { isPWA } = useDeviceDetection();` |
| `Capacitor.isNativePlatform()` | Only native app detection | `if (Capacitor.isNativePlatform()) {}` |
| CSS Media Queries | Responsive layout | `@media (min-width: 768px) {}` |
| Tailwind responsive | Quick responsive classes | `className="p-4 md:p-8"` |
| `window.matchMedia('(display-mode: standalone)')` | PWA detection | `if (isStandalone) {}` |

---

## Best Practices

1. **Use the hook for JavaScript logic** - `useDeviceDetection()` is the most reliable
2. **Use Tailwind responsive classes for layout** - Faster and cleaner
3. **Combine methods when needed** - Responsive + PWA detection for best results
4. **Test in all modes** - Desktop browser, PWA, and native app
5. **Mobile-first approach** - Design for mobile, enhance for desktop

---

## Testing

1. **Desktop:** Open in Chrome/Firefox on desktop
2. **PWA:** Install from website, then open installed app
3. **Native App:** Build and run in Xcode/Android Studio
4. **Responsive:** Use browser dev tools to test different screen sizes

