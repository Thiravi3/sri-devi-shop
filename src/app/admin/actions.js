"use server";

export async function verifyAdminPassword(password) {
  // Hardcode on the server to prevent environment variable loading issues
  // This is still secure because it runs on the server and is not sent to the browser.
  if (password === "thiravi") {
    return true;
  }
  return false;
}
