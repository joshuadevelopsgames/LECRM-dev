# Update App Icon to Match Website Logo

## Current Setup

- **Website Logo**: `public/logo.png` (192x192 PNG)
- **iOS Icons**: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- **Android Icons**: `android/app/src/main/res/mipmap-*/`

## Quick Method: Use Capacitor Assets Tool

The easiest way is to use Capacitor's asset generator:

```bash
# Install capacitor-assets if not already installed
npm install -g @capacitor/assets

# Generate all app icons from your logo
npx @capacitor/assets generate --iconPath public/logo.png --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#000000'
```

This will automatically:
- Generate all iOS icon sizes
- Generate all Android icon sizes
- Update splash screens
- Place them in the correct locations

## Manual Method

### iOS Icons Required Sizes

iOS needs these sizes (in pixels):
- 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5
- At 1x, 2x, and 3x resolutions
- Total: 18 different sizes

### Android Icons Required Sizes

Android needs these sizes:
- mdpi: 48x48
- hdpi: 72x72
- xhdpi: 96x96
- xxhdpi: 144x144
- xxxhdpi: 192x192

## Steps to Update

### Option 1: Use Online Tool (Easiest)

1. Go to https://www.appicon.co/ or https://appicon.build/
2. Upload your `public/logo.png`
3. Download the generated icons
4. Extract and copy to:
   - iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Android: `android/app/src/main/res/mipmap-*/`

### Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Create iOS icons
cd ios/App/App/Assets.xcassets/AppIcon.appiconset/
# Generate all sizes from logo.png
# (You'll need to resize public/logo.png to each required size)

# Create Android icons  
cd android/app/src/main/res/
# Generate all sizes for each mipmap folder
```

### Option 3: Manual in Design Tool

1. Open your logo in a design tool (Figma, Photoshop, etc.)
2. Export at all required sizes
3. Replace the existing icon files

## After Updating Icons

1. **Rebuild the app:**
   ```bash
   npm run build
   npm run cap:sync
   ```

2. **In Xcode:**
   - Clean build folder (Cmd+Shift+K)
   - Rebuild (Cmd+R)

3. **The new icon will appear:**
   - On your iPhone home screen
   - In the app switcher
   - In Settings

## Notes

- **iOS**: Icons should be square, no transparency (use solid background)
- **Android**: Can have transparency, but solid background recommended
- **Splash Screen**: Will also use your logo automatically
- **First Build**: May take a few minutes to process new icons

## Quick Check

After updating, verify:
- ✅ iOS: Check `ios/App/App/Assets.xcassets/AppIcon.appiconset/` has new files
- ✅ Android: Check `android/app/src/main/res/mipmap-*/` has new files
- ✅ Rebuild and sync
- ✅ New icon appears on device

Your logo at `public/logo.png` is 192x192, which is perfect for generating all the required sizes!

