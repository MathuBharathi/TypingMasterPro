const endpoint =
  process.env.REACT_APP_SHEETS_API_URL ||
  "https://script.google.com/macros/s/AKfycbxPwPKdk9Kh5SRoeAQf_e_9tiziWhvwsUs4g0K2MYliUSQ1ZuSxKf-tI-7OAsItdElL5A/exec";

export const saveUserData = async (userData) => {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (error) {
    console.error("Error saving data:", error);
  }
};
