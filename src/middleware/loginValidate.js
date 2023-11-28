// Middleware function to validate login request data types
const validateLogin = (req, res, next) => {
  // Extracting email and password from the request body
  const { email, password } = req.body;

  // Define data types for email and password
  const dataTypes = {
    email: "string",
    password: "string",
  };

  // Function to validate data type
  const isValidDataType = (value, type) => {
    if (type === "string") {
      return typeof value === "string";
    }
    return typeof value === type;
  };

  // Loop through fields in dataTypes and check their data types
  for (const field in dataTypes) {
    if (!isValidDataType(req.body[field], dataTypes[field])) {
      // Return error if data type is invalid
      return res.status(400).json({
        success: false,
        message: `Invalid data type for ${field}`,
      });
    }
  }

  // If data types are valid, store validated data in req.validatedData
  req.validatedData = {
    email,
    password,
  };

  // Proceed to the next middleware 
  next();
};

// Export the validateLogin middleware function
module.exports = { validateLogin };
