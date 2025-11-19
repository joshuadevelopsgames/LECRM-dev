# Troubleshooting iOS Build Failures

## Quick Fixes

### 1. **Signing Issues** (Most Common)

**Error:** "No signing certificate" or "Provisioning profile"

**Solution:**
1. In Xcode: Click "App" in left sidebar
2. Select "App" target
3. Go to "Signing & Capabilities" tab
4. Check ✅ "Automatically manage signing"
5. Select your Team (your Apple ID)
6. If no team: Xcode → Settings → Accounts → Add Apple ID

### 2. **Clean Build**

**Error:** Build fails with cached errors

**Solution:**
```bash
# In Xcode:
Product → Clean Build Folder (Cmd+Shift+K)

# Or from terminal:
cd /Users/joshua/LECRM/ios/App
rm -rf ~/Library/Developer/Xcode/DerivedData/App-*
```

### 3. **Reinstall Pods**

**Error:** Missing dependencies or pod errors

**Solution:**
```bash
cd /Users/joshua/LECRM/ios/App
export LANG=en_US.UTF-8
pod deintegrate
pod install
```

### 4. **Check Build Settings**

**Error:** Deployment target or Swift version issues

**Solution:**
1. In Xcode: Click "App" → "App" target
2. "General" tab → Check "iOS Deployment Target" (should be 14.0+)
3. "Build Settings" → Search "Swift Language Version" (should be Swift 5)

### 5. **Capacitor Sync**

**Error:** Missing web assets or config

**Solution:**
```bash
cd /Users/joshua/LECRM
npm run build
npm run cap:sync
```

## Common Error Messages

### "No such module 'Capacitor'"
- Run: `cd ios/App && pod install`
- Make sure you're opening `App.xcworkspace` not `App.xcodeproj`

### "Code signing is required"
- Go to Signing & Capabilities
- Select your team
- Enable automatic signing

### "Provisioning profile doesn't match"
- Clean build folder
- Delete derived data
- Rebuild

### "Command PhaseScriptExecution failed"
- Check if `npm run build` works
- Verify `dist/` folder exists
- Run `npm run cap:sync`

## Step-by-Step Recovery

1. **Clean Everything:**
   ```bash
   cd /Users/joshua/LECRM
   npm run build
   cd ios/App
   pod deintegrate
   pod install
   ```

2. **In Xcode:**
   - Product → Clean Build Folder (Cmd+Shift+K)
   - Close Xcode
   - Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData/App-*`
   - Reopen Xcode

3. **Configure Signing:**
   - App → Signing & Capabilities
   - Enable automatic signing
   - Select team

4. **Rebuild:**
   - Select simulator or device
   - Product → Build (Cmd+B)
   - Then Run (Cmd+R)

## Still Having Issues?

Share the exact error message from Xcode's error panel (bottom of screen) and I can help troubleshoot further!

