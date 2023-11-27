const validateAddProduct = (req, res, next) => {
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
  category_name = category_name ? Number(category_name) : null;
  price = price ? Number(price) : null;
  discounted_price = discounted_price ? Number(discounted_price) : null;
  quantity = quantity ? Number(quantity) : null;
  status = status ? Number(status) : null;

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

  const isValidDataType = (value, type) => {
    if (type === "number") {
      return !isNaN(value);
    } else if (type === "string") {
      return String(value);
    } else if (type === "object") {
      return Object(value);
    }
    return typeof value === type;
  };

  for (const field in dataTypes) {
    if (!isValidDataType(req.body[field], dataTypes[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid data types for ${field}`,
      });
    }
  }
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

const validateEditProduct = (req, res, next) => {
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
  id = id ? Number(id) : null;
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
  const isValidDataType = (value, type) => {
    if (type === "number") {
      return !isNaN(value);
    } else if (type === "string") {
      return typeof value === "string";
    }
    return typeof value === type;
  };
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
module.exports = {
  validateAddProduct,
  validateEditProduct,
};
