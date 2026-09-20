# Setting up the guestbook

About ten minutes, all clicking, no coding. Everything lives in your own
Google account — nobody else can take it down.

---

## 1. Make the spreadsheet

1. Go to [sheets.new](https://sheets.new) — this creates a blank spreadsheet.
2. Name it something like **Patrick's Guestbook** (top-left corner).
3. At the bottom, double-click the tab that says `Sheet1` and rename it to
   exactly **Guestbook** (capital G, no spaces).

That's all — the script creates the column headers for you the first time
someone signs it.

---

## 2. Add the script

1. In that spreadsheet, click **Extensions → Apps Script**. A new tab opens.
2. Delete whatever code is in the editor (usually an empty `myFunction`).
3. Open `guestbook.gs` from this repository, copy the **entire** file, and
   paste it in.
4. Click the **save** icon (💾).

---

## 3. Deploy it

1. Top right, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** anything, e.g. `guestbook v1`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**

   > "Anyone" is required — it means visitors can sign the guestbook without
   > a Google account. It does *not* give anyone access to your spreadsheet.

4. Click **Deploy**.
5. Google will ask you to authorize. Click **Authorize access**, pick your
   account, then on the "Google hasn't verified this app" screen click
   **Advanced → Go to [project name] (unsafe)** → **Allow**. This warning is
   normal for your own personal scripts.
6. Copy the **Web app URL**. It looks like:

   ```
   https://script.google.com/macros/s/AKfycb..................../exec
   ```

---

## 4. Put the URL on the site

In `index.html`, find this line near the bottom (inside the `<script>` block):

```js
var GUESTBOOK_URL = '';
```

Paste your URL between the quotes:

```js
var GUESTBOOK_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

Commit and push. Until this is filled in, the guestbook section shows an
email button instead, so the page never looks broken.

---

## Approving and deleting notes

Open your **Guestbook** spreadsheet. Each note is one row:

| Timestamp | Name | Message | Approved |
|---|---|---|---|

- **To publish a note:** type `yes` in the **Approved** column.
- **To reject it:** leave it as `no`, or delete the whole row.
- **To remove something already public:** change `yes` back to `no`, or
  delete the row. It disappears from the site immediately.

Nothing appears on your site until you type `yes`. Nasty comments never
reach the page at all.

You also get an email each time someone signs it, so you don't have to keep
checking.

---

## Changing the settings

At the top of `guestbook.gs`:

| Setting | What it does |
|---|---|
| `AUTO_APPROVE` | Set to `true` to publish notes instantly with no review. Leave `false` to approve each one. |
| `NOTIFY_EMAIL` | Where new-note emails go. Set to `''` to stop them. |
| `MAX_NAME` / `MAX_MESSAGE` | Length limits. |

**Important:** after editing the script, you must redeploy for changes to
take effect — **Deploy → Manage deployments → ✏️ edit → Version: New
version → Deploy**. The URL stays the same.

---

## If something goes wrong

**The guestbook shows "couldn't load".** Usually the deployment's "Who has
access" isn't set to **Anyone**. Check via **Deploy → Manage deployments**.

**Notes submit but never appear.** That's working as intended — they're
waiting for you to type `yes` in the Approved column.

**You edited the script and nothing changed.** You need to deploy a *new
version* (see above). Saving alone doesn't update the live web app.
