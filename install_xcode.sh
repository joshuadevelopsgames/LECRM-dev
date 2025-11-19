#!/bin/bash

# Xcode Installation Helper Script
# This script helps automate Xcode installation steps

echo "🚀 Xcode Installation Helper"
echo "=============================="
echo ""

# Check if Xcode is already installed
if [ -d "/Applications/Xcode.app" ]; then
    echo "✅ Xcode is already installed!"
    xcodebuild -version 2>/dev/null || echo "⚠️  But xcodebuild is not working properly"
    exit 0
fi

echo "📦 Step 1: Opening Mac App Store to Xcode page..."
open "macappstore://apps.apple.com/app/id497799835"

echo ""
echo "⏳ Please follow these steps in the App Store:"
echo "   1. Click 'Get' or 'Install' button"
echo "   2. Enter your Apple ID password if prompted"
echo "   3. Wait for download (~15GB, 30-60 minutes)"
echo ""
echo "📝 Step 2: After Xcode finishes installing..."
echo "   This script will help you complete the setup."
echo ""
read -p "Press Enter when Xcode installation is complete, or 'q' to quit: " response

if [ "$response" = "q" ]; then
    echo "Exiting. You can run this script again later."
    exit 0
fi

# Check if Xcode is now installed
if [ ! -d "/Applications/Xcode.app" ]; then
    echo "❌ Xcode not found. Please make sure installation completed."
    exit 1
fi

echo ""
echo "✅ Xcode found! Completing setup..."
echo ""

# Set Xcode as active developer directory
echo "📝 Setting Xcode as active developer directory..."
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Accept license
echo "📝 Accepting Xcode license agreement..."
sudo xcodebuild -license accept 2>/dev/null || echo "⚠️  License may need manual acceptance"

# Install additional components
echo "📝 Installing additional components..."
xcodebuild -runFirstLaunch 2>/dev/null || echo "⚠️  Components may install automatically"

echo ""
echo "✅ Setup complete! Verifying installation..."
xcodebuild -version

echo ""
echo "🎉 Next steps:"
echo "   1. Run: npm run cap:sync"
echo "   2. Run: npm run cap:ios"
echo "   3. Open Xcode and start building!"

