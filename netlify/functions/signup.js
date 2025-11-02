const { google } = require("googleapis");
const bcrypt = require("bcryptjs");

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
  const { email, password, name } = JSON.parse(event.body || "{}");
  if (!email || !password) return { statusCode: 400, body: JSON.stringify({ error: "Missing" }) };

  try {
    const sheets = await sheetsClient();
    // check existing
    const read = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: "users!A2:A1000" });
    const rows = read.data.values || [];
    if (rows.flat().includes(email)) return { statusCode: 409, body: JSON.stringify({ error: "User exists" }) };

    const hash = await bcrypt.hash(password, 10);
    const userId = "u_" + Date.now();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "users!A2:E2",
      valueInputOption: "RAW",
      requestBody: { values: [[email, hash, name || "", new Date().toISOString(), userId]] }
    });
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
