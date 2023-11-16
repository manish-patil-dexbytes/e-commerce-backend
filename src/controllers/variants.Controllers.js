const variantModel = require("../models/varientModels");
const generalModels = require("../models/generalModels");


const addVariants = (req, res) => {
  try {
    const { variant, attributes } = req.body;
    // Define the fields and values for the variants
    const variantFields = ['name'];
    const variantValues = [variant];

    generalModels.insertData('variants', variantFields, variantValues, (err, result) => {
      if (err) {
        console.error('Failed to add variants:', err);
        return res.status(500).json({ success: false, message: 'Failed to add data' });
      }

      const variantId = result; // Assuming result holds the variantId
      const attributeFields = ['variant_id', 'attribute'];

      // Insert the attribute data into the database one at a time
      attributes.forEach(attribute => {
        const attributeData = [variantId, attribute];
        generalModels.insertData('variant_attributes', attributeFields, attributeData, (err, result) => {
          if (err) {
            console.error('Failed to add attributes:', err);
            return res.status(500).json({ success: false, message: 'Failed to add data' });
          }
          // You might add additional code here if needed
        });
      });

      res.json({ success: true, message: 'Data added successfully' });
    });
  } catch (error) {
    console.error('Exception in addVariants:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
//=================================================
//controller to get the saved variants and its attributes from db
const getVariants = (req, res) => {
  try {
    variantModel.getVariants((error, results) => {
      if (error) {
        console.error("Error fetching variants:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch data" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Exception in getVariants:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//==================================================
//controller to delete the variants
const deleteVariant = (req, res) => {
  try {
    const variantId = req.params.id;
    const variant = "variants";
    const id = "id";
    const attribute = "variant_attributes";
    const variant_id = "variant_id";

    generalModels.deleteDataById(attribute, variant_id, variantId, (err, result) => {
      if (err) {
        console.error("Failed to delete variant attributes:", err);
        return res.status(500).json({ success: false, message: "Failed to delete variant attributes" });
      }
      
      generalModels.deleteDataById(variant, id, variantId, (err, result) => {
        if (err) {
          console.error("Failed to delete variant:", err);
          return res.status(500).json({ success: false, message: "Failed to delete variant" });
        }
        res.json({
          success: true,
          message: "Variant and its attributes deleted successfully",
        });
      });
    });
  } catch (error) {
    console.error('Exception in deleteVariant:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//==============================================================
//controller to update variants
const updateVariant = (req, res) => {
  try {
    const { id, name, attributes } = req.body;

    variantModel.updateVariants(id, name, attributes, (err, result) => {
      if (err) {
        console.error("Failed to update variants", err);
        return res.status(500).json({ success: false, message: "Failed to update" });
      }
      res.json({ success: true, message: "Data updated successfully" });
    });
  } catch (error) {
    console.error('Exception in updateVariant:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
module.exports = {
  addVariants,
  getVariants,
  deleteVariant,
  updateVariant,
};
