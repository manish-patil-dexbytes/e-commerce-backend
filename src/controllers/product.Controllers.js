const { db } = require("../db/connection");
const moment = require("moment");

//===================================================================
const deleteProduct = (req, res) => {
  const productId = req.params.id;
  const query_media = `DELETE FROM media WHERE product_id = ?;`;
  const query_product = `DELETE FROM product WHERE  product_id =?;`;

  db.query(query_media, [productId], (err, result) => {
    if (err) {
      console.error("Database query error" + err);
      res.status(500).json({ error: "data not deleted" });
    } else {
      db.query(query_product, [productId], (err, result) => {
        if (err) {
          console.error("failed to delete data");
        } else {
          res.json({ success: true, message: " data deleted " });
        }
      });
    }
  });
};
//======================================================================
const addProduct = (req, res) => {
  let {
    product_name,
    category_name,
    price,
    discounted_price,
    quantity,
    SKU,
    launch_date,
    description,
    status,
  } = req.body;

  const date = moment(launch_date);
  const formattedDate = date.format("DD/MM/yyyy");
  const images = req.files ? req.files.map((file) => file.filename) : [];

  const insertProductSql =
    "INSERT INTO product (product_name, category_id,  price, discounted_price, quantity, sku, lauch_date, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    insertProductSql,
    [
      product_name,
      category_name,
      price,
      discounted_price,
      quantity,
      SKU,
      formattedDate,
      description,
      status,
    ],
    (productErr, productResult) => {
      if (productErr) {
        console.error("Failed to insert product data:", productErr);
        res
          .status(500)
          .json({ success: false, message: "Failed to add product data" });
      } else {
        const productId = productResult.insertId;

        const insertMediaSql =
          "INSERT INTO media (product_id, image) VALUES (?,?)";
        let successCount = 0;
        images.forEach((image, index) => {
          db.query(
            insertMediaSql,
            [productId, image],
            (mediaErr, mediaResult) => {
              if (mediaErr) {
                console.error("Failed to insert media data:", mediaErr);
              } else {
                successCount++;
                if (successCount === images.length) {
                  res.json({
                    success: true,
                    message: "Product and Media data added successfully",
                  });
                }
              }
            }
          );
        });
      }
    }
  );
};
//=======================================================================
const getProducts = (req, res) => {
  let sql = `SELECT p.product_id, p.product_name,p.category_id, c.category_name,p.description,p.sku,p.discounted_price, p.price, p.quantity, p.status ,p.lauch_date
  FROM product p 
  LEFT JOIN category c ON p.category_id = c.id 
  LEFT JOIN category c2 ON c.parent_id = c2.id`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving products:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  });
};
//================================================================
const editProduct = (req, res) => {
  let {
    id,
    product_name,
    category_id,
    price,
    discounted_price,
    quantity,
    launch_date,
    SKU,
    description,
  } = req.body;

  let formattedDate = null;
  if (launch_date) {
    const date = moment(launch_date);
    formattedDate = date.format("DD/MM/yyyy");
  }
  const images = req.files ? req.files.map((file) => file.filename) : [];
  let updateProductQuery;
  let updateParams;
  if (formattedDate != "Invalid date") {
    updateProductQuery = `UPDATE product
      SET 
          product_name = ?,
          category_id =?,
          price = ?,
          discounted_price = ?,
          quantity = ?,
          lauch_date = ?,
          SKU = ?,
          description = ?
        
      WHERE
          product_id = ?;`;
    updateParams = [
      product_name,
      category_id,
      price,
      discounted_price,
      quantity,
      formattedDate,
      SKU,
      description,
      id,
    ];
  } else {
    updateProductQuery = `UPDATE product
      SET 
          product_name = ?,
          category_id =?,
          price = ?,
          discounted_price = ?,
          quantity = ?,
          SKU = ?,
          description = ?
      WHERE
          product_id = ?`;
    updateParams = [
      product_name,
      category_id,
      price,
      discounted_price,
      quantity,
      SKU,
      description,
      id,
    ];
  }

  const updateMedia = `UPDATE media SET image = ? WHERE product_id = ?`;

  db.query(updateProductQuery, updateParams, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      let successCount = 0;
      if (images.length > 0) {
        images.forEach((image, index) => {
          db.query(updateMedia, [image, id], (err, result) => {
            if (err) {
              console.error("Failed to update media", err);
            } else {
              successCount++;
              if (successCount === images.length) {
                res.json({
                  success: true,
                  message: "Product and media updated successfully",
                });
              }
            }
          });
        });
      } else {
        res.json({
          success: true,
          message: "Product updated successfully",
        });
      }
    }
  });
};

//========================================================================
const updateProductStatus = (req, res) => {
  let id = req.params.id;
  const { status } = req.body;
  const sql = "UPDATE product SET status =? where product_id =?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error in updating status" });
      return;
    }
    res.json({ message: "Record update successfully" });
  });
};
//========================================================================
const getCategories = async (req, res) => {
  try {
    const [rows, fields] = await db
      .promise()
      .query(
        `SELECT  id as category_id, category_name, parent_id FROM category`
      );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//========================================================================
module.exports = {
  deleteProduct,
  addProduct,
  getProducts,
  editProduct,
  updateProductStatus,
  getCategories,
};
