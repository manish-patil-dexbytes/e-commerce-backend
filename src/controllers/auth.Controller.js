const { loginUser } = require("../models/userModels");
const { validateEmail, validatePassword } = require("../helpers/validations");

// Authentication Logic
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Validate password format
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Invalid password format.",
      });
    }

    loginUser(email, password, (err, results) => {
      if (err) {
        console.error("MySQL error:", err);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else if (results.length === 1) {
        res.json({ success: true, message: "Authentication successful" });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Authentication failed" });
      }
    });
  } catch (error) {
    console.error("Exception in login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { login };

