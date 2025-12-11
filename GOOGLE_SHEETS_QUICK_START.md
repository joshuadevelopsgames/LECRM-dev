# Google Sheets Sync - Quick Start Checklist

Use this as a quick reference while setting up. For detailed instructions, see `GOOGLE_SHEETS_SETUP_TUTORIAL.md`.

## ✅ Setup Checklist

### 1. Get Sheet ID
- [ ] Open your Google Sheet
- [ ] Copy the ID from URL: `.../d/SHEET_ID_HERE/edit`
- [ ] Example: `193wKTGmz1zvWud05U1rCY9SysGQAeYc2KboO6_JjrJs`

### 2. Deploy Apps Script
- [ ] Open Google Sheet → Extensions → Apps Script
- [ ] Delete default code
- [ ] Copy code from `google-apps-script.js`
- [ ] Paste into Apps Script editor
- [ ] Update `SHEET_ID` constant with YOUR sheet ID
- [ ] Save project (Ctrl+S / Cmd+S)

### 3. Deploy as Web App
- [ ] Click Deploy → New deployment
- [ ] Select type: Web app
- [ ] Execute as: Me
- [ ] Who has access: Anyone
- [ ] Click Deploy
- [ ] Authorize when prompted
- [ ] Copy the Web App URL

### 4. Configure App
- [ ] Create/Edit `.env` file in project root
- [ ] Add: `VITE_GOOGLE_SHEETS_WEB_APP_URL=YOUR_WEB_APP_URL`
- [ ] No quotes, no spaces around `=`
- [ ] Save `.env` file
- [ ] Restart dev server (`npm run dev`)

### 5. Test
- [ ] Visit Web App URL in browser (should show success message)
- [ ] Import some data in LECRM
- [ ] Check Google Sheet for new tabs
- [ ] Verify data appears in tabs

## 🔍 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Web App URL not configured" | Check `.env` file, restart dev server |
| Data not appearing | Test Web App URL in browser, check permissions |
| Permission denied | Re-authorize Apps Script deployment |
| Duplicate data | Check that imported data has `lmn_crm_id`, `lmn_contact_id` |

## 📋 What Gets Created

After first import, your Google Sheet will have:

1. **All Data** (first tab)
   - One row per contact
   - All account fields + all contact fields
   - Sorted by Account Name, then Contact Name

2. **Imported Accounts** tab
3. **Imported Contacts** tab
4. **Imported Estimates** tab
5. **Imported Jobsites** tab

## 🔗 Important URLs

- **Google Sheets**: https://docs.google.com/spreadsheets/
- **Apps Script Editor**: Extensions → Apps Script (in your sheet)
- **Execution Logs**: Apps Script → Executions (left sidebar)

## 💡 Pro Tips

1. **Test Web App First**: Always test the Web App URL in browser before importing
2. **Check Logs**: If something fails, check Apps Script execution logs
3. **Backup**: Your data is automatically backed up in Google Sheets
4. **Share Sheet**: You can share the Google Sheet with team members for collaboration

---

**Need help?** See `GOOGLE_SHEETS_SETUP_TUTORIAL.md` for detailed step-by-step instructions.
