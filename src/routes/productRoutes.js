const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  addProduct,
  deleteProduct,
  getProducts,
  editProduct,
  updateProductStatus,
  getCategories,
} = require("../controllers/product.Controllers");
//=====================================================================
const storagePath = path.join(__dirname, "../storage/product");

var imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storagePath); // all product images stored in product folder
  },
  filename: (req, file, callback) => {
    callback(null, `products-${Date.now()}.${file.originalname}`);
  },
});

const isImageOrVideo = (req, file, callback) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    callback(null, true);
  } else {
    callback(new Error("Only Image or Video is allowed"));
  }
};

var upload = multer({
  storage: imgconfig,
  fileFilter: isImageOrVideo,
});
//=====================================================================

router.delete("/:id", deleteProduct);
//===========================================================================
router.post("/add-product", upload.array("images", 5), addProduct);
//==========================================================================
router.get("/get-products", getProducts);
// router.get("/get-products", getProducts);
router.put("/edit-product", upload.array("media", 5), editProduct);
//===========================================================
router.put("/status/:id", updateProductStatus);
//==========================================================
router.get("/categories", getCategories);

module.exports = router;
