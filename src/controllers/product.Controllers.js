const moment = require("moment");
const productModel = require("../models/productModels");
//===================================================================
const deleteProduct = (req, res) => {
  const productId = req.params.id;

  productModel.deleteMediaByProductId(productId, (err, result) => {
    if (err) {
      console.error("Database query error" + err);
      res.status(500).json({ error: "data not deleted" });
    } else {
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
const addProduct = (req, res) => {
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

  const date = moment(launch_date);
  const formattedDate = date.format("DD/MM/yyyy");
  const images = req.files ? req.files.map((file) => file.filename) : [];

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
const editProduct = (req, res) => {
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
const updateProductStatus = (req, res) => {
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
const getCategories = async (req, res) => {
  try {
    const categories = await productModel.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//========================================================================
module.exports = {
  deleteProduct,
  addProduct,
  getProducts,
  editProduct,
  updateProductStatus,
  getCategories,
};
