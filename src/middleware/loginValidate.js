const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const dataTypes = {
    email: "string",
    password: "string",
  };
  const isValidDataType = (value, type) => {
    if (type === "string") {
      return typeof value === "string";
    }
    return typeof value === type;
  };
  for (const field in dataTypes) {
    if (!isValidDataType(req.body[field], dataTypes[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid data type for ${field}`,
      });
    }
  }
  req.validatedData = {
    email,
    password,
  };
  next();
};

module.exports = { validateLogin };
