const { validateText, validateInput } = require("../helpers/validations");
const categoryModel = require("../models/categoryModels");
const generalModels = require("../models/generalModels");

//fething the category data
const getCategories = (req, res) => {
  try {
    categoryModel.getAllCategories((err, result) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Error fetching data" });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.error("Error in fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

//=======================================================
//controller to  change status 
const updateCategoryStatus = (req, res) => {
  try {
    const table = "category";
    let id = req.params.id;
    const { status } = req.body;

    generalModels.updateStatus(table, id, status, (err, message) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Error in updating status" });
      } else {
        res.json({ message: message });
      }
    });
  } catch (error) {
    console.error("Error in updateCategoryStatus:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//=======================================================
//fething parent categories
const getParentCategory = (req, res) => {
  try {
    categoryModel.getParentCategory((err, results) => {
      if (err) {
        console.error("Error querying MySQL:", err);
        res.status(500).json({ error: "Database error" });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error("Error in getParentCategory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//=========================================================
//adding new category
const addCategory = (req, res) => {
  try {
    const { category_name, parent_category, description, status } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!validateText(category_name) || !validateText(description)) {
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
      parent_id = parent_category; // parent_category holds the id of the parent category
    }

    const fields = ["category_name", "parent_id", "description", "status"];
    const values = [category_name, parent_id, description, status];

    generalModels.insertData("category", fields, values, (err, categoryId) => {
      if (err) {
        console.error("Failed to insert data into the category table:", err);
        res.status(500).json({ success: false, message: "Failed to add data" });
      } else {
        const mediaFields = ["category_id", "image"];
        const mediaValues = [categoryId, image];

        generalModels.insertData(
          "media",
          mediaFields,
          mediaValues,
          (err, result) => {
            if (err) {
              console.error("Failed to insert data into the files table:", err);
              res
                .status(500)
                .json({ success: false, message: "Failed to add data" });
            } else {
              res.json({ success: true, message: "Data added successfully" });
            }
          }
        );
      }
    });
  } catch (error) {
    console.error("Error in addCategory:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//========================================================
//geting category data for selected id
const viewCategory = (req, res) => {
  try {
    const categoryId = req.params.id;

    categoryModel.getCategoryById(categoryId, (err, result) => {
      if (err) {
        console.error("Database query error: " + err.stack);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(result[0]);
    });
  } catch (error) {
    console.error("Error in viewCategory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//========================================================
//editing the existing category
const editCategory = (req, res) => {
  try {
    const { id, category_name, parent_category, description } = req.body;
    const image = req.file ? req.file.filename : null;

    let parent_id = null;
    // Check if parent_category is a number before assigning it to parent_id
    if (parent_category && !isNaN(parent_category)) {
      parent_id = parseInt(parent_category); // parent_category holds the ID of the parent category
    }

    categoryModel.updateCategory(
      id,
      category_name,
      parent_id,
      description,
      (err, result) => {
        if (err) {
          console.error("Failed to update data in the category table:", err);
          res
            .status(500)
            .json({ success: false, message: "Failed to update data" });
        } else {
          if (image) {
            categoryModel.updateMedia(image, id, (err, result) => {
              if (err) {
                console.error("Failed to update data in the files table:", err);
                res
                  .status(500)
                  .json({ success: false, message: "Failed to update data" });
              } else {
                res.json({ success: true, message: "Data updated successfully" });
              }
            });
          } else {
            res.json({ success: true, message: "Data updated successfully" });
          }
        }
      }
    );
  } catch (error) {
    console.error("Error in editCategory:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//==========================================================
module.exports = {
  getCategories,
  getParentCategory,
  updateCategoryStatus,
  addCategory,
  viewCategory,
  editCategory,
};
