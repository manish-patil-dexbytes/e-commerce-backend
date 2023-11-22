const moment = require("moment");
const productModel = require("../models/productModels");
const generalModels = require("../models/generalModels");
const { response } = require("express");
//===================================================================
// Function to delete an existing product
const deleteProduct = (req, res) => {
  try {
    const productId = req.params.id;
    const productTable = "product";
    const mediaTable = "media";
    const productVariantTable = "product_variants"; 
    const column = "product_id";

    // Delete product variants associated with the product first
    generalModels.deleteDataById(
      productVariantTable,
      column,
      productId,
      (err, result) => {
        if (err) {
          console.error("Error deleting product variants:", err);
          res.status(500).json({ error: "Failed to delete product variants" });
        } else {
          // If product variants deletion is successful, delete the media
          generalModels.deleteDataById(
            mediaTable,
            column,
            productId,
            (err, result) => {
              if (err) {
                console.error("Error deleting media:", err);
                res.status(500).json({ error: "Failed to delete media" });
              } else {
                // If media deletion is successful, delete the product
                generalModels.deleteDataById(
                  productTable,
                  column,
                  productId,
                  (err, result) => {
                    if (err) {
                      console.error("Error deleting product:", err);
                      res
                        .status(500)
                        .json({ error: "Failed to delete product" });
                    } else {
                      res.json({
                        success: true,
                        message: "Data deleted successfully",
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//======================================================================
//function to add product
const addProduct = async (req, res) => {
  try {
    // Extract required data from the request body
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

    // Insert product data
    generalModels.insertData(
      "product",
      fields,
      values,
      async (productErr, productId) => {
        if (productErr) {
          console.error("Failed to insert product data:", productErr);
          return res
            .status(500)
            .json({ success: false, message: "Failed to add product data" });
        }

        // If no variants and no images selected, return success
        if (variants && variants.length === 0 && images.length === 0) {
          return res.json({
            success: true,
            message: "Product added successfully without variants and images",
          });
        }

        // Insert variants data
        if (variants && variants.length > 0) {
          let insertionCount = 0;
          for (const variant of variants) {
            const variantId = variant.variant;
            for (const attribute of variant.attributes) {
              const VariantValues = [productId, variantId, attribute];
              const variantFields = [
                "product_id",
                "variant_id",
                "attribute_id",
              ];
              await new Promise((resolve, reject) => {
                generalModels.insertData(
                  "product_variants",
                  variantFields,
                  VariantValues,
                  (variantErr, variantResult) => {
                    if (variantErr) {
                      console.error("Failed to add variants", variantErr);
                    } else {
                      insertionCount++;
                      if (insertionCount === variants.length) {
                        // If all variants inserted, proceed to handle images
                        handleImages(productId, images, res);
                      }
                    }
                    resolve();
                  }
                );
              });
            }
          }
        } else {
          // If no variants selected, handle images directly
          handleImages(productId, images, res);
        }
      }
    );
  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Function to handle image insertion
const handleImages = (productId, images, res) => {
  // Handle image insertion if images are present
  if (images.length > 0) {
    let successCount = 0;
    images.forEach((image, index) => {
      const mediaFields = ["product_id", "image"];
      const mediaValues = [productId, image];

      generalModels.insertData(
        "media",
        mediaFields,
        mediaValues,
        (mediaErr, mediaResult) => {
          if (mediaErr) {
            console.error("Failed to insert media data:", mediaErr);
          } else {
            successCount++;
            if (successCount === images.length) {
              res.json({
                success: true,
                message: "Product and Images data added successfully",
              });
            }
          }
        }
      );
    });
  } else {
    // If no images, return success
    res.json({
      success: true,
      message: "Product added successfully without images",
    });
  }
};
//=======================================================================
// Function to fetch all saved products
const getProducts = (req, res) => {
  try {
    productModel.getProducts((err, result) => {
      if (err) {
        console.error("Error retrieving products:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    console.error("Exception in getProducts:", error);
    res.status(500).send("Internal Server Error");
  }
};

//================================================================
// Function to edit an existing product
const editProduct = (req, res) => {
  try {
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
      variants,
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
      variants,
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
  } catch (error) {
    console.error("Exception in editProduct:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//========================================================================
// Function to update the status of a product
const updateProductStatus = (req, res) => {
  try {
    const table = "product"; // Assuming the table name is passed as a parameter
    const id = req.params.id;
    const { status } = req.body;

    // Call the utility function to update the status
    generalModels.updateStatus(table, id, status, (err, message) => {
      if (err) {
        console.error("Error updating product status:", err);
        res.status(500).json({ error: "Error in updating status" });
      } else {
        res.json({ message: message });
      }
    });
  } catch (error) {
    console.error("Exception in updateProductStatus:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//========================================================================
const getCategories = async (req, res) => {
  try {
    const columnsToRetrieve = [
      "id AS category_id",
      "category_name",
      "parent_id",
    ]; // Define the columns you want to retrieve
    const categoriesData = await generalModels.SelectQuery(
      "category",
      columnsToRetrieve
    );
    res.json(categoriesData);
  } catch (error) {
    console.error("Error fetching categories data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//================================================
const getVariants = async (req, res) => {
  try {
    const columnsToRetrieve = ["id", "name"]; // columns to retrieve
    const variantsData = await generalModels.SelectQuery(
      "variants",
      columnsToRetrieve
    );
    res.json(variantsData);
  } catch (error) {
    console.error("Error fetching variants data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAttributes = async (req, res) => {
  try {
    const columnToRetriev = ["id", "variant_id", "attribute"];
    const attributeData = await generalModels.SelectQuery(
      "variant_attributes",
      columnToRetriev
    );
    res.json(attributeData);
  } catch (error) {
    console.error("Error in fetching attributes");
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
  getVariants,
  getAttributes,
};
