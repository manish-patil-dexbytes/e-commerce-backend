// Middleware function to validate data before adding a product
const validateAddProduct = (req, res, next) => {
  // Destructure and retrieve data from the request body
  let {
    product_name,
    category_name,
    price,
    discounted_price,
    quantity,
    SKU,
    launch_date,
    description,
    status,
    variants,
  } = req.body;

  // Convert certain fields to their respective data types or null if not provided
  category_name = category_name ? Number(category_name) : null;
  price = price ? Number(price) : null;
  discounted_price = discounted_price ? Number(discounted_price) : null;
  quantity = quantity ? Number(quantity) : null;
  status = status ? Number(status) : null;

  // Define expected data types for each field
  const dataTypes = {
    product_name: "string",
    category_name: "number",
    price: "number",
    discounted_price: "number",
    quantity: "number",
    SKU: "string",
    launch_date: "string",
    description: "string",
    status: "number",
    variants: "object",
  };

  // Function to check if data types match the expected types
  const isValidDataType = (value, type) => {
    if (type === "number") {
      return !isNaN(value);
    } else if (type === "string") {
      return typeof value === "string";
    } else if (type === "object") {
      return Object(value);
    }
    return typeof value === type;
  };

  // Validate data types for each field
  for (const field in dataTypes) {
    if (!isValidDataType(req.body[field], dataTypes[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid data types for ${field}`,
      });
    }
  }

  // Store validated data in req.validatedData and proceed to the next middleware
  req.validatedData = {
    product_name,
    category_name,
    price,
    discounted_price,
    quantity,
    SKU,
    launch_date,
    description,
    status,
    variants,
  };
  next();
};

// Middleware function to validate data before editing a product
const validateEditProduct = (req, res, next) => {
  // Destructure and retrieve data from the request body
  let {
    id,
    product_name,
    category_id,
    price,
    discounted_price,
    quantity,
    launch_date,
    SKU,
    description,
    variants,
  } = req.body;

  // Convert id to number or null if not provided
  id = id ? Number(id) : null;

  // Define expected data types for each field
  const dataTypes = {
    id: "number",
    product_name: "string",
    category_id: "number",
    price: "number",
    discounted_price: "number",
    quantity: "number",
    launch_date: "string",
    SKU: "string",
    description: "string",
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

  // Validate data types for each field (except 'variants')
  for (const field in dataTypes) {
    if (
      field !== "variants" &&
      !isValidDataType(req.body[field], dataTypes[field])
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid DataType for ${field}`,
      });
    }
  }

  // Store validated data in req.validatedData and proceed to the next middleware
  req.validatedData = {
    id,
    product_name,
    category_id,
    price,
    discounted_price,
    quantity,
    launch_date,
    SKU,
    description,
    variants,
  };
  next();
};

// Export the validation middleware functions
module.exports = {
  validateAddProduct,
  validateEditProduct,
};
