const express = require("express");
const router = express.Router();
const {
  addProduct,
  deleteProduct,
  getProducts,
  editProduct,
  updateProductStatus,
  getCategories,
  getVariants,
  getAttributes,
} = require("../controllers/product.Controllers");
const { productUpload } = require("../helpers/multerConfig");
const { validateAddProduct, validateEditProduct } = require("../middleware/productsValidate");
const { validateStatusChange } = require("../middleware/categoriesValidate");
const { verifyToken } = require("../middleware/jwtMiddleware");

// Route to delete a product
router.delete("/deleteProduct/:id",verifyToken,deleteProduct);

// Route to add a new product
router.post("/add-product",verifyToken ,productUpload.array("images", 5),validateAddProduct, addProduct);

// Route to get all products
router.get("/get-products",verifyToken, getProducts);

// Route to edit a product
router.put("/edit-product",verifyToken, productUpload.array("media", 5),validateEditProduct, editProduct);

// Route to update the status of a product
router.put("/product-status/status/:id",verifyToken,validateStatusChange, updateProductStatus);

// Route to get all categories
router.get("/categories",verifyToken, getCategories);
router.get("/variants",verifyToken,getVariants);
router.get("/attributes",verifyToken,getAttributes);

module.exports = router;
