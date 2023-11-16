const { db } = require("../db/connection");


//model to get variants data
const getVariants = (callback) => {
  try {
    const query = `
      SELECT v.id, v.name, GROUP_CONCAT(va.attribute) AS attributes
      FROM variants v
      JOIN variant_attributes va ON v.id = va.variant_id   
      GROUP BY v.id, v.name;
    `;

    db.query(query, (error, results) => {
      if (error) {
        throw error;
      } else {
        callback(null, results);
      }
    });
  } catch (error) {
    callback(error, null);
  }
};

//================================================
 //model for updating the existing variants and attributes
const updateVariants = (id, name, attributes, callback) => {
  try {
    const variantQuery = `UPDATE variants SET name = ? WHERE id = ?`; // variant update query
    const v_queries = [name, id];
    const attributesArray = attributes.split(",").map((attribute) => [id, attribute]); // converting string into object

    // Check for duplicates in attributes array
    const duplicateValues = attributesArray.filter(
      (value, index, self) =>
        index !== self.findIndex((v) => JSON.stringify(v) === JSON.stringify(value))
    );

    if (duplicateValues.length > 0) {
      throw "Duplicate attribute values are not allowed.";
    }

    const deleteAttributesQuery = "DELETE FROM variant_attributes WHERE variant_id = ?"; // deleting existing attributes of variant
    const insertAttributeQuery = "INSERT INTO variant_attributes (variant_id, attribute) VALUES ?"; // inserting new attributes for variant

    db.query(variantQuery, v_queries, (err, result) => {
      if (err) {
        throw err;
      } else {
        db.query(deleteAttributesQuery, id, (err, result) => {
          if (err) {
            throw err;
          } else {
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
    callback(error, null);
  }
};
//================================================
//exporting data for controllers
module.exports = {
  getVariants,
  updateVariants,
};
