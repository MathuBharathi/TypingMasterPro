const { google } = require("googleapis");
const SHEET_ID = process.env.SHEET_ID;
const CREDENTIALS = JSON.parse(process.env.GCP_CREDENTIALS || "{}");

async function sheetsClient() {
  const jwt = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  await jwt.authorize();
  return google.sheets({ version: "v4", auth: jwt });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const data = JSON.parse(event.body || "{}");
  if (!data.userId) return { statusCode: 400, body: JSON.stringify({ error: "Missing userId" }) };

  try {
    const sheets = await sheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "performance!A2:G2",
      valueInputOption: "RAW",
      requestBody: {
        values: [[data.userId, data.stage || "", data.level || "", data.wpm || 0, data.accuracy || 0, data.timeLimit || 60, new Date().toISOString()]]
      }
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
