const express = require("express");
const router = express.Router();
const { addVariants,getVariants,deleteVariant,updateVariant} = require("../controllers/variants.Controllers");

//========================================================
router.post("/add-variant", addVariants);
router.get("/get-variant",getVariants);
router.delete("/deleteVariant/:id",deleteVariant)
router.put("/update-variant",updateVariant)
//=======================================================

module.exports = router;