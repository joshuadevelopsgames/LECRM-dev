# Xcode Installation Guide

## ✅ What's Already Done

- ✅ **CocoaPods installed** (v1.16.2) via Homebrew
- ✅ **iOS dependencies installed** - All Capacitor pods are ready
- ✅ **Android setup complete** - Ready to build Android apps
- ✅ **Web assets synced** - Your app code is ready

## ⚠️ What's Needed: Full Xcode App

You currently have **Xcode Command Line Tools** installed, but you need the **full Xcode application** to build iOS apps.

## How to Install Xcode

### Step 1: Install from Mac App Store

1. **Open Mac App Store** on your Mac
2. **Search for "Xcode"**
3. **Click "Get" or "Install"** (it's free, but large ~15GB)
4. **Wait for download** - This can take 30-60 minutes depending on your internet speed
5. **Launch Xcode** after installation

### Step 2: Accept License Agreement

After launching Xcode for the first time:

1. Xcode will prompt you to accept the license agreement
2. Click "Agree"
3. Wait for additional components to install

### Step 3: Install Additional Components

Xcode may need to install additional components:

1. Go to **Xcode → Settings → Platforms** (or Components)
2. Install any required iOS simulators or SDKs
3. This may take a few more minutes

### Step 4: Set Xcode as Active Developer Directory

After Xcode is installed, run:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

You'll be prompted for your password.

### Step 5: Verify Installation

Check that Xcode is properly installed:

```bash
xcodebuild -version
```

You should see something like:
```
Xcode 15.0
Build version 15A240d
```

### Step 6: Complete iOS Setup

Once Xcode is installed, run:

```bash
cd /Users/joshua/LECRM
npm run cap:sync
```

This will complete the iOS setup.

### Step 7: Open in Xcode

```bash
npm run cap:ios
```

This opens your project in Xcode where you can:
- Run in iOS Simulator
- Build for physical devices
- Archive for App Store submission

## Alternative: Install Xcode via Command Line (Advanced)

If you prefer command line installation:

```bash
# Install Xcode via mas (Mac App Store CLI)
brew install mas
mas install 497799835  # Xcode App Store ID

# Then set as active developer directory
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

**Note:** This still requires App Store authentication and the full download.

## Current Status

### ✅ Ready to Use:
- **Android App** - Can build immediately
- **Desktop Website** - Unchanged and working
- **CocoaPods** - Installed and configured

### ⏳ Waiting For:
- **Xcode App** - Need to install from App Store

## Testing Without Xcode

You can still:
- ✅ Develop and test the web app (`npm run dev`)
- ✅ Build Android apps (`npm run cap:android`)
- ✅ Test responsive design in browser dev tools
- ✅ All desktop functionality works normally

## Once Xcode is Installed

After installing Xcode, you'll be able to:

1. **Build iOS app:**
   ```bash
   npm run cap:build
   npm run cap:ios
   ```

2. **Run in iOS Simulator:**
   - Select a simulator in Xcode
   - Click Run (▶️)

3. **Test on physical device:**
   - Connect iPhone/iPad via USB
   - Select device in Xcode
   - May need to configure signing/certificates

4. **Submit to App Store:**
   - Archive the app in Xcode
   - Upload to App Store Connect

## Troubleshooting

### "xcode-select: error: tool 'xcodebuild' requires Xcode"
- **Solution:** Install full Xcode app from App Store (not just command line tools)

### "CocoaPods not found"
- **Solution:** Already installed! Use `pod --version` to verify

### "Pod install failed"
- **Solution:** Make sure you're in the `ios/App` directory and have UTF-8 encoding set:
  ```bash
  export LANG=en_US.UTF-8
  cd ios/App
  pod install
  ```

### "No simulators available"
- **Solution:** In Xcode, go to Settings → Platforms and install iOS simulators

## Next Steps

1. **Install Xcode** from Mac App Store (when ready)
2. **Run `npm run cap:sync`** to complete iOS setup
3. **Open in Xcode** with `npm run cap:ios`
4. **Start building!** 🚀

## Questions?

- Xcode installation: https://developer.apple.com/xcode/
- Capacitor iOS guide: https://capacitorjs.com/docs/ios
- Your Android app is ready to go right now!

