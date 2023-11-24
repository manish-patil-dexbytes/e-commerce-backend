// Middleware to validate data types
// const validateAddCategory = (req, res, next) => {
//   const { category_name, description } = req.body;
//   let { parent_category, status } = req.body;

//   // Convert parent_category and status to numbers if they exist
  // parent_category = parent_category ? Number(parent_category) : null;
  // status = status ? Number(status) : null;

//   // Define data types for each field
//   const dataTypes = {
//     category_name: 'string',
//     parent_category: 'number',
//     description: 'string',
//     status: 'number',
//   };

//   // Function to check if the value matches the expected data type
//   const isValidDataType = (value, type) => {
//     if (type === 'number') {
//       return !isNaN(value);
//     } else if (type === 'boolean') {
//       return value === true || value === false || value === 'true' || value === 'false';
//     }
//     return typeof value === type;
//   };

//   // Check data types of incoming data
//   for (const field in dataTypes) {
//     if (!isValidDataType(req.body[field], dataTypes[field])) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid data type for ${field}`,
//       });
//     }
//   }
//   next();
// };
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
    } else if (type === 'boolean') {
      return value === true || value === false || value === 'true' || value === 'false';
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
  next();
};

const validateEditCategory = (req, res, next) => {
  const { category_name, description,  } = req.body;
  let { parent_category,id } = req.body;

  // Convert parent_category and id to numbers if they exist
  parent_category = parent_category ? Number(parent_category) : null;
  id = id ? Number(id) : null;

  // Define data types for each field
  const dataTypes = {
    category_name: 'string',
    description: 'string',
    parent_category: 'number',
    id: 'number',
  };

  // Function to check if the value matches the expected data type
  const isValidDataType = (value, type) => {
    if (type === 'number') {
      return !isNaN(value);
    } else if (type === 'boolean') {
      return value === true || value === false || value === 'true' || value === 'false';
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
  next();
};


module.exports ={ validateAddCategory,validateEditCategory}
