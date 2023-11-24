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
const {validateAddCategory, validateEditCategory} = require("../middleware/categories");
// Route to get all categories
router.get("/get-categories", getCategories);
// Route to update category status
router.put("/categories-status/status/:id", updateCategoryStatus);
// Route to get parent categories
router.get("/parent-category", getParentCategory);
// Route to add a new category
router.post("/add-category", upload.single("image"), validateAddCategory,addCategory);
// Route to edit a category
router.put("/edit-category", upload.single("image"), validateEditCategory,editCategory);
// Route to view a specific category
router.get("/view-categories/:id", viewCategory);
module.exports = router;
