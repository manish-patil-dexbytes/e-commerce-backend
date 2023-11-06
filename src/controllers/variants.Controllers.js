
const variantModel= require("../models/varientModels");

const addVariants = (req, res) => {
  const { variant, attributes } = req.body;

  variantModel.addVariants(variant, attributes, (err, result) => {
    if (err) {
      console.error("Failed to add variants:", err);
      res.status(500).json({ success: false, message: "Failed to add data" });
    } else {
      res.json({ success: true, message: "Data added successfully" });
    }
  });
};

const getVariants = (req, res) => {
  variantModel.getVariants((error, results) => {
    if (error) {
      console.error("Error fetching variants:", error);
      res.status(500).json({ success: false, message: "Failed to fetch data" });
    } else {
      res.json(results);
    }
  });
};
const deleteVariant = (req, res) => {
  const variantId = req.params.id;

  variantModel.deleteVariant(variantId, (err, result) => {
    if (err) {
      console.error("Failed to delete variant:", err);
      res.status(500).json({ success: false, message: "Failed to delete variant" });
    } else {
      res.json({ success: true, message: "Variant and its attributes deleted successfully" });
    }
  });
};

const updateVariant = (req, res) => {
  const { id, name, attributes } = req.body;

  variantModel.updateVariants(id, name, attributes, (err, result) => {
    if (err) {
      console.error("Failed to update variants", err);
      res.status(500).json({ success: false, message: "Failed to update" });
    } else {
      res.json({ success: true, message: "Data updated successfully" });
    }
  });
};

module.exports = {
  addVariants,
  getVariants,
  deleteVariant,
  updateVariant,
};