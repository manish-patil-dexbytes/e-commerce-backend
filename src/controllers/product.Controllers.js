const moment = require("moment");
const productModel = require("../models/productModels");
//===================================================================
// Function to delete an existing product
const deleteProduct = (req, res) => {
  const productId = req.params.id;
  // Delete media associated with the product first
  productModel.deleteMediaByProductId(productId, (err, result) => {
    if (err) {
      console.error("Database query error" + err);
      res.status(500).json({ error: "data not deleted" });
    } else {
      // If media deletion is successful, delete the product
      productModel.deleteProductById(productId, (err, result) => {
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
// Function to add a new product
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
  // Insert the product data into the database
  productModel.insertProduct(
    product_name,
    category_name,
    price,
    discounted_price,
    quantity,
    SKU,
    formattedDate,
    description,
    status,
    (productErr, productId) => {
      if (productErr) {
        console.error("Failed to insert product data:", productErr);
        res
          .status(500)
          .json({ success: false, message: "Failed to add product data" });
      } else {
        // If product insertion is successful, insert associated media
        let successCount = 0;
        images.forEach((image, index) => {
          productModel.insertMedia(
            productId,
            image,
            (mediaErr, mediaResult) => {
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
            }
          );
        });
      }
    }
  );
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
  // Extracting the product ID and status from the request
  let id = req.params.id;
  const { status } = req.body;

  productModel.updateProductStatus(id, status, (err, message) => {
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
