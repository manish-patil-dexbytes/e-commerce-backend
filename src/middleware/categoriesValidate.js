const validateAddCategory = (req, res, next) => {

  let { category_name, description, parent_category, status } = req.body;

  parent_category = parent_category ? Number(parent_category) : null;
  status = status ? Number(status) : null;

  // Define data types for each field
  const dataTypes = {
    category_name: 'string',
    description: 'string',
    parent_category: 'number',
    status: 'number',
  };

  // Function to check if the value matches the expected data type
  const isValidDataType = (value, type) => {
    if (type === 'number') {
      return !isNaN(value);
    } else if (type === 'string') {
      return String(value);
    }
    return typeof value === type;
  };
  // Check data types of incoming data
  for (const field in dataTypes) {
    if (!isValidDataType(req.body[field], dataTypes[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid data type for ${field}`,
      });
    }
  }
  req.validatedData ={
    category_name,
    description,
    parent_category,
    status
  }
  next();
};

const validateEditCategory = (req, res, next) => {
  let { category_name, description, parent_category, id } = req.body;

  // Convert id to a number if it exists
  id = id ? Number(id) : null;

  // Define data types for each field
  const dataTypes = {
    category_name: 'string',
    description: 'string',
    id: 'number',
  };
  // Function to check if the value matches the expected data type
  const isValidDataType = (value, type) => {
    if (type === 'number') {
      return !isNaN(value);
    } else if (type === 'string') {
      return typeof value === 'string';
    }
    return typeof value === type;
  };

  // Check data types of incoming data, excluding 'parent_category'
  for (const field in dataTypes) {
    if (field !== 'parent_category' && !isValidDataType(req.body[field], dataTypes[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid data type for ${field}`,
      });
    }
  }

  // Store validated data except 'parent_category'
  req.validatedData = {
    category_name,
    description,
    id,
    parent_category,
  };
  next();
};

const validateStatusChange = (req, res, next) => {
  let id = req.params.id;
  const { status } = req.body; // Destructure the status field from req.body
  id = id ? Number(id) : null;
  const dataTypes = {
    id: 'number',
    status: 'number'
  };
  // Validate data types
  const isValidDataType = (value, type) => {
    if (type === 'number') {
      return !isNaN(value);
    }else if(type==="string"){
      return String(value)
    }
    return typeof value === type;
  };
  if (!isValidDataType(id, dataTypes.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data type for id',
    });
  }
  if (!isValidDataType(status, dataTypes.status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data type for status',
    });
  }
  req.validatedData ={
    id,
    status
  }
  next();
};
module.exports ={ validateAddCategory,validateEditCategory,validateStatusChange}
