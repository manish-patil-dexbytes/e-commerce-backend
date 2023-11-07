const { db } = require("../db/connection");

// Function to get all categories with their parent categories and associated images
const getAllCategories = (callback) => {
  // SQL query to fetch categories
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

  // Execute the query
  db.query(sql, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

//=========================================================
// Function to update the status of a category
const updateCategoryStatus = (id, status, callback) => {
  // SQL query to update the category status
  const sql = "UPDATE category SET status=? WHERE id=?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

//==========================================================
// Function to get all parent categories
const getParentCategory = (callback) => {
  // SQL query to fetch parent categories
  const query = "SELECT id, category_name, status FROM category";
  db.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};
//================================================================
// Function to add a new category
const addCategory = (
  category_name,
  parent_id,
  description,
  status,
  callback
) => {
  // SQL query to insert a new category
  const categoryQuery =
    "INSERT INTO category (category_name, parent_id, description, status) VALUES (?, ?, ?, ?)";

  // Execute the query
  db.query(
    categoryQuery,
    [category_name, parent_id, description, status],
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};
//=====================================================
// Function to add media for a category
const addMedia = (category_id, image, callback) => {
  // SQL query to insert media for a category
  const filesQuery = "INSERT INTO media (category_id, image) VALUES (?, ?)";
  db.query(filesQuery, [category_id, image], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};
//=======================================================
// Function to get a category by its ID
const getCategoryById = (categoryId, callback) => {
  // SQL query to fetch a category by its ID
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
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

//========================================================
// Function to update a category
const updateCategory = (
  id,
  category_name,
  parent_id,
  description,
  callback
) => {
  let categoryQuery; // categoryQuery
  let queries;

  if (parent_id) {
    categoryQuery = `UPDATE category SET category_name=?, parent_id=?, description=? WHERE id=?`;
    queries = [category_name, parent_id, description, id];
  } else {
    categoryQuery = `UPDATE category SET category_name=?, description=? WHERE id=?`;
    queries = [category_name, description, id];
  }

  db.query(categoryQuery, queries, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

//==========================================================
// Function to update media for a category
const updateMedia = (image, category_id, callback) => {
  const filesQuery = `UPDATE media SET image=? WHERE category_id=?`;

  db.query(filesQuery, [image, category_id], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

//=========================================================
// Function to get the image path by category ID
const getImagePathByCategoryId = (categoryId, callback) => {
  const sql = "SELECT image FROM media WHERE category_id= ?";
  db.query(sql, [categoryId], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length === 0) {
        callback({ message: "Category not found" }, null);
      } else {
        const imagePath = results[0].image;
        callback(null, imagePath);
      }
    }
  });
};
//==========================================================
module.exports = {
  getAllCategories,
  updateCategoryStatus,
  getParentCategory,
  addCategory,
  addMedia,
  getCategoryById,
  updateCategory,
  updateMedia,
  getImagePathByCategoryId,
};
