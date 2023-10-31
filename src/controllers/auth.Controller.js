const { db } = require("../db/connection");
const crypto = require("crypto");
const { validateEmail, validatePassword } = require("../helpers/validations");

// AES encryption function
function encrypt(text) {
  const cipher = crypto.createCipher("aes-256-cbc", "encryptionKey");
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Authentication Logic
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  // Validate password format
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Invalid password format.",
    });
  }

  const encryptedPassword = encrypt(password);
  // Query to check if the user exists
  db.query(
    "SELECT gmail,password FROM users WHERE gmail = ? AND password = ?",
    [email, encryptedPassword],
    (err, results) => {
      if (err) {
        console.error("MySQL error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
      } else if (results.length === 1) {
        res.json({ success: true, message: "Authentication successful" });
      } else {
        res.status(401).json({ success: false, message: "Authentication failed" });
      }
    }
  );
};

module.exports = { login };
