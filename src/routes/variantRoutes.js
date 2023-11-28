const express = require("express");
const router = express.Router();
const {
  addVariants,
  getVariants,
  deleteVariant,
  updateVariant
} = require("../controllers/variants.Controllers");
const { validateAddVariants, validateEditVariants } = require("../middleware/variantsValidate");
const { verifyToken } = require("../middleware/jwtMiddleware");

// Route to add a new variant
router.post("/add-variant",verifyToken,validateAddVariants,addVariants);

// Route to get all variants
router.get("/get-variant",verifyToken, getVariants);

// Route to delete a variant
router.delete("/deleteVariant/:id",verifyToken, deleteVariant);

// Route to update a variant
router.put("/update-variant",verifyToken,validateEditVariants, updateVariant);

module.exports = router;
