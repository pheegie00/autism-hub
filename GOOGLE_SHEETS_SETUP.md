# Google Sheets Email Capture Setup

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Autism Hub Email Subscribers" (or whatever you like)
4. In **Sheet1**, add headers in row 1:
   - **A1:** Timestamp
   - **B1:** Email
   - **C1:** Source
5. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

## Step 2: Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Google Sheets API**:
   - Go to "APIs & Services" → "Enable APIs and Services"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create Service Account:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: "autism-hub-email-capture"
   - Click "Create and Continue"
   - Skip optional steps, click "Done"
5. Create Key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose **JSON** format
   - Download the JSON file

## Step 3: Share Sheet with Service Account

1. Open the JSON file you downloaded
2. Find the `client_email` field (looks like: `xxx@xxx.iam.gserviceaccount.com`)
3. Copy that email address
4. Go back to your Google Sheet
5. Click **Share** button (top right)
6. Paste the service account email
7. Give it **Editor** access
8. Click "Send"

## Step 4: Add Environment Variables to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your **autism-hub** site
3. Go to "Site configuration" → "Environment variables"
4. Add two variables:

### GOOGLE_SHEET_ID
- Value: The sheet ID from Step 1 (from the URL)

### GOOGLE_SERVICE_ACCOUNT_KEY
- Value: The **entire contents** of the JSON file from Step 2
- Make sure it's valid JSON (starts with `{` and ends with `}`)
- Should look like:
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

## Step 5: Redeploy

1. Netlify will automatically redeploy with the new env vars
2. Test by submitting an email on the site
3. Check your Google Sheet - a new row should appear!

---

## Troubleshooting

**"Failed to subscribe" error:**
- Check Netlify function logs
- Verify service account email has Editor access to the sheet
- Verify JSON is valid in environment variable

**Emails not appearing:**
- Check sheet name is "Sheet1" (or update code in `lib/googlesheets.ts`)
- Verify GOOGLE_SHEET_ID matches your sheet

**Need help?** Just ask!
