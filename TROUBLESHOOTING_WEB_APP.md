# Troubleshooting: Web App 400 Error

## The Problem

You're seeing a 400 Bad Request error with a redirect loop when trying to access your Google Apps Script Web App. This usually means:

1. **Wrong URL format** - You're using the editor URL instead of the Web App URL
2. **Deployment not active** - The deployment hasn't been activated
3. **Script errors** - There's an error in the script preventing it from running

## Quick Fixes

### Fix 1: Get the Correct Web App URL

The Web App URL is **NOT** the same as the Apps Script editor URL.

**Wrong URLs (these won't work):**
- `https://script.google.com/home/projects/...`
- `https://script.google.com/accounts?...`
- The URL from the Apps Script editor

**Correct URL format:**
- `https://script.google.com/macros/s/AKfycby.../exec`
- Must end with `/exec`
- Should be provided after deploying as Web App

### Fix 2: Redeploy the Web App

1. **Open Apps Script Editor**
   - Go to your Google Sheet
   - Extensions → Apps Script

2. **Check for Errors**
   - Look at the code editor
   - Any red underlines or error messages?
   - Fix any syntax errors first

3. **Save the Script**
   - Click Save (Ctrl+S / Cmd+S)
   - Make sure there are no errors

4. **Deploy Again**
   - Click **Deploy** → **Manage deployments**
   - Click the pencil icon ✏️ next to your deployment
   - Click **Deploy** again
   - Copy the NEW Web App URL
   - Make sure it ends with `/exec`

### Fix 3: Check Script Permissions

1. **Go to Deployments**
   - Deploy → Manage deployments
   - Click the pencil icon

2. **Verify Settings**
   - Execute as: **Me**
   - Who has access: **Anyone** (or "Anyone with Google account")
   - Click **Deploy**

3. **Re-authorize if Needed**
   - If prompted, click **Authorize access**
   - Select your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**

### Fix 4: Test the Script First

Before deploying, test that the script works:

1. **In Apps Script Editor**
   - Click the function dropdown (top center)
   - Select `doGet`
   - Click the Run button ▶️
   - Authorize if prompted
   - Check the Execution log for errors

2. **If doGet works, test doPost**
   - You can't easily test doPost in the editor, but if doGet works, doPost should too

## Step-by-Step: Fresh Deployment

If nothing works, start fresh:

### Step 1: Clean Up Old Deployment

1. Go to Apps Script → Deploy → Manage deployments
2. Click the trash icon 🗑️ to delete old deployments
3. Confirm deletion

### Step 2: Verify Script Code

1. Open `google-apps-script.js` from your project
2. Copy ALL the code
3. In Apps Script editor, select all and delete
4. Paste the code
5. **Update SHEET_ID**:
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```
6. Save (Ctrl+S / Cmd+S)

### Step 3: Create New Deployment

1. Click **Deploy** → **New deployment**
2. Click gear icon ⚙️ → Select **Web app**
3. Settings:
   - Description: "LECRM Sync"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **IMPORTANT**: Copy the Web App URL (starts with `https://script.google.com/macros/s/...`)
6. Click **Done**

### Step 4: Test the URL

1. Open the Web App URL in a new browser tab
2. You should see:
   ```json
   {
     "success": true,
     "message": "LECRM Google Sheets Sync Web App is running",
     "timestamp": "..."
   }
   ```
3. If you see this, the Web App is working! ✅

### Step 5: Update .env File

1. Open `.env` in your project root
2. Add/update:
   ```bash
   VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```
3. **No quotes, no spaces**
4. Save the file
5. Restart your dev server

## Common Mistakes

### ❌ Wrong: Using Editor URL
```
https://script.google.com/home/projects/...
```

### ✅ Correct: Using Web App URL
```
https://script.google.com/macros/s/AKfycby.../exec
```

### ❌ Wrong: URL with quotes in .env
```bash
VITE_GOOGLE_SHEETS_WEB_APP_URL="https://script.google.com/..."
```

### ✅ Correct: URL without quotes
```bash
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/...
```

### ❌ Wrong: Forgetting to restart dev server
- Environment variables only load on server start
- Always restart after changing `.env`

## Still Not Working?

### Check Execution Logs

1. Apps Script Editor → **Executions** (left sidebar)
2. Click on recent executions
3. Look for error messages
4. Common errors:
   - "ReferenceError: SHEET_ID is not defined" → Update SHEET_ID constant
   - "Exception: Access denied" → Re-authorize the script
   - "Exception: Sheet not found" → Check SHEET_ID is correct

### Verify Script Has Required Functions

Your script MUST have:
- `doGet()` function
- `doPost()` function
- `writeToSheet()` function
- `getSheetName()` function
- `getHeaders()` function
- `getLookupFields()` function
- `getFieldMap()` function
- `updateCompilationTab()` function
- `getCompilationHeaders()` function
- `getCompilationFieldValue()` function

### Test with curl (Advanced)

If you have curl installed, test the Web App:

```bash
curl "YOUR_WEB_APP_URL"
```

Should return JSON with success: true

## Quick Checklist

- [ ] Script code is correct (no syntax errors)
- [ ] SHEET_ID is updated in the script
- [ ] Script is saved
- [ ] Deployment is created (not just saved)
- [ ] Web App URL copied (ends with `/exec`)
- [ ] Web App URL tested in browser (shows success JSON)
- [ ] `.env` file has correct URL (no quotes)
- [ ] Dev server restarted after `.env` change

## Need More Help?

1. **Check the execution logs** in Apps Script
2. **Test the Web App URL directly** in browser
3. **Verify the script runs** by testing doGet function
4. **Double-check the SHEET_ID** matches your Google Sheet

The most common issue is using the wrong URL format. Make sure you're using the Web App URL from the deployment, not the editor URL!
