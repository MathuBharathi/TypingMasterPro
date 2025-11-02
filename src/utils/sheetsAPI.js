// src/api/sheetApi.js

const endpoint =
  process.env.REACT_APP_SHEETS_API_URL ||
  "https://script.google.com/macros/s/AKfycbxPwPKdk9Kh5SRoeAQf_e_9tiziWhvwsUs4g0K2MYliUSQ1ZuSxKf-tI-7OAsItdElL5A/exec";

// Generic function to talk to Google Apps Script
export const sendUserData = async (action, userData) => {
  try {
    const formBody = new URLSearchParams({ action, ...userData }).toString();

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    });

    const text = await res.text(); // Apps Script returns plain text JSON
    return JSON.parse(text);
  } catch (error) {
    console.error("Error communicating with Sheets API:", error);
    return { success: false, message: "Network error" };
  }
};

// Example usage:
// await sendUserData("register", { name: "John", email: "john@mail.com", password: "1234" });
// await sendUserData("login", { email: "john@mail.com", password: "1234" });
