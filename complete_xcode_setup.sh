#!/bin/bash

# Complete Xcode Setup Script
# Run this after Xcode finishes installing from the App Store

echo "🚀 Completing Xcode Setup for LECRM"
echo "===================================="
echo ""

# Check if Xcode is installed
if [ ! -d "/Applications/Xcode.app" ]; then
    echo "❌ Xcode not found!"
    echo ""
    echo "Please:"
    echo "1. Open Mac App Store"
    echo "2. Search for 'Xcode'"
    echo "3. Click 'Get' or 'Install'"
    echo "4. Wait for installation to complete (~15GB, 30-60 minutes)"
    echo "5. Run this script again"
    exit 1
fi

echo "✅ Xcode found!"
echo ""

# Set Xcode as active developer directory
echo "📝 Step 1: Setting Xcode as active developer directory..."
if sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer; then
    echo "   ✅ Done"
else
    echo "   ⚠️  Failed - you may need to enter your password"
    exit 1
fi

# Accept license
echo ""
echo "📝 Step 2: Accepting Xcode license agreement..."
if sudo xcodebuild -license accept 2>/dev/null; then
    echo "   ✅ License accepted"
else
    echo "   ⚠️  License may need manual acceptance - opening Xcode..."
    open -a Xcode
    echo "   Please accept the license in Xcode, then press Enter..."
    read
fi

# Install additional components
echo ""
echo "📝 Step 3: Installing additional components..."
xcodebuild -runFirstLaunch 2>/dev/null
echo "   ✅ Components installing (this may take a few minutes)"

# Verify installation
echo ""
echo "🔍 Step 4: Verifying installation..."
if xcodebuild -version > /dev/null 2>&1; then
    echo "   ✅ Xcode is working!"
    xcodebuild -version
else
    echo "   ⚠️  Xcode found but xcodebuild not working"
    echo "   Try: sudo xcode-select --reset"
    exit 1
fi

# Complete Capacitor setup
echo ""
echo "📝 Step 5: Completing Capacitor iOS setup..."
cd "$(dirname "$0")"

# Set UTF-8 encoding for CocoaPods
export LANG=en_US.UTF-8

# Sync Capacitor
if npm run cap:sync; then
    echo "   ✅ Capacitor sync complete!"
else
    echo "   ⚠️  Sync had issues, but continuing..."
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Open iOS project: npm run cap:ios"
echo "2. In Xcode, select a simulator"
echo "3. Click Run (▶️) to build and test"
echo ""
echo "Your iOS app is ready to build! 🚀"

