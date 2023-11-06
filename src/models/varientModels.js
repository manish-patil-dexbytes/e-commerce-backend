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
      const attributeData = attributes.map((attribute) => [variantId, attribute]);
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

module.exports = {
  addVariants,
  getVariants,
};
