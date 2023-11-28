const { loginUser } = require("../models/userModels");
const { validateEmail, validatePassword } = require("../helpers/validations");
const { generateToken } = require("../middleware/jwtMiddleware");

// Authentication Logic
const login = (req, res) => {
  try {
    const { email, password } = req.validatedData;

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

    // Attempt login using user-provided credentials
    loginUser(email, password, (err, results) => {
      if (err) {
        console.error("MySQL error:", err);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else if (results.length === 1) {
        // Generate and send JWT token upon successful authentication
        generateToken(req, res, () => {
          res.json({
            success: true,
            message: "Authentication successful",
            token: req.token,
          });
        });
      } else {
        // Authentication failed due to invalid credentials
        res
          .status(401)
          .json({ success: false, message: "Authentication failed" });
      }
    });
  } catch (error) {
    // Handle exceptions thrown during login process
    console.error("Exception in login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { login };
