import { google } from 'googleapis';

export async function appendToSheet(email: string) {
  try {
    // Parse service account credentials from env
    const credentials = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID not configured');
    }

    // Append row: [timestamp, email, source]
    const values = [
      [
        new Date().toISOString(),
        email,
        'modal'
      ]
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:C', // Adjust sheet name if needed
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    return { success: true, response: response.data };
  } catch (error) {
    console.error('Google Sheets error:', error);
    throw error;
  }
}
