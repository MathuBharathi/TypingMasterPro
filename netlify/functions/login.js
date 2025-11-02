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
  const { email, password } = JSON.parse(event.body || "{}");
  if (!email || !password) return { statusCode: 400, body: JSON.stringify({ error: "Missing" }) };

  try {
    const sheets = await sheetsClient();
    const read = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: "users!A2:E1000" });
    const rows = read.data.values || [];
    const row = rows.find(r => r[0] === email);
    if (!row) return { statusCode: 401, body: JSON.stringify({ error: "Invalid" }) };

    const hash = row[1];
    const ok = await bcrypt.compare(password, hash);
    if (!ok) return { statusCode: 401, body: JSON.stringify({ error: "Invalid" }) };

    // return minimal user info; include userId (stored in column E)
    return { statusCode: 200, body: JSON.stringify({ email: row[0], name: row[2] || "", userId: row[4] || ("u_"+Date.now()) }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
