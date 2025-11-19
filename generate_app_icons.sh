#!/bin/bash

# Generate App Icons from Logo
# This script generates all required iOS and Android icon sizes from your logo

LOGO_PATH="public/logo.png"
IOS_ICON_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"
ANDROID_RES_DIR="android/app/src/main/res"

echo "🎨 Generating App Icons from Logo"
echo "=================================="
echo ""

# Check if logo exists
if [ ! -f "$LOGO_PATH" ]; then
    echo "❌ Logo not found at: $LOGO_PATH"
    exit 1
fi

echo "✅ Found logo: $LOGO_PATH"
echo ""

# iOS Icon Sizes (in pixels, @1x, @2x, @3x)
# We'll generate a 1024x1024 icon and let Xcode generate the rest
echo "📱 Generating iOS icons..."

# Create iOS directory if it doesn't exist
mkdir -p "$IOS_ICON_DIR"

# Generate 1024x1024 icon (required for App Store)
sips -z 1024 1024 "$LOGO_PATH" --out "$IOS_ICON_DIR/AppIcon-1024.png" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Generated iOS icon: AppIcon-1024.png"
else
    echo "⚠️  Could not resize with sips. You may need to manually resize."
    echo "   Copy your logo to: $IOS_ICON_DIR/AppIcon-1024.png (1024x1024)"
fi

# Update Contents.json
cat > "$IOS_ICON_DIR/Contents.json" << 'EOF'
{
  "images" : [
    {
      "filename" : "AppIcon-1024.png",
      "idiom" : "universal",
      "platform" : "ios",
      "size" : "1024x1024"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

echo "✅ Updated iOS Contents.json"
echo ""

# Android Icon Sizes
echo "🤖 Generating Android icons..."

# Android sizes: mdpi=48, hdpi=72, xhdpi=96, xxhdpi=144, xxxhdpi=192
declare -A android_sizes=(
    ["mdpi"]="48"
    ["hdpi"]="72"
    ["xhdpi"]="96"
    ["xxhdpi"]="144"
    ["xxxhdpi"]="192"
)

for density in "${!android_sizes[@]}"; do
    size="${android_sizes[$density]}"
    mipmap_dir="$ANDROID_RES_DIR/mipmap-$density"
    
    mkdir -p "$mipmap_dir"
    
    # Generate icon
    sips -z "$size" "$size" "$LOGO_PATH" --out "$mipmap_dir/ic_launcher.png" 2>/dev/null
    sips -z "$size" "$size" "$LOGO_PATH" --out "$mipmap_dir/ic_launcher_round.png" 2>/dev/null
    sips -z "$size" "$size" "$LOGO_PATH" --out "$mipmap_dir/ic_launcher_foreground.png" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Generated Android icons for $density ($size x $size)"
    else
        echo "⚠️  Could not resize for $density. You may need to manually resize."
    fi
done

echo ""
echo "🎉 Icon generation complete!"
echo ""
echo "📝 Next steps:"
echo "1. In Xcode, open: ios/App/App/Assets.xcassets/AppIcon.appiconset"
echo "2. Drag AppIcon-1024.png to the 1024x1024 slot"
echo "3. Xcode will automatically generate all other sizes"
echo ""
echo "4. Rebuild:"
echo "   npm run build"
echo "   npm run cap:sync"
echo ""
echo "5. Clean and rebuild in Xcode (Cmd+Shift+K, then Cmd+R)"
echo ""
echo "💡 Tip: For best results, use an online tool like appicon.co"
echo "   to generate all sizes perfectly!"

