const express = require("express");
const router = express.Router();
const {
  addProduct,
  deleteProduct,
  getProducts,
  editProduct,
  updateProductStatus,
  getCategories,
} = require("../controllers/product.Controllers");
const { productUpload } = require("../helpers/multerConfig");

// Route to delete a product
router.delete("/deleteProduct/:id", deleteProduct);

// Route to add a new product
router.post("/add-product", productUpload.array("images", 5), addProduct);

// Route to get all products
router.get("/get-products", getProducts);

// Route to edit a product
router.put("/edit-product", productUpload.array("media", 5), editProduct);

// Route to update the status of a product
router.put("/product-status/status/:id", updateProductStatus);

// Route to get all categories
router.get("/categories", getCategories);

module.exports = router;
