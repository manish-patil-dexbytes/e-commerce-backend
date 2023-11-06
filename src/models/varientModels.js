const { db } = require("../db/connection");

const addVariants = (variant, attributes, callback) => {
  const variantQuery = "INSERT INTO variants (name) VALUES (?)";
  const attributeQuery =
    "INSERT INTO variant_attributes (variant_id, attribute) VALUES ?";
  db.query(variantQuery, [variant], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      const variantId = result.insertId;
      const attributeData = attributes.map((attribute) => [
        variantId,
        attribute,
      ]);
      db.query(attributeQuery, [attributeData], (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      });
    }
  });
};

const getVariants = (callback) => {
  const query = `
    SELECT v.id, v.name, GROUP_CONCAT(va.attribute) AS attributes
    FROM variants v
    JOIN variant_attributes va ON v.id = va.variant_id
    GROUP BY v.id, v.name;
  `;
  db.query(query, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};
const deleteVariant = (variantId, callback) => {
  const deleteAttributesQuery =
    "DELETE FROM variant_attributes WHERE variant_id = ?";
  const deleteVariantQuery = "DELETE FROM variants WHERE id = ?";

  db.query(deleteAttributesQuery, variantId, (err, attributesResult) => {
    if (err) {
      callback(err, null);
    } else {
      db.query(deleteVariantQuery, variantId, (err, variantResult) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, "Variant and its attributes deleted successfully");
        }
      });
    }
  });
};
//================================================
 
const updateVariants = (id, name, attributes, callback) => {
  const variantQuery = `UPDATE variants SET name = ? WHERE id = ?`;
  const v_queries = [name, id];
  const attributesArray = attributes.split(",").map((attribute) => [id, attribute]); // converting string into object

  // Check for duplicates in attributesArray
  const duplicateValues = attributesArray.filter(
    (value, index, self) =>
      index !== self.findIndex((v) => JSON.stringify(v) === JSON.stringify(value))
  );

  if (duplicateValues.length > 0) {
    return callback("Duplicate attribute values are not allowed.", null);
    
  
  }

  const deleteAttributesQuery = "DELETE FROM variant_attributes WHERE variant_id = ?";
  const insertAttributeQuery =
    "INSERT INTO variant_attributes (variant_id, attribute) VALUES ?";

  db.query(variantQuery, v_queries, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      db.query(deleteAttributesQuery, id, (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          db.query(insertAttributeQuery, [attributesArray], (err, result) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, result);
            }
          });
        }
      });
    }
  });
};

//================================================
module.exports = {
  addVariants,
  getVariants,
  deleteVariant,
  updateVariants,
};
