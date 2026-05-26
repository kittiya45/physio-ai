# RehabAI — Setup Guide (Light Blue Theme + Google Sheets Integration)

## 📋 Recent Changes

### 1. Color Theme (Light Blue)
- Changed from green/teal (#2e6b6b) to light blue (#2e7ba8)
- Updated background: `#f0f7fb` (light blue background)
- Updated all related color variables
- Updated gradients in auth screen

**Color Variables Updated:**
```css
--green: #2e7ba8          /* Main blue */
--green2: #3d96c4         /* Lighter blue */
--green3: #b8dff4         /* Very light blue */
--green4: #e0f2fb         /* Background light blue */
--border: #d0e8f5         /* Border light blue */
--shadow: rgba(46,123,168) /* Blue shadows */
```

### 2. Google Sheets Integration

#### Features Added:
✅ **User Registration Tracking** → Saves to "User" sheet
✅ **Session Data Tracking** → Saves to "Data" sheet  
✅ **Automatic Sheet Creation** → Creates sheets if they don't exist
✅ **Error Handling** → Graceful fallback for CORS issues

---

## 🚀 Deployment Steps

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Note the Sheet ID (from URL): `https://docs.google.com/spreadsheets/d/**SHEET_ID**/edit`

### Step 2: Set Up Google Apps Script
1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code and copy all code from `GoogleAppsScript.gs`
3. **Replace the SHEET_ID** (line 5) with your actual Sheet ID:
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```
4. Save (Ctrl+S / Cmd+S)

### Step 3: Deploy as Web App
1. Click **Deploy → New Deployment**
2. Select type: **Web app**
3. Configure:
   - Execute as: **Your email** (the account that owns the Sheet)
   - Who has access: **Anyone** (for frontend access)
4. Click **Deploy**
5. Grant permissions when prompted
6. Copy the deployment URL (looks like: `https://script.google.com/macros/s/AKfycbw.../exec`)

### Step 4: Update Frontend URL
1. Open `frontend/test.html`
2. Find line ~704: `const APPS_URL = '...'`
3. Replace with your deployment URL:
   ```javascript
   const APPS_URL = 'YOUR_DEPLOYMENT_URL_HERE';
   ```
4. Also update `SHEET_ID` (line ~705) if needed
5. Save the file

### Step 5: Host the Frontend
- Option A: Use a local web server (Python: `python -m http.server 8000`)
- Option B: Deploy to GitHub Pages, Vercel, Netlify, or similar
- Option C: Use VS Code Live Server extension

---

## 🧪 Testing

### Test Registration Flow:
1. Open `frontend/test.html` in browser
2. Click "สมัครสมาชิก" (Register)
3. Fill in details:
   - Name, Last name
   - Email
   - Age, Gender, Condition
   - Password (6+ characters)
4. Click "✅ สมัครและเริ่มใช้งาน"
5. **Expected**: 
   - Toast message: "✅ สมัครสมาชิกและบันทึกลง Sheets แล้ว"
   - New row appears in "User" sheet

### Test Session Saving:
1. Log in with registered account
2. Select an exercise and click "เริ่มฝึก"
3. Click "📷 เปิดกล้อง" (open camera)
4. Do some exercises
5. Click "💾 บันทึก" (save)
6. **Expected**:
   - Toast message: "✅ บันทึกและ Sync ลง Google Sheets แล้ว!"
   - New row appears in "Data" sheet

### Test Sync to Sheets:
1. On History page ("📊 ประวัติ")
2. Click "☁️ Sync → Sheets"
3. **Expected**:
   - Pending sessions sync to "Data" sheet
   - Status changes to "✓ Sheets"

---

## 📊 Google Sheet Structure

### "User" Sheet
| Email | First Name | Last Name | Age | Gender | Condition |
|-------|-----------|-----------|-----|--------|-----------|
| user@email.com | John | Doe | 65 | Male | Back pain |

### "Data" Sheet
| Email | User Name | Age | Gender | Condition | Exercise Name | Reps | Score (%) | Duration (sec) | Date | Time | Timestamp |
|-------|-----------|-----|--------|-----------|---------------|------|-----------|----------------|------|------|-----------|
| user@email.com | John Doe | 65 | Male | Back pain | Neck Tilt | 10 | 85 | 45 | 4 มี.ค. 2566 | 14:30:22 | 1698765022000 |

---

## ⚙️ Troubleshooting

### Issue: "ปิดแล้ว" appears when trying to open camera
- **Solution**: Check browser camera permissions
- **Solution**: Use HTTPS or localhost (not HTTP)

### Issue: Sheets data not saving
- **Solution**: Check if Google Apps Script deployment URL is correct
- **Solution**: Verify Sheet ID matches both script and frontend
- **Solution**: Check Apps Script execution logs (Apps Script console)

### Issue: CORS error in browser console
- **Normal**: Frontend uses no-cors mode as fallback
- **Data still saves**: Check Google Sheets directly
- **Fix**: Deploy Apps Script with correct permissions

### Issue: "ไม่พบชีต" error
- **Solution**: Google Apps Script will auto-create sheets if missing
- **Manual fix**: Manually create "User" and "Data" sheets in Google Sheets

---

## 🎨 Color Reference

### Light Blue Theme
```
Primary Blue:        #2e7ba8
Lighter Blue:        #3d96c4  
Very Light Blue:     #b8dff4
Background:          #e0f2fb
Page Background:     #f0f7fb
Border:              #d0e8f5
```

---

## 📝 Notes

- All user data is stored locally in browser localStorage AND Google Sheets
- Demo login available without registration
- Camera access requires HTTPS or localhost
- Exercises use TensorFlow.js MoveNet for pose detection
- All data is associated with user email address

---

## 🔐 Security Reminders

- ⚠️ Don't share the Apps Script deployment URL publicly if sensitive
- ⚠️ Change Sheet permissions if needed
- ⚠️ Passwords are base64 encoded (not production-grade security)
- ✅ For production: Use proper authentication system

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check Apps Script execution logs
3. Verify Google Sheet structure matches documentation
4. Ensure deployment URL is correct in both files

---

**Last Updated:** 4 มีนาคม 2566  
**Theme:** Light Blue  
**Integration:** Google Sheets (User & Data sheets)
