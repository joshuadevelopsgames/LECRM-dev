#!/bin/bash

# Monitor Xcode Installation and Auto-Complete Setup
# This script watches for Xcode installation and completes setup automatically

echo "🔍 Monitoring Xcode Installation..."
echo "===================================="
echo ""
echo "📱 The App Store should be open to Xcode."
echo "   Please click 'Get' or 'Install' in the App Store."
echo ""
echo "⏳ Waiting for Xcode to be installed..."
echo "   (This script will automatically complete setup when Xcode is ready)"
echo ""
echo "Press Ctrl+C to stop monitoring"
echo ""

# Check every 10 seconds for Xcode
while true; do
    if [ -d "/Applications/Xcode.app" ]; then
        echo ""
        echo "✅ Xcode detected! Completing setup..."
        echo ""
        
        # Wait a bit for Xcode to be fully ready
        sleep 5
        
        # Set Xcode as active developer directory
        echo "📝 Setting Xcode as active developer directory..."
        sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer 2>/dev/null
        
        # Accept license (may require password)
        echo "📝 Accepting Xcode license..."
        sudo xcodebuild -license accept 2>/dev/null || echo "⚠️  License acceptance may require manual confirmation"
        
        # Install additional components
        echo "📝 Installing additional components..."
        xcodebuild -runFirstLaunch 2>/dev/null || echo "⚠️  Components installing..."
        
        # Verify installation
        echo ""
        echo "🔍 Verifying installation..."
        if xcodebuild -version > /dev/null 2>&1; then
            echo ""
            echo "✅ Xcode is ready!"
            xcodebuild -version
            echo ""
            echo "🎉 Setup complete! Now run:"
            echo "   npm run cap:sync"
            echo "   npm run cap:ios"
            echo ""
            break
        else
            echo "⚠️  Xcode found but not fully ready. Waiting..."
            sleep 10
            continue
        fi
    fi
    
    # Show progress indicator
    echo -n "."
    sleep 10
done

