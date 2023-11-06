// const { db } = require("../db/connection");
// const { validateText, validateInput } = require("../helpers/validations");

// const addVarients = (req, res) => {
//   const { variant, attributes } = req.body;

//   const variantQuery = "INSERT INTO variants (name) VALUES (?)";
//   const attributeQuery =
//     "INSERT INTO variant_attributes (variant_id, attribute) VALUES ?";

//   db.query(variantQuery, [variant], (err, result) => {
//     if (err) {
//       console.error("Failed to insert data into the variant table:", err);
//       res.status(500).json({ success: false, message: "Failed to add data" });
//     } else {
//       const variantId = result.insertId;
//       const attributeData = attributes.map((attribute) => [
//         variantId,
//         attribute,
//       ]);

//       db.query(attributeQuery, [attributeData], (err, result) => {
//         if (err) {
//           console.error("Failed to insert data into the files table:", err);
//           res
//             .status(500)
//             .json({ success: false, message: "Failed to add data" });
//         } else {
//           res.json({ success: true, message: "Data added successfully" });
//         }
//       });
//     }
//   });
// };
// const getVariants = (req, res) => {
//   const query = `
//     SELECT v.id, v.name, GROUP_CONCAT(va.attribute) AS attributes
//     FROM variants v
//     JOIN variant_attributes va ON v.id = va.variant_id
//     GROUP BY v.id, v.name;
//   `;

//   db.query(query, (error, results) => {
//     if (error) {
//       console.error("Error fetching data: ", error);
//       res.status(500).json({ success: false, message: "Failed to fetch data" });
//     } else {
//       res.json(results);
//     }
//   });
// };
// module.exports = {
//   addVarients,
//   getVariants,
// };
const varientModel= require("../models/varientModels");

const addVariants = (req, res) => {
  const { variant, attributes } = req.body;

  varientModel.addVariants(variant, attributes, (err, result) => {
    if (err) {
      console.error("Failed to add variants:", err);
      res.status(500).json({ success: false, message: "Failed to add data" });
    } else {
      res.json({ success: true, message: "Data added successfully" });
    }
  });
};

const getVariants = (req, res) => {
  varientModel.getVariants((error, results) => {
    if (error) {
      console.error("Error fetching variants:", error);
      res.status(500).json({ success: false, message: "Failed to fetch data" });
    } else {
      res.json(results);
    }
  });
};

module.exports = {
  addVariants,
  getVariants,
};