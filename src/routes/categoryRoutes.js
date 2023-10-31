const {getCategories ,getParentCategory, addCategory,viewCategory,editCategory,updateCategoryStatus,getImagePath} = require("../controllers/category.Controllers");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const path =require("path");
//===============================================
const storagePath = path.join(__dirname, "../storage/uploads");

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storagePath);
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(null, new Error("Only Image is allowed"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});
    
router.get("/get-categories", getCategories);
router.put("/status/:id", updateCategoryStatus); // Renamed the route to explicitly indicate the status update
router.get("/parent-category", getParentCategory);
router.post("/add-category", upload.single("image"), addCategory);
router.put("/edit-category", upload.single("image"), editCategory); // Renamed the route to specify the category update
router.use("/uploads", express.static(path.join(__dirname, "../storage/uploads")));
router.get("/:id", viewCategory); // Updated the route to explicitly specify the category view
router.get("/categories/:id", getImagePath);

module.exports = router;
//================================

