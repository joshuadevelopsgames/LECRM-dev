#!/bin/bash

# Accept Xcode License Agreement
echo "📝 Accepting Xcode License Agreement..."
echo ""
echo "This will ask for your password (required for license acceptance)"
echo ""

sudo xcodebuild -license accept

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ License accepted!"
    echo ""
    echo "Now completing Capacitor setup..."
    cd "$(dirname "$0")"
    export LANG=en_US.UTF-8
    npm run cap:sync
    echo ""
    echo "🎉 Setup complete! Run 'npm run cap:ios' to open in Xcode"
else
    echo ""
    echo "❌ License acceptance failed. Please run manually:"
    echo "   sudo xcodebuild -license accept"
fi

