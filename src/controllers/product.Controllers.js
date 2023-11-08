const moment = require("moment");
const productModel = require("../models/productModels");
const generalModels = require("../models/generalModels");
//===================================================================
// Function to delete an existing product
const deleteProduct = (req, res) => {
  const productId = req.params.id;
  const product = "product";
  const media = "media";
  const colum = "product_id";
  // Delete media associated with the product first
  generalModels.deleteDataById(media, colum, productId, (err, result) => {
    if (err) {
      console.error("Database query error" + err);
      res.status(500).json({ error: "data not deleted" });
    } else {
      // If media deletion is successful, delete the product
      generalModels.deleteDataById(product, colum, productId, (err, result) => {
        if (err) {
          console.error("failed to delete data");
          res.status(500).json({ error: "data not deleted" });
        } else {
          res.json({ success: true, message: "data deleted" });
        }
      });
    }
  });
};
//======================================================================
// const addProduct = (req, res) => {
//   // Extracting required data from the request body
//   let {
//     product_name,
//     category_name,
//     price,
//     discounted_price,
//     quantity,
//     SKU,
//     launch_date,
//     description,
//     status,
//   } = req.body;

//   // Format the date using moment.js
//   const date = moment(launch_date);
//   const formattedDate = date.format("DD/MM/yyyy");

//   // Extract images from the request
//   const images = req.files ? req.files.map((file) => file.filename) : [];

//   // Set up the fields and values for the insertData function
//   const fields = [
//     "product_name",
//     "category_id",
//     "price",
//     "discounted_price",
//     "quantity",
//     "SKU",
//     "lauch_date",
//     "description",
//     "status",
//   ];
//   const values = [
//     product_name,
//     category_name,
//     price,
//     discounted_price,
//     quantity,
//     SKU,
//     formattedDate,
//     description,
//     status,
//   ];

//   // Insert the product data into the database
//   generalModels.insertData(
//     "product",
//     fields,
//     values,
//     (productErr, productId) => {
//       if (productErr) {
//         console.error("Failed to insert product data:", productErr);
//         res
//           .status(500)
//           .json({ success: false, message: "Failed to add product data" });
//       } else {

//       }
//       {
//         // If product insertion is successful, insert associated media
//         let successCount = 0;
//         images.forEach((image, index) => {
//           const mediaFields = ["product_id", "image"];
//           const mediaValues = [productId, image];

//           generalModels.insertData(
//             "media",
//             mediaFields,
//             mediaValues,
//             (mediaErr, mediaResult) => {
//               if (mediaErr) {
//                 console.error("Failed to insert media data:", mediaErr);
//               } else {
//                 successCount++;
//                 if (successCount === images.length) {
//                   res.json({
//                     success: true,
//                     message: "Product and Media data added successfully",
//                   });
//                 }
//               }
//             }
//           );
//         });
//       }
//     }
//   );
// };
const addProduct = (req, res) => {
  // Extracting required data from the request body
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
  } = req.body;

  // Format the date using moment.js
  const date = moment(launch_date);
  const formattedDate = date.format("DD/MM/yyyy");

  // Extract images from the request
  const images = req.files ? req.files.map((file) => file.filename) : [];

  // Set up the fields and values for the insertData function
  const fields = [
    "product_name",
    "category_id",
    "price",
    "discounted_price",
    "quantity",
    "SKU",
    "lauch_date",
    "description",
    "status",
  ];
  const values = [
    product_name,
    category_name,
    price,
    discounted_price,
    quantity,
    SKU,
    formattedDate,
    description,
    status,
  ];

  // Insert the product data into the database
  generalModels.insertData("product", fields, values, (productErr, productId) => {
    if (productErr) {
      console.error("Failed to insert product data:", productErr);
      return res
        .status(500)
        .json({ success: false, message: "Failed to add product data" });
    }

    // If no images are provided, send the success response
    if (images.length === 0) {
      return res.json({
        success: true,
        message: "Product data added successfully",
      });
    }

    // If product insertion is successful, insert associated media
    let successCount = 0;
    images.forEach((image, index) => {
      const mediaFields = ["product_id", "image"];
      const mediaValues = [productId, image];

      generalModels.insertData("media", mediaFields, mediaValues, (mediaErr, mediaResult) => {
        if (mediaErr) {
          console.error("Failed to insert media data:", mediaErr);
        } else {
          successCount++;
          if (successCount === images.length) {
            res.json({
              success: true,
              message: "Product and Media data added successfully",
            });
          }
        }
      });
    });
  });
};


//=======================================================================
// Function to fetch all saved products
const getProducts = (req, res) => {
  productModel.getProducts((err, result) => {
    if (err) {
      console.error("Error retrieving products:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  });
};
//================================================================
// Function to edit an existing product
const editProduct = (req, res) => {
  // Extracting data from the request body
  const {
    id,
    product_name,
    category_id,
    price,
    discounted_price,
    quantity,
    launch_date,
    SKU,
    description,
  } = req.body;
  // Extract images from the request
  const images = req.files ? req.files.map((file) => file.filename) : [];

  const data = {
    id,
    product_name,
    category_id,
    price,
    discounted_price,
    quantity,
    launch_date,
    SKU,
    description,
    images,
  };
  // Call the model function to update the product
  productModel.editProduct(data, (err, message) => {
    if (err) {
      console.error("Error updating product:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res.json({
        success: true,
        message: message,
      });
    }
  });
};

//========================================================================
// Function to update the status of a product
const updateProductStatus = (req, res) => {
  const table = "product"; // Assuming the table name is passed as a parameter
  let id = req.params.id;
  const { status } = req.body;
  // Call the utility function to update the status
  generalModels.updateStatus(table, id, status, (err, message) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error in updating status" });
    } else {
      res.json({ message: message });
    }
  });
};
//========================================================================
// Function to fetch all categories and parent categories
const getCategories = async (req, res) => {
  try {
    // Fetch categories from the database
    const categories = await productModel.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//========================================================================
// Export all the defined functions as modules
module.exports = {
  deleteProduct,
  addProduct,
  getProducts,
  editProduct,
  updateProductStatus,
  getCategories,
};
