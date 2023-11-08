const variantModel = require("../models/varientModels");
const generalModels = require("../models/generalModels");


const addVariants = (req, res) => {
  const { variant, attributes } = req.body;
  // Define the fields and values for the variants
  const variantFields = ['name'];
  const variantValues = [variant];

  generalModels.insertData('variants', variantFields, variantValues, (err, result) => {
    if (err) {
      console.error('Failed to add variants:', err);
      res.status(500).json({ success: false, message: 'Failed to add data' });
    } else {
      const variantId = result; // Assuming result holds the variantId
      const attributeFields = ['variant_id', 'attribute'];

      // Insert the attribute data into the database one at a time
      attributes.forEach(attribute => {
        const attributeData = [variantId, attribute];
        generalModels.insertData('variant_attributes', attributeFields, attributeData, (err, result) => {
          if (err) {
            console.error('Failed to add attributes:', err);
            res.status(500).json({ success: false, message: 'Failed to add data' });
          } else {
            // You might add additional code here if needed
          }
        });
      });

      res.json({ success: true, message: 'Data added successfully' });
    }
  });
};

//controller to get the saved variants and its attributes from db
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
//controller to delete the variants
const deleteVariant = (req, res) => {
  // Extracting the variant ID from the request parameters
  const variantId = req.params.id;
  const variant = "variants";
  const id = "id";
  const attribute = "variant_attributes";
  const variant_id = "variant_id";

  generalModels.deleteDataById(
    attribute,
    variant_id,
    variantId,
    (err, result) => {
      if (err) {
        console.error("Failed to delete variant:", err);
        res
          .status(500)
          .json({ success: false, message: "Failed to delete variant" });
      } else {
        generalModels.deleteDataById(variant, id, variantId, (err, result) => {
          res.json({
            success: true,
            message: "Variant and its attributes deleted successfully",
          });
        });
      }
    }
  );
};
//controller to update variants
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
