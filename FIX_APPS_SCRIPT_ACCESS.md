# Fix: Can't Access Apps Script Editor

If clicking "Extensions → Apps Script" takes you to a bad request/error page, try these fixes:

## Quick Fixes

### Fix 1: Use Direct Apps Script URL

Instead of clicking the menu, go directly to Apps Script:

1. **Get your Sheet ID** from the Google Sheet URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the SHEET_ID part

2. **Go directly to Apps Script**:
   ```
   https://script.google.com/home/projects
   ```

3. **Or create a new script and link it**:
   - Go to: https://script.google.com/home/start
   - Click "New project"
   - In the script, add this to link it to your sheet:
   ```javascript
   // At the top of your script, add:
   const SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```

### Fix 2: Clear Browser Cache/Cookies

1. **Clear Google cookies**:
   - Chrome: Settings → Privacy → Clear browsing data → Cookies
   - Or use Incognito/Private window

2. **Try in Incognito/Private window**:
   - Open a new incognito window
   - Log into Google
   - Try accessing Apps Script again

### Fix 3: Check Google Account

1. **Make sure you're logged into the correct account**:
   - Check which Google account you're using
   - The account needs access to the Google Sheet

2. **Try a different browser**:
   - If Chrome doesn't work, try Firefox or Safari
   - Sometimes browser extensions cause issues

### Fix 4: Use Apps Script Dashboard

1. **Go directly to Apps Script**:
   - Visit: https://script.google.com/home/projects

2. **Create new project**:
   - Click "New project"
   - Paste your code from `google-apps-script.js`
   - Update the SHEET_ID

3. **Link to your sheet** (optional):
   - The script will work with any sheet if you set the SHEET_ID correctly
   - You don't need to "link" it through the sheet menu

### Fix 5: Check Sheet Permissions

1. **Make sure you own or have edit access**:
   - The sheet must be yours or you need edit permissions
   - Check: Share button → See who has access

2. **Try creating a new sheet**:
   - Create a fresh Google Sheet
   - Try Apps Script on the new sheet
   - If it works, the issue is with the original sheet

## Alternative: Create Script Separately

You don't actually need to access Apps Script from the sheet menu. You can create it separately:

### Step 1: Create New Apps Script Project

1. Go to: https://script.google.com/home/start
2. Click "New project"
3. Delete the default `myFunction()` code

### Step 2: Paste Your Code

1. Open `google-apps-script.js` from your LECRM project
2. Copy all the code
3. Paste into the Apps Script editor
4. **Update SHEET_ID**:
   ```javascript
   const SHEET_ID = 'YOUR_ACTUAL_SHEET_ID';
   ```
5. Save (Ctrl+S / Cmd+S)

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click gear icon ⚙️ → **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the Web App URL
6. Click **Done**

### Step 4: Test

1. Open the Web App URL in browser
2. Should see: `{"success": true, "message": "..."}`

## Why This Happens

Common causes:
- **Browser cache/cookies** - Google authentication cookies corrupted
- **Multiple Google accounts** - Wrong account selected
- **Sheet permissions** - Don't have edit access
- **Google service issue** - Temporary Google Apps Script outage
- **Browser extension** - Ad blocker or privacy extension interfering

## Best Solution: Use Direct Access

**Recommended approach**: Don't use the sheet menu. Go directly to Apps Script:

1. Visit: https://script.google.com/home/projects
2. Create new project
3. Paste code
4. Set SHEET_ID
5. Deploy

This bypasses the sheet menu entirely and works more reliably.

## Still Not Working?

1. **Try different browser** (Chrome, Firefox, Safari)
2. **Try incognito/private mode**
3. **Check if Apps Script is blocked** in your organization/school
4. **Wait a few minutes** - might be temporary Google service issue
5. **Check Google Workspace status**: https://www.google.com/appsstatus

The key is: **You don't need to access Apps Script from the sheet menu**. You can create it separately and it will work the same way!
