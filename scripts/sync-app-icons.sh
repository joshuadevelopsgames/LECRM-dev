#!/bin/bash

# Script to sync iOS app icons to web PWA
# This ensures the PWA "Add to Home Screen" uses the same icon as the iOS app

echo "📱 Syncing iOS app icons to web PWA..."

# Source directories
IOS_ICONS_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"
PUBLIC_DIR="public"

# Check if iOS icons exist
if [ ! -f "$IOS_ICONS_DIR/AppIcon-1024.png" ]; then
  echo "❌ Error: iOS app icon not found at $IOS_ICONS_DIR/AppIcon-1024.png"
  exit 1
fi

# Copy main app icons
echo "📋 Copying iOS app icons..."
cp "$IOS_ICONS_DIR/AppIcon-1024.png" "$PUBLIC_DIR/app-icon-1024.png"
cp "$IOS_ICONS_DIR/AppIcon-1024.png" "$PUBLIC_DIR/app-icon-512.png"

# Generate required sizes using sips (macOS only)
if command -v sips > /dev/null; then
  echo "🔧 Generating icon sizes..."
  # Generate 192x192 for Android PWA
  sips -z 192 192 "$PUBLIC_DIR/app-icon-1024.png" --out "$PUBLIC_DIR/app-icon-192.png" > /dev/null 2>&1
  
  # Generate 180x180 for Apple Touch Icon
  if [ -f "$IOS_ICONS_DIR/AppIcon-60@3x.png" ]; then
    cp "$IOS_ICONS_DIR/AppIcon-60@3x.png" "$PUBLIC_DIR/apple-touch-icon.png"
  else
    sips -z 180 180 "$PUBLIC_DIR/app-icon-1024.png" --out "$PUBLIC_DIR/apple-touch-icon.png" > /dev/null 2>&1
  fi
  
  echo "✅ Icons generated successfully!"
else
  echo "⚠️  Warning: sips not available (not on macOS), using original icons"
  # Fallback: use 1024x1024 for all if sips not available
  if [ -f "$IOS_ICONS_DIR/AppIcon-60@3x.png" ]; then
    cp "$IOS_ICONS_DIR/AppIcon-60@3x.png" "$PUBLIC_DIR/apple-touch-icon.png"
  fi
fi

echo "✅ App icons synced successfully!"
echo ""
echo "📱 Icons available:"
ls -lh "$PUBLIC_DIR"/app-icon*.png "$PUBLIC_DIR"/apple-touch-icon.png 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'

