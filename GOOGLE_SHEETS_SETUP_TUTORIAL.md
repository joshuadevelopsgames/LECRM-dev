# Google Sheets Sync Setup - Complete Tutorial

This guide will walk you through setting up the Google Sheets sync system so that imported data is automatically saved to Google Sheets and synced with your app.

## What This System Does

When you import data from LMN (accounts, contacts, estimates, jobsites):
1. ✅ Data is saved to Google Sheets automatically
2. ✅ Data persists even if you refresh the app
3. ✅ Data syncs bidirectionally (write on import, read on load)
4. ✅ Creates a "All Data" compilation tab with everything in one place
5. ✅ Creates individual tabs for each entity type

## Prerequisites

You'll need:
- ✅ A Google account
- ✅ Access to Google Sheets
- ✅ Your Google Sheet ID (we'll show you how to get this)
- ✅ About 10-15 minutes to set up

## Step-by-Step Setup

### Step 1: Get Your Google Sheet ID

1. **Open or Create Your Google Sheet**
   - Go to: https://docs.google.com/spreadsheets/
   - Either open your existing sheet or create a new one
   - The sheet can be empty - we'll create the tabs automatically

2. **Copy the Sheet ID from the URL**
   - Look at the URL in your browser
   - It will look like: `https://docs.google.com/spreadsheets/d/193wKTGmz1zvWud05U1rCY9SysGQAeYc2KboO6_JjrJs/edit`
   - The Sheet ID is the long string between `/d/` and `/edit`
   - In this example: `193wKTGmz1zvWud05U1rCY9SysGQAeYc2KboO6_JjrJs`
   - **Copy this ID** - you'll need it in Step 2

### Step 2: Deploy the Google Apps Script

1. **Open Apps Script Editor**
   - In your Google Sheet, click **Extensions** → **Apps Script**
   - This opens a new tab with the script editor

2. **Clear the Default Code**
   - Delete any code that's already there (usually just a blank `myFunction()`)

3. **Copy the Script Code**
   - Open the file `google-apps-script.js` from your LECRM project
   - Copy ALL the code (Ctrl+A, then Ctrl+C / Cmd+A, then Cmd+C)

4. **Paste into Apps Script Editor**
   - Paste the code into the Apps Script editor (Ctrl+V / Cmd+V)

5. **Update the Sheet ID**
   - Find this line near the top:
     ```javascript
     const SHEET_ID = '193wKTGmz1zvWud05U1rCY9SysGQAeYc2KboO6_JjrJs';
     ```
   - Replace `193wKTGmz1zvWud05U1rCY9SysGQAeYc2KboO6_JjrJs` with YOUR Sheet ID from Step 1
   - Make sure to keep the quotes around it

6. **Save the Project**
   - Click the **Save** icon (💾) or press `Ctrl+S` / `Cmd+S`
   - Give it a name like "LECRM Data Sync" (click the project name at the top)

### Step 3: Deploy as Web App

1. **Click Deploy**
   - Click the **Deploy** button in the top right
   - Select **New deployment**

2. **Select Web App**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose **Web app**

3. **Configure Settings**
   - **Description**: "LECRM Data Sync" (optional, but helpful)
   - **Execute as**: Select **Me** (your Google account)
   - **Who has access**: Select **Anyone** 
     - (This allows your app to call it. The URL will be secret, so it's safe)
   - Click **Deploy**

4. **Authorize the Script**
   - You'll see a popup asking to authorize the script
   - Click **Review permissions**
   - Select your Google account
   - You might see a warning: "Google hasn't verified this app"
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
   - This gives the script permission to read/write to your Google Sheet

5. **Copy the Web App URL**
   - After authorization, you'll see a Web App URL
   - It looks like: `https://script.google.com/macros/s/AKfycby.../exec`
   - **IMPORTANT**: Copy this entire URL
   - Click **Done**

### Step 4: Configure Your App

1. **Find or Create .env File**
   - In your LECRM project folder, look for a file named `.env`
   - If it doesn't exist, create it in the root folder (same level as `package.json`)

2. **Add the Web App URL**
   - Open the `.env` file
   - Add this line (replace with YOUR Web App URL):
     ```bash
     VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
     ```
   - Make sure there are NO spaces around the `=`
   - Make sure there are NO quotes around the URL
   - Save the file

3. **Restart Your Dev Server**
   - If your dev server is running, stop it (`Ctrl+C`)
   - Start it again: `npm run dev`
   - Environment variables are only loaded when the server starts

### Step 5: Test the Setup

1. **Test the Web App Directly**
   - Open the Web App URL in your browser
   - You should see:
     ```json
     {
       "success": true,
       "message": "LECRM Google Sheets Sync Web App is running",
       "timestamp": "2025-01-XX..."
     }
     ```
   - If you see this, the Web App is working! ✅

2. **Test an Import**
   - Go to your LECRM app
   - Navigate to the Import Leads page
   - Upload your LMN export files (Contacts, Leads, Estimates, Jobsites)
   - Complete the import

3. **Check Your Google Sheet**
   - Go back to your Google Sheet
   - You should see new tabs created:
     - **All Data** (first tab) - compilation of accounts and contacts
     - **Imported Accounts**
     - **Imported Contacts**
     - **Imported Estimates**
     - **Imported Jobsites**
   - Data should appear in these tabs
   - The "All Data" tab should have one row per contact with all account and contact fields

4. **Verify Data Persists**
   - Refresh your LECRM app
   - The imported data should still be there (loaded from Google Sheets)
   - This confirms the sync is working! ✅

## How It Works

### Data Flow

```
1. You import data in LECRM
   ↓
2. Data is processed and validated
   ↓
3. Data is sent to Google Apps Script Web App
   ↓
4. Apps Script writes data to Google Sheet tabs
   ↓
5. Next time app loads, it reads from Google Sheets
```

### The "All Data" Tab

- **Purpose**: One place to see everything
- **Structure**: One row per contact
- **Fields**: All account fields + all contact fields in each row
- **Sorting**: Automatically sorted by Account Name, then Contact Name
- **Updates**: When accounts update, all related contact rows update too

### Individual Tabs

- **Imported Accounts**: Just account records
- **Imported Contacts**: Just contact records  
- **Imported Estimates**: Just estimate records
- **Imported Jobsites**: Just jobsite records

Each tab is sorted appropriately for easy viewing.

## Troubleshooting

### Problem: "Web App URL not configured" error

**Solution:**
1. Check that `.env` file exists in project root
2. Check that `VITE_GOOGLE_SHEETS_WEB_APP_URL` is spelled correctly
3. Check that there are no quotes around the URL
4. Restart your dev server after adding the variable

### Problem: Data not appearing in Google Sheet

**Check these:**
1. **Web App URL is correct**
   - Test it in browser (should show success message)
   
2. **Apps Script has permissions**
   - Go to Apps Script → Deploy → Manage deployments
   - Click the pencil icon to edit
   - Re-authorize if needed

3. **Sheet ID is correct in script**
   - Open Apps Script editor
   - Check the `SHEET_ID` constant matches your sheet

4. **Check browser console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Look for failed requests in Network tab

### Problem: "Permission denied" error

**Solution:**
1. Go to Apps Script → Deploy → Manage deployments
2. Click the pencil icon
3. Re-authorize the script
4. Make sure "Who has access" is set to "Anyone"

### Problem: Data appears but then disappears

**Solution:**
- This usually means the app is reading from Google Sheets but the data isn't there
- Check that the write operation succeeded (look for success messages in console)
- Verify data is actually in the Google Sheet tabs

### Problem: "Script function not found" error

**Solution:**
- Make sure you copied ALL the code from `google-apps-script.js`
- Make sure the `doPost` and `doGet` functions are present
- Save the script and redeploy

### Problem: Duplicate data appearing

**Solution:**
- This means upsert matching isn't working
- Check that your imported data has `lmn_crm_id`, `lmn_contact_id`, etc.
- The script matches on these IDs to prevent duplicates

## Viewing Execution Logs

If something isn't working, you can see what the script is doing:

1. **Open Apps Script Editor**
2. **Click "Executions" in the left sidebar**
3. **See recent executions** - click on one to see details
4. **Check for errors** - any errors will be shown here

## Security Notes

- **Web App URL is Secret**: Don't share it publicly
- **Sheet Permissions**: Your sheet can be private - Apps Script can access it
- **No Authentication Required**: The Web App URL acts as the authentication
- **Rate Limits**: Google Apps Script has daily quotas, but normal usage won't hit them

## Next Steps After Setup

Once everything is working:

1. ✅ **Import your data** - All imports will now save to Google Sheets
2. ✅ **Data persists** - Refresh the app, data is still there
3. ✅ **View in Sheets** - Open Google Sheets anytime to see all your data
4. ✅ **Export/Backup** - Your data is automatically backed up in Google Sheets
5. ✅ **Share access** - You can share the Google Sheet with team members

## Quick Reference

### Files You Need:
- ✅ `google-apps-script.js` - The script code (already in your project)
- ✅ `.env` - Environment variables file (you create this)

### What Gets Created:
- ✅ "All Data" tab - Compilation of accounts and contacts
- ✅ "Imported Accounts" tab
- ✅ "Imported Contacts" tab  
- ✅ "Imported Estimates" tab
- ✅ "Imported Jobsites" tab

### Environment Variable:
```bash
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

## Still Having Issues?

1. **Check the setup checklist:**
   - [ ] Sheet ID updated in Apps Script
   - [ ] Script deployed as Web App
   - [ ] Web App URL in `.env` file
   - [ ] Dev server restarted after adding `.env`
   - [ ] Web App URL tested in browser (shows success)

2. **Check execution logs** in Apps Script

3. **Check browser console** for JavaScript errors

4. **Verify data format** - Make sure imported data has the required IDs

---

That's it! Once set up, your data will automatically sync to Google Sheets every time you import. 🎉
