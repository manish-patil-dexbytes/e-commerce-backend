// Middleware function to validate data before adding variants
const validateAddVariants = (req, res, next) => {
  // Destructure and retrieve data from the request body
  let { variant, attributes } = req.body;

  // Define expected data types for each field
  const dataTypes = {
    variant: "string",
    attributes: "object",
  };

  // Function to check if data types match the expected types
  const isValidDataType = (value, type) => {
    if (type === "string") {
      return typeof value === "string";
    } else if (type === "object") {
      return typeof value === "object";
    }
    return typeof value === type;
  };

  // Validate data types for each field
  for (const field in dataTypes) {
    if (!isValidDataType(req.body[field], dataTypes[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid DataType for ${field}`,
      });
    }
  }

  // Store validated data in req.validatedData and proceed to the next middleware
  req.validatedData = {
    variant,
    attributes,
  };
  next();
};

// Middleware function to validate data before editing variants
const validateEditVariants = (req, res, next) => {
  // Destructure and retrieve data from the request body
  const { id, name, attributes } = req.body;

  // Define expected data types for each field
  const dataTypes = {
    id: "number",
    name: "string",
    attributes: "string",
  };

  // Function to check if data types match the expected types
  const isValidDataType = (value, type) => {
    if (type === "number") {
      return !isNaN(value);
    } else if (type === "string") {
      return typeof value === "string";
    }
    return typeof value === type;
  };

  // Validate data types for each field
  for (const field in dataTypes) {
    if (!isValidDataType(req.body[field], dataTypes[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid DataType for ${field}`,
      });
    }
  }

  // Store validated data in req.validatedData and proceed to the next middleware
  req.validatedData = {
    id,
    name,
    attributes,
  };
  next();
};

// Export the validation middleware functions
module.exports = {
  validateAddVariants,
  validateEditVariants,
};
