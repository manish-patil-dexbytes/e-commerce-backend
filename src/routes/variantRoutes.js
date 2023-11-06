const express = require("express");
const router = express.Router();
const { addVariants,getVariants } = require("../controllers/variants.Controllers");

//========================================================
router.post("/add-variant", addVariants);
router.get("/get-variant",getVariants);
//=======================================================

module.exports = router;