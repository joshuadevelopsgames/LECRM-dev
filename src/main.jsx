import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize Capacitor (only when running in native app, not web)
import { Capacitor } from '@capacitor/core';
if (Capacitor.isNativePlatform()) {
  import('@capacitor/status-bar').then(({ StatusBar }) => {
    StatusBar.setStyle({ style: 'dark' });
    StatusBar.setBackgroundColor({ color: '#ffffff' });
  });
  
  import('@capacitor/keyboard').then(({ Keyboard }) => {
    Keyboard.setAccessoryBarVisible({ isVisible: true });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


