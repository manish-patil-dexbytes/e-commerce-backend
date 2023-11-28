const express = require("express");
const router = express.Router();
const { upload } = require("../helpers/multerConfig");
const {
  getCategories,
  getParentCategory,
  addCategory,
  viewCategory,
  editCategory,
  updateCategoryStatus,
} = require("../controllers/category.Controllers");
const {verifyToken } = require("../middleware/jwtMiddleware");
const {validateAddCategory, validateEditCategory,validateStatusChange} = require("../middleware/categoriesValidate");
// Route to get all categories
router.get("/get-categories", verifyToken,getCategories);
// Route to update category status
router.put("/categories-status/status/:id",verifyToken,validateStatusChange, updateCategoryStatus);
// Route to get parent categories
router.get("/parent-category",verifyToken, getParentCategory);
// Route to add a new category
router.post("/add-category", upload.single("image"),verifyToken, validateAddCategory,addCategory);
// Route to edit a category
router.put("/edit-category", upload.single("image"), verifyToken,validateEditCategory,editCategory);
// Route to view a specific category
router.get("/view-categories/:id", verifyToken,viewCategory);
module.exports = router;
