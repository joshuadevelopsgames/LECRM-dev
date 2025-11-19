#!/bin/bash

# Finish iOS Setup - Run this after accepting Xcode license

echo "🚀 Completing iOS Setup..."
echo "========================="
echo ""

# Check if license is accepted
if ! git --version > /dev/null 2>&1; then
    echo "❌ Xcode license not accepted yet."
    echo ""
    echo "Please accept the license first:"
    echo "   sudo xcodebuild -license accept"
    echo ""
    echo "Or open Xcode and accept when prompted."
    exit 1
fi

echo "✅ Xcode license accepted!"
echo ""

# Set UTF-8 for CocoaPods
export LANG=en_US.UTF-8

# Complete Capacitor sync
echo "📝 Syncing Capacitor iOS project..."
cd "$(dirname "$0")"

if npm run cap:sync; then
    echo ""
    echo "✅ iOS setup complete!"
    echo ""
    echo "🎉 Your iOS app is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Open in Xcode: npm run cap:ios"
    echo "2. Select a simulator (iPhone 15, etc.)"
    echo "3. Click Run (▶️) to build and test"
    echo ""
else
    echo ""
    echo "⚠️  Sync completed with some warnings, but should be OK"
    echo "Try: npm run cap:ios"
fi

