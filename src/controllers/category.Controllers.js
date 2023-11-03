  const { db } = require("../db/connection");
const { validateText, validateInput } = require("../helpers/validations");

const getCategories = (req, res) => {
  const sql = `SELECT 
  c1.id,
  c1.category_name AS category_name,
  c2.category_name AS parent_category,
  c1.status,
  c1.description,
  c1.parent_id,
  m.image
FROM category c1 
LEFT JOIN category c2 
  ON c1.parent_id = c2.id
LEFT JOIN media m 
  ON m.category_id = c1.id
`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data:", err); // Log the error for debugging
      res.status(500).json({ error: "Error fetching data" });
      return;
    }
    res.json(result);
  });
};
//=======================================================
const updateCategoryStatus = (req, res) => {
  let id = req.params.id;
  // Validate the id to ensure it is in the correct format
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const { status } = req.body;
  const sql = "UPDATE category SET status=? WHERE id=?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating record" });
      return;
    }
    res.json({ message: "Record updated successfully" });
  });
};

//=======================================================
const getParentCategory = (req, res) => {
  const query = "SELECT id, category_name,status FROM category";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error querying MySQL:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
};
//=========================================================

const addCategory = (req, res) => {
  const { category_name, parent_category, description, status } = req.body;
  const image = req.file ? req.file.filename : null;

  if (
    !validateText(category_name) ||
    !validateText(description) ||
    !validateText(image)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Required fields are missing" });
  } else if (!validateInput(category_name)) {
    return res
      .status(400)
      .json({ success: false, message: "Name should be characters" });
  }

  let parent_id = null;
  if (parent_category) {
    parent_id = parent_category; // Assuming parent_category holds the ID of the parent category
  }

  const categoryQuery =
    "INSERT INTO category (category_name, parent_id, description, status) VALUES (?, ?, ?, ?)";
  const filesQuery =
    "INSERT INTO media ( category_id, image) VALUES (LAST_INSERT_ID(), ?)";

  db.query(
    categoryQuery,
    [category_name, parent_id, description, status],
    (err, result) => {
      if (err) {
        console.error("Failed to insert data into the category table:", err);
        res.status(500).json({ success: false, message: "Failed to add data" });
      } else {
        // Get the last inserted category_id
        db.query(filesQuery, [image], (err, result) => {
          if (err) {
            console.error("Failed to insert data into the files table:", err);
            res
              .status(500)
              .json({ success: false, message: "Failed to add data" });
          } else {
            res.json({ success: true, message: "Data added successfully" });
          }
        });
      }
    }
  );
};
//========================================================
const viewCategory = (req, res) => {
  const categoryId = req.params.id;

  const query = `SELECT 
      c.category_name, 
      cp.category_name AS parent_name, 
      c.description, 
      c.status,  
      m.image 
    FROM  
      category c 
    LEFT JOIN 
      category cp ON c.parent_id = cp.id 
    LEFT JOIN  
      media m ON m.category_id = c.id 
    WHERE 
      c.id = ?;
    `;

  db.query(query, [categoryId], (err, result) => {
    if (err) {
      console.error("Database query error: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(result[0]);
  });
};

//========================================================
// const editCategory = (req, res) => {
//   const { id, category_name, parent_category, description } = req.body;
//   const image = req.file ? req.file.filename : null;

//   let parent_id = null;
//   if (parent_category) {
//     parent_id = parent_category; // Assuming parent_category holds the ID of the parent category
//   }

//   const categoryQuery = `UPDATE category SET category_name=?, parent_id=?, description=? WHERE id=?`;
//   const filesQuery = `UPDATE media SET  image=? WHERE category_id=?`;

//   db.query(
//     categoryQuery,
//     [category_name, parent_id, description, id],
//     (err, result) => {
//       if (err) {
//         console.error("Failed to update data in the category table:", err);
//         res
//           .status(500)
//           .json({ success: false, message: "Failed to update data" });
//       } else {
//         if (image) {
//           db.query(filesQuery, [image, id], (err, result) => {
//             if (err) {
//               console.error("Failed to update data in the files table:", err);
//               res
//                 .status(500)
//                 .json({ success: false, message: "Failed to update data" });
//             } else {
//               res.json({ success: true, message: "Data updated successfully" });
//             }
//           });
//         } else {
//           res.json({ success: true, message: "Data updated successfully" });
//         }
//       }
//     }
//   );
// };
const editCategory = (req, res) => {
  const { id, category_name, parent_category, description } = req.body;
  const image = req.file ? req.file.filename : null;

  let parent_id = null;
  let categoryQuery; // Declare categoryQuery here
  // Check if parent_category is a number before assigning it to parent_id
  if (parent_category && !isNaN(parent_category)) {
    parent_id = parseInt(parent_category); // Assuming parent_category holds the ID of the parent category
  }
  // Check if category_name is a number to determine whether to update the parent_id column
  let queries;
  if (parent_id) {
    categoryQuery = `UPDATE category SET category_name=?, parent_id=?, description=? WHERE id=?`;
    queries = [category_name, parent_id, description, id];
  } else {
    categoryQuery = `UPDATE category SET category_name=?, description=? WHERE id=?`;
    queries = [category_name, description, id];
  }

  const filesQuery = `UPDATE media SET image=? WHERE category_id=?`;

  db.query(categoryQuery, queries, (err, result) => {
    if (err) {
      console.error("Failed to update data in the category table:", err);
      res.status(500).json({ success: false, message: "Failed to update data" });
    } else {
      if (image) {
        db.query(filesQuery, [image, id], (err, result) => {
          if (err) {
            console.error("Failed to update data in the files table:", err);
            res.status(500).json({ success: false, message: "Failed to update data" });
          } else {
            res.json({ success: true, message: "Data updated successfully" });
          }
        });
      } else {
        res.json({ success: true, message: "Data updated successfully" });
      }
    }
  });
};

//==========================================================
// controllers/getImagePathController.js
const getImagePath = (req, res) => {
  const categoryId = req.params.id;
  // Query the database to get the image path for a specific category
  const sql = "SELECT image FROM media WHERE category_id= ?";
  db.query(sql, [categoryId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "Category not found" });
      } else {
        const imagePath = results[0].image;
        // Send the image path back to the client
        res.json({ imagePath });
      }
    }
  });
};
//==========================================================
module.exports = {
  getCategories,
  getParentCategory,
  updateCategoryStatus,
  addCategory,
  viewCategory,
  editCategory,
  getImagePath,
};
