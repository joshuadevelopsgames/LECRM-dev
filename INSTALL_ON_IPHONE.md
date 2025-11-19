# How to Install LECRM on Your iPhone

## Method 1: Direct Install via Xcode (Easiest)

### Requirements:
- iPhone connected via USB cable
- Mac with Xcode
- Apple ID (free account works, but app expires in 7 days)
- Paid Apple Developer account ($99/year) for apps that don't expire

### Steps:

1. **Connect Your iPhone**
   - Plug iPhone into Mac with USB cable
   - Unlock your iPhone
   - Trust the computer if prompted

2. **In Xcode:**
   - Open your project: `npm run cap:ios`
   - At the top toolbar, click the device selector (next to Run button)
   - You should see your iPhone listed under "My Devices"
   - Select your iPhone

3. **Configure Signing:**
   - In Xcode, click on "App" in the left sidebar (blue folder)
   - Select the "App" target
   - Go to "Signing & Capabilities" tab
   - Check "Automatically manage signing"
   - Select your Team (your Apple ID)
   - Xcode will automatically create a provisioning profile

4. **Build and Run:**
   - Click Run (▶️) or press Cmd+R
   - First time: You may need to trust the developer on your iPhone
   - On iPhone: Settings → General → VPN & Device Management → Trust [Your Name]

5. **Done!**
   - The app will install and launch on your iPhone
   - You can find it on your home screen

### Free Account Limitations:
- App expires after 7 days
- Need to rebuild/reinstall weekly
- Limited to 3 apps per device

### Paid Developer Account ($99/year):
- Apps don't expire
- Can distribute via TestFlight
- Can publish to App Store

---

## Method 2: TestFlight (Requires Paid Developer Account)

### Steps:

1. **Archive the App:**
   - In Xcode: Product → Archive
   - Wait for archive to complete
   - Organizer window opens

2. **Upload to App Store Connect:**
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow the wizard to upload

3. **Set Up TestFlight:**
   - Go to https://appstoreconnect.apple.com
   - Create app listing (if not done)
   - Add internal/external testers
   - Install TestFlight app on iPhone

4. **Install:**
   - Open TestFlight app
   - Accept invitation
   - Install LECRM

---

## Method 3: Build IPA and Install (Advanced)

### Steps:

1. **Archive:**
   - Product → Archive in Xcode

2. **Export:**
   - Choose "Ad Hoc" or "Development"
   - Export IPA file

3. **Install:**
   - Use tools like Apple Configurator 2
   - Or install via Xcode: Window → Devices and Simulators → Install

---

## Quick Start (Recommended)

**For testing right now:**

```bash
# 1. Connect iPhone via USB
# 2. Open project
npm run cap:ios

# 3. In Xcode:
#    - Select your iPhone from device menu
#    - Click Run (▶️)
#    - Trust developer on iPhone if needed
```

**That's it!** The app will install and run on your iPhone.

---

## Troubleshooting

### "No signing certificate found"
- Go to Xcode → Settings → Accounts
- Add your Apple ID
- Select your team in Signing & Capabilities

### "Untrusted Developer"
- On iPhone: Settings → General → VPN & Device Management
- Tap your developer certificate
- Tap "Trust"

### "Device not found"
- Make sure iPhone is unlocked
- Trust the computer on iPhone
- Check USB cable connection
- Try different USB port

### "Provisioning profile error"
- In Xcode: Signing & Capabilities
- Click "Try Again" or "Download Manual Profiles"
- Make sure "Automatically manage signing" is checked

---

## Notes

- **Free Apple ID**: Works for testing, but app expires in 7 days
- **Paid Developer**: Required for TestFlight and App Store
- **First Build**: Takes longer (5-10 minutes)
- **Subsequent Builds**: Much faster (1-2 minutes)

Your app is ready to test on your iPhone! 🚀

