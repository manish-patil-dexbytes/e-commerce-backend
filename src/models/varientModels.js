const { db } = require("../db/connection");

// Model to get variants data
const getVariants = (callback) => {
  try {
    // SQL query to retrieve variant data including attributes
    const query = `
      SELECT v.id, v.name, GROUP_CONCAT(va.attribute) AS attributes
      FROM variants v
      JOIN variant_attributes va ON v.id = va.variant_id   
      GROUP BY v.id, v.name;
    `;

    // Execute the query
    db.query(query, (error, results) => {
      if (error) {
        throw error;
      } else {
        callback(null, results);
      }
    });
  } catch (error) {
    // Handle any caught errors
    callback(error, null);
  }
};

//================================================

// Model for updating the existing variants and attributes
const updateVariants = (id, name, attributes, callback) => {
  try {
    // SQL query to update variant name
    const variantQuery = `UPDATE variants SET name = ? WHERE id = ?`; 
    const v_queries = [name, id];

    // Converting string of attributes into an array of objects
    const attributesArray = attributes.split(",").map((attribute) => [id, attribute]);

    // Check for duplicates in attributes array
    const duplicateValues = attributesArray.filter(
      (value, index, self) =>
        index !== self.findIndex((v) => JSON.stringify(v) === JSON.stringify(value))
    );

    if (duplicateValues.length > 0) {
      throw "Duplicate attribute values are not allowed.";
    }

    // SQL queries to delete existing attributes and insert new ones
    const deleteAttributesQuery = "DELETE FROM variant_attributes WHERE variant_id = ?";
    const insertAttributeQuery = "INSERT INTO variant_attributes (variant_id, attribute) VALUES ?";

    // Update variant name
    db.query(variantQuery, v_queries, (err, result) => {
      if (err) {
        throw err;
      } else {
        // Delete existing attributes for the variant
        db.query(deleteAttributesQuery, id, (err, result) => {
          if (err) {
            throw err;
          } else {
            // Insert new attributes for the variant
            db.query(insertAttributeQuery, [attributesArray], (err, result) => {
              if (err) {
                throw err;
              } else {
                callback(null, result);
              }
            });
          }
        });
      }
    });
  } catch (error) {
    // Handle any caught errors
    callback(error, null);
  }
};

//================================================

// Exporting data for controllers
module.exports = {
  getVariants,
  updateVariants,
};
