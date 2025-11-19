# Mobile App Setup Guide

This guide explains how to build and deploy the LECRM mobile app using Capacitor.

## Overview

The mobile app is built using **Capacitor**, which wraps your existing React web app in a native container. This means:
- ✅ **Desktop website remains unchanged** - All changes are mobile-specific
- ✅ **Reuse 100% of your existing code** - No rewrite needed
- ✅ **Native app experience** - Can be published to App Store and Play Store
- ✅ **Access to native features** - Camera, contacts, push notifications, etc.

## Prerequisites

### For iOS Development:
- macOS computer
- Xcode (latest version from App Store)
- Apple Developer account ($99/year for App Store publishing)

### For Android Development:
- Android Studio (latest version)
- Java Development Kit (JDK) 11 or later
- Android SDK

## Quick Start

### 1. Build the Web App

First, build your React app:

```bash
npm run build
```

This creates the `dist/` folder that Capacitor will use.

### 2. Sync to Native Projects

Sync your web code to the native iOS and Android projects:

```bash
npm run cap:sync
```

This command:
- Builds your web app (`npm run build`)
- Copies the `dist/` folder to native projects
- Updates native dependencies

### 3. Open in Native IDE

**For iOS:**
```bash
npm run cap:ios
```
This opens Xcode where you can:
- Run the app in iOS Simulator
- Build for a physical device
- Archive for App Store submission

**For Android:**
```bash
npm run cap:android
```
This opens Android Studio where you can:
- Run the app in Android Emulator
- Build APK or AAB for Play Store
- Test on physical devices

## Development Workflow

### Making Changes

1. **Edit your React code** (in `src/`)
2. **Test in browser** (`npm run dev`)
3. **Build** (`npm run build`)
4. **Sync to native** (`npm run cap:sync`)
5. **Test in native app** (Xcode/Android Studio)

### Quick Sync Command

For convenience, use:
```bash
npm run cap:build
```

This builds and syncs in one command.

## Mobile-Specific Features

### Status Bar
The app automatically configures the status bar (top bar on mobile) with:
- Dark text on light background
- White background color

### Keyboard
The keyboard plugin handles:
- Automatic resizing when keyboard appears
- Dark keyboard style
- Accessory bar for better input experience

### Safe Areas
The app respects safe areas (notches, home indicators) on modern devices using CSS environment variables.

## Building for Production

### iOS App Store

1. **Open Xcode:**
   ```bash
   npm run cap:ios
   ```

2. **Configure signing:**
   - Select your development team in Xcode
   - Set bundle identifier (currently `com.lecrm.app`)

3. **Archive:**
   - Product → Archive
   - Upload to App Store Connect

4. **Submit for review** via App Store Connect

### Android Play Store

1. **Open Android Studio:**
   ```bash
   npm run cap:android
   ```

2. **Build release APK/AAB:**
   - Build → Generate Signed Bundle / APK
   - Choose "Android App Bundle" (recommended)
   - Follow signing wizard

3. **Upload to Play Console:**
   - Create app listing
   - Upload AAB file
   - Submit for review

## Configuration

### App ID and Name

Edit `capacitor.config.json` to change:
- `appId`: Your bundle identifier (e.g., `com.yourcompany.lecrm`)
- `appName`: Display name shown on device

### Icons and Splash Screens

**iOS:**
- Icons: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Splash: `ios/App/App/Assets.xcassets/Splash.imageset/`

**Android:**
- Icons: `android/app/src/main/res/mipmap-*/`
- Splash: `android/app/src/main/res/drawable-*/splash.png`

Use tools like [Capacitor Assets](https://github.com/ionic-team/capacitor-assets) to generate all sizes automatically.

## Troubleshooting

### "dist directory not found"
Run `npm run build` first to create the dist folder.

### Changes not appearing in app
1. Rebuild: `npm run build`
2. Resync: `npm run cap:sync`
3. Rebuild in Xcode/Android Studio

### iOS build errors
- Clean build folder: Product → Clean Build Folder (Cmd+Shift+K)
- Delete derived data
- Reinstall pods: `cd ios/App && pod install`

### Android build errors
- Clean project: Build → Clean Project
- Invalidate caches: File → Invalidate Caches / Restart
- Sync Gradle files

### App looks different on mobile
- Check responsive CSS in `src/index.css`
- Mobile styles only apply on screens < 768px
- Desktop remains unchanged

## Testing

### iOS Simulator
- Run from Xcode (Cmd+R)
- Choose simulator from device menu
- Test on different iPhone/iPad sizes

### Android Emulator
- Create virtual device in Android Studio
- Run from Android Studio
- Test on different screen sizes

### Physical Devices

**iOS:**
- Connect iPhone/iPad via USB
- Select device in Xcode
- Run (may need to trust developer certificate on device)

**Android:**
- Enable USB debugging on device
- Connect via USB
- Run from Android Studio

## Native Plugins

Current plugins installed:
- `@capacitor/app` - App lifecycle events
- `@capacitor/keyboard` - Keyboard handling
- `@capacitor/status-bar` - Status bar customization

### Adding More Plugins

```bash
npm install @capacitor/[plugin-name]
npx cap sync
```

Popular plugins:
- `@capacitor/camera` - Camera access
- `@capacitor/geolocation` - GPS location
- `@capacitor/push-notifications` - Push notifications
- `@capacitor/share` - Native share dialog
- `@capacitor/filesystem` - File system access

## Important Notes

⚠️ **Desktop website is unchanged** - All mobile optimizations are:
- CSS media queries (only apply on mobile)
- Capacitor initialization (only runs in native app)
- Mobile-specific meta tags (don't affect desktop)

✅ **Your existing workflow stays the same:**
- `npm run dev` - Still works for web development
- `npm run build` - Still builds for web deployment
- All your React code works exactly the same

## Next Steps

1. **Customize app icons** - Replace default icons with your branding
2. **Configure app metadata** - Update app name, description in native projects
3. **Test on devices** - Ensure everything works on real hardware
4. **Set up app store accounts** - Prepare for publishing
5. **Add native features** - Consider adding camera, push notifications, etc.

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Development Guide](https://capacitorjs.com/docs/ios)
- [Android Development Guide](https://capacitorjs.com/docs/android)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

## Support

If you encounter issues:
1. Check Capacitor documentation
2. Review native project logs (Xcode console / Android logcat)
3. Ensure all dependencies are installed (`npm install`)
4. Try cleaning and rebuilding

