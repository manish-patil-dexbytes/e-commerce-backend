const express = require("express");
const { login } = require("../controllers/auth.Controller");
const { validateLogin } = require("../middleware/loginValidate");

const router = express.Router();

// Authentication Logic
router.post("/login",validateLogin, login);

module.exports = router;
