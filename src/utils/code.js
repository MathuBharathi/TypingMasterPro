function doPost(e) {
  try {
    const action = e.parameter.action;
    const email = e.parameter.email;
    const password = e.parameter.password;
    const name = e.parameter.name || "";

    const ss = SpreadsheetApp.openById("YOUR_SHEET_ID"); // 👈 replace with your Sheet ID
    const sheet = ss.getSheetByName("Sheet1");
    const rows = sheet.getDataRange().getValues();

    // Registration
    if (action === "register") {
      // Check if email already exists
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][1] === email) {
          return respond({
            success: false,
            message: "Email already registered",
          });
        }
      }

      // Append new user (Name, Email, Password)
      sheet.appendRow([name, email, password]);
      return respond({
        success: true,
        message: "Registration successful!",
      });
    }

    // Login
    else if (action === "login") {
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][1] === email && rows[i][2] === password) {
          return respond({
            success: true,
            message: "Login successful!",
          });
        }
      }
      return respond({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Invalid action
    else {
      return respond({
        success: false,
        message: "Unknown action",
      });
    }
  } catch (err) {
    return respond({
      success: false,
      message: "Server error: " + err.message,
    });
  }
}

// Helper function to send JSON response
function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
