// src/api/sheetApi.js

// Google Apps Script endpoint (you can change it in your Netlify environment settings)
const SHEETS_ENDPOINT =
  process.env.REACT_APP_SHEETS_API_URL ||
  "https://script.google.com/macros/s/AKfycbxPwPKdk9Kh5SRoeAQf_e_9tiziWhvwsUs4g0K2MYliUSQ1ZuSxKf-tI-7OAsItdElL5A/exec";

/**
 * Send user data to Google Sheets (through Apps Script)
 * @param {string} action - The action type ("register", "login", etc.)
 * @param {object} userData - User data object (name, email, password, etc.)
 * @returns {Promise<object>} Response from server (success, message, data)
 */
export const sendUserData = async (action, userData) => {
  try {
    const formBody = new URLSearchParams({
      action,
      ...userData,
    }).toString();

    const response = await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });

    // Google Apps Script often returns plain text, so handle both JSON and text
    const text = await response.text();

    try {
      return JSON.parse(text); // Try parsing as JSON
    } catch {
      console.warn("Received non-JSON response:", text);
      return { success: false, message: text || "Unexpected server response" };
    }
  } catch (error) {
    console.error("❌ Error communicating with Google Sheets API:", error);
    return {
      success: false,
      message: "Network or server error. Please try again later.",
    };
  }
};

// Optional alias for backward compatibility (if older code uses saveUserData)
export const saveUserData = sendUserData;

// Example usage:
// await sendUserData("register", { name: "John", email: "john@mail.com", password: "1234" });
// await sendUserData("login", { email: "john@mail.com", password: "1234" });
