// ═══════════════════════════════════════════════════════════════════════════
// RehabAI — Google Sheets Integration
// Deploy as Web App: "Execute as: Me" | "Who has access: Anyone"
// ═══════════════════════════════════════════════════════════════════════════

// ─── CONFIG ─────────────────────────────────────────────────────────────────
// IMPORTANT: Replace SHEET_ID with your Google Sheet ID
// You can find it in the URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
const SHEET_ID = '1_v-8Gem3O5M-GvtLH5YediIGkbl1dGHvn-gGAmS9kxM';

// ─── MAIN HANDLER ───────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    const payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'register') {
      return registerUser(sheet, payload);
    } else if (payload.action === 'saveSession') {
      return saveSession(sheet, payload);
    } else {
      return makeResponse(false, 'Unknown action');
    }
  } catch (err) {
    return makeResponse(false, err.message);
  }
}

// ─── REGISTER USER ──────────────────────────────────────────────────────────
function registerUser(sheet, data) {
  try {
    // Get or create "User" sheet
    let userSheet = sheet.getSheetByName('User');
    if (!userSheet) {
      userSheet = sheet.insertSheet('User', 0);
      // Create headers
      userSheet.getRange(1, 1, 1, 6).setValues([
        ['Email', 'First Name', 'Last Name', 'Age', 'Gender', 'Condition']
      ]);
    }
    
    // Get last row and append new user
    const lastRow = userSheet.getLastRow();
    userSheet.getRange(lastRow + 1, 1, 1, 6).setValues([[
      data.email || '',
      data.firstName || '',
      data.lastName || '',
      data.age || '',
      data.gender || '',
      data.condition || ''
    ]]);
    
    return makeResponse(true, 'User registered successfully');
  } catch (err) {
    return makeResponse(false, 'Error registering user: ' + err.message);
  }
}

// ─── SAVE SESSION ───────────────────────────────────────────────────────────
function saveSession(sheet, data) {
  try {
    // Get or create "Data" sheet
    let dataSheet = sheet.getSheetByName('Data');
    if (!dataSheet) {
      dataSheet = sheet.insertSheet('Data', 1);
      // Create headers
      dataSheet.getRange(1, 1, 1, 12).setValues([
        ['Email', 'User Name', 'Age', 'Gender', 'Condition', 
         'Exercise Name', 'Reps', 'Score (%)', 'Duration (sec)', 
         'Date', 'Time', 'Timestamp']
      ]);
    }
    
    // Get last row and append new session
    const lastRow = dataSheet.getLastRow();
    dataSheet.getRange(lastRow + 1, 1, 1, 12).setValues([[
      data.email || '',
      data.userName || '',
      data.age || '',
      data.gender || '',
      data.condition || '',
      data.exerciseName || '',
      data.reps || 0,
      data.score || 0,
      data.duration || 0,
      data.date || '',
      data.time || '',
      data.timestamp || new Date().getTime()
    ]]);
    
    return makeResponse(true, 'Session saved successfully');
  } catch (err) {
    return makeResponse(false, 'Error saving session: ' + err.message);
  }
}

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────
function makeResponse(success, message) {
  const response = ContentService.createTextOutput(
    JSON.stringify({ success: success, message: message })
  );
  response.setMimeType(ContentService.MimeType.JSON);
  return response;
}

// ─── CORS HANDLER (for no-cors fallback) ────────────────────────────────────
function doGet(e) {
  return ContentService.createTextOutput('RehabAI API is running');
}
