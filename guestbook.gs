/**
 * Guestbook backend for patrickmederos.com
 * ----------------------------------------
 * Paste this whole file into a Google Apps Script project bound to your
 * guestbook spreadsheet, then deploy it as a Web App.
 * Full instructions live in SETUP-GUESTBOOK.md.
 */

// ---- Settings you can change -------------------------------------------

/** Tab name inside the spreadsheet. */
var SHEET_NAME = 'Guestbook';

/** false = every note waits for your approval before it appears publicly. */
var AUTO_APPROVE = false;

/** Email to notify on a new note. Set to '' to turn notifications off. */
var NOTIFY_EMAIL = 'patrickvmederos@gmail.com';

/** Longest allowed name / message. */
var MAX_NAME = 60;
var MAX_MESSAGE = 1000;

// ---- Web app entry points ----------------------------------------------

function doGet(e) {
  try {
    return jsonOut({ ok: true, entries: listApproved() });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var data = readPayload(e);

    // Honeypot: real people never fill this in, bots usually do.
    if (String(data.website || '').trim() !== '') {
      return jsonOut({ ok: true, queued: true });
    }

    var name = String(data.name || '').trim().slice(0, MAX_NAME);
    var message = String(data.message || '').trim().slice(0, MAX_MESSAGE);

    if (!name || !message) {
      return jsonOut({ ok: false, error: 'Please fill in both your name and a message.' });
    }

    var sheet = getSheet();
    sheet.appendRow([new Date(), name, message, AUTO_APPROVE ? 'yes' : 'no']);

    if (NOTIFY_EMAIL) {
      try {
        MailApp.sendEmail(
          NOTIFY_EMAIL,
          'New guestbook note from ' + name,
          name + ' wrote:\n\n' + message +
          '\n\nOpen your Guestbook sheet and set Approved to "yes" to publish it.'
        );
      } catch (mailErr) {
        // Never fail the submission just because the email didn't send.
      }
    }

    return jsonOut({ ok: true, queued: true, autoApproved: AUTO_APPROVE });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

// ---- Helpers ------------------------------------------------------------

/** Accepts a JSON body, a text/plain JSON body, or plain form fields. */
function readPayload(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // fall through to form parameters
    }
  }
  return (e && e.parameter) || {};
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Message', 'Approved']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Returns approved notes, newest first. */
function listApproved() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var rows = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  var out = [];

  for (var i = 0; i < rows.length; i++) {
    var approved = String(rows[i][3] || '').trim().toLowerCase();
    if (approved !== 'yes' && approved !== 'true' && approved !== 'y') continue;

    var when = rows[i][0];
    out.push({
      date: when instanceof Date ? when.toISOString() : String(when),
      name: String(rows[i][1] || ''),
      message: String(rows[i][2] || '')
    });
  }

  return out.reverse();
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
