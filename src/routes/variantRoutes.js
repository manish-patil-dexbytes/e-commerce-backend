const express = require("express");
const router = express.Router();
const {
  addVariants,
  getVariants,
  deleteVariant,
  updateVariant
} = require("../controllers/variants.Controllers");

// Route to add a new variant
router.post("/add-variant", addVariants);

// Route to get all variants
router.get("/get-variant", getVariants);

// Route to delete a variant
router.delete("/deleteVariant/:id", deleteVariant);

// Route to update a variant
router.put("/update-variant", updateVariant);

module.exports = router;
