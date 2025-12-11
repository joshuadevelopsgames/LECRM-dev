# Google Sheets Sync Setup Guide

This guide explains how to set up bidirectional sync between LECRM and Google Sheets for imported data.

## Overview

When you import data from LMN (accounts, contacts, estimates, jobsites), it will now:
1. Store the data in Google Sheets (for persistence)
2. Sync automatically between the app and the sheet
3. Support upsert operations (create new or update existing records)

## Setup Steps

### Step 1: Deploy Google Apps Script

1. **Open your Google Sheet**
   - Go to: https://docs.google.com/spreadsheets/d/193wKTGmz1zvWud05U1rCY9SysGQAeYc2KboO6_JjrJs/edit
   - (Or use your own sheet ID)

2. **Open Apps Script Editor**
   - Click **Extensions** → **Apps Script**
   - This opens the script editor in a new tab

3. **Paste the Script Code**
   - Open the file `google-apps-script.js` from this project
   - Copy all the code
   - Paste it into the Apps Script editor (replace any existing code)
   - **Update the SHEET_ID** in the script if using a different sheet:
     ```javascript
     const SHEET_ID = '193wKTGmz1zvWud05U1rCY9SysGQAeYc2KboO6_JjrJs';
     ```

4. **Save the Project**
   - Click the **Save** icon (💾) or press `Ctrl+S` / `Cmd+S`
   - Give it a name like "LECRM Data Sync"

### Step 2: Deploy as Web App

1. **Click Deploy**
   - Click the **Deploy** button (top right)
   - Select **New deployment**

2. **Configure Deployment**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose **Web app**

3. **Set Deployment Settings**
   - **Description**: "LECRM Data Sync Web App" (optional)
   - **Execute as**: Select **Me** (your Google account)
   - **Who has access**: Select **Anyone** (or "Anyone with Google account" for more security)
   - Click **Deploy**

4. **Authorize the Script**
   - You'll be prompted to authorize the script
   - Click **Review permissions**
   - Select your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
   - This gives the script permission to read/write to your Google Sheet

5. **Copy the Web App URL**
   - After deployment, you'll see a Web App URL
   - It looks like: `https://script.google.com/macros/s/AKfycby.../exec`
   - **Copy this URL** - you'll need it in the next step

### Step 3: Configure Environment Variable

1. **Add to .env file**
   - Open or create `.env` in your project root
   - Add the Web App URL:
     ```bash
     VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
     ```
   - Replace `YOUR_SCRIPT_ID` with the actual URL from Step 2

2. **Restart Dev Server**
   - Stop your dev server (`Ctrl+C`)
   - Restart it: `npm run dev`
   - Environment variables are loaded on startup

### Step 4: Test the Setup

1. **Import Some Data**
   - Go to the Import Leads page
   - Upload your LMN export files
   - Complete the import

2. **Check Google Sheet**
   - Open your Google Sheet
   - You should see new tabs created:
     - **Imported Accounts**
     - **Imported Contacts**
     - **Imported Estimates**
     - **Imported Jobsites**
   - Data should appear in these tabs

3. **Verify Sync**
   - Import the same data again (or update existing records)
   - Check that existing records are updated (not duplicated)
   - New records should be added

## How It Works

### Data Flow

```
Import Dialog → base44.entities.upsert() → writeToGoogleSheet() → Google Apps Script → Google Sheet
```

1. **Import**: User imports data from LMN files
2. **Upsert**: Data is processed and upserted in the app
3. **Write to Sheet**: Data is sent to Google Apps Script Web App
4. **Apps Script**: Script writes/updates data in Google Sheet
5. **Sync**: Next time the app loads, it reads from the sheet

### Upsert Logic

- **Matching**: Records are matched by:
  - Accounts: `lmn_crm_id` or `id`
  - Contacts: `lmn_contact_id` or `id`
  - Estimates: `lmn_estimate_id` or `id`
  - Jobsites: `lmn_jobsite_id` or `id`

- **Update**: If a matching record exists, it's updated
- **Create**: If no match, a new row is added

### Sheet Structure

The Google Sheet will have the following tabs:

1. **All Data** (First Tab) - Compilation of accounts and contacts
   - One row per contact
   - Each row includes ALL account fields AND contact fields
   - Sorted by Account Name, then Contact Name
   - This gives you a complete view of all data in one place

2. **Imported Accounts** - Individual account records
   - All account fields (name, type, revenue, score, etc.)
   - Sorted by Account Name

3. **Imported Contacts** - Individual contact records
   - All contact fields (name, email, phone, position, etc.)
   - Sorted by Contact Name

4. **Imported Estimates** - Individual estimate records
   - All estimate fields (dates, pricing, status, etc.)
   - Sorted by Estimate Number

5. **Imported Jobsites** - Individual jobsite records
   - All jobsite fields (name, address, contact links, etc.)
   - Sorted by Jobsite Name

Headers are automatically created on first write. The "All Data" tab is created as the first tab and provides a comprehensive view combining account and contact information.

## Troubleshooting

### Data Not Appearing in Sheet

1. **Check Web App URL**
   - Verify `.env` has correct `VITE_GOOGLE_SHEETS_WEB_APP_URL`
   - Restart dev server after changing `.env`

2. **Check Apps Script Permissions**
   - Go to Apps Script → Deploy → Manage deployments
   - Click the pencil icon to edit
   - Re-authorize if needed

3. **Check Browser Console**
   - Open browser DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

4. **Test Web App Directly**
   - Visit the Web App URL in browser
   - Should see: `{"success":true,"message":"LECRM Google Sheets Sync Web App is running"}`
   - If you see an error, check Apps Script execution logs

### Apps Script Execution Logs

1. **View Logs**
   - Go to Apps Script editor
   - Click **Executions** (left sidebar)
   - See recent executions and any errors

2. **Common Errors**
   - **Permission denied**: Re-authorize the script
   - **Sheet not found**: Check SHEET_ID in script
   - **Invalid data format**: Check that records match expected structure

### Data Duplication

- **Cause**: Web App URL not configured, so data isn't being written
- **Solution**: Configure `VITE_GOOGLE_SHEETS_WEB_APP_URL` and restart

### Updates Not Working

- **Cause**: Lookup fields not matching
- **Solution**: Ensure `lmn_crm_id`, `lmn_contact_id`, etc. are present in imported data

## Security Notes

- **Web App Access**: Set to "Anyone" allows public access to the endpoint
  - Consider "Anyone with Google account" for more security
  - The endpoint only accepts POST requests with valid data structure
  - No authentication is required, but the Web App URL is secret

- **Sheet Permissions**: The sheet should be:
  - Accessible by your Google account (for Apps Script)
  - Can be private (doesn't need to be public)

## Next Steps

Once set up, imported data will:
- ✅ Persist in Google Sheets
- ✅ Sync automatically
- ✅ Support updates (upsert)
- ✅ Be available on app reload

The app will read from these sheets on startup, so your imported data will always be available!
