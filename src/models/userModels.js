const { db } = require("../db/connection");
const crypto = require("crypto");

// AES encryption function
function encrypt(text) {
  const cipher = crypto.createCipher("aes-256-cbc", "encryptionKey");
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Function for user authentication
function loginUser(email, password, callback) {
  try {
    const encryptedPassword = encrypt(password);
    db.query(
      "SELECT gmail, password FROM users WHERE gmail = ? AND password = ?",
      [email, encryptedPassword],
      (err, results) => {
        if (err) {
          throw err;
        } else {
          callback(null, results);
        }
      }
    );
  } catch (err) {
    callback(err, null);
  }
}
module.exports = { encrypt, loginUser };
