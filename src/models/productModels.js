const { db } = require("../db/connection");
const moment = require("moment");



const deleteMediaByProductId = (productId, callback) => {
  const query_media = `DELETE FROM media WHERE product_id = ?;`;

  db.query(query_media, [productId], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

const deleteProductById = (productId, callback) => {
  const query_product = `DELETE FROM product WHERE  product_id =?;`;

  db.query(query_product, [productId], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};
//========================================================

const insertProduct = (
  product_name,
  category_id,
  price,
  discounted_price,
  quantity,
  SKU,
  formattedDate,
  description,
  status,
  callback
) => {
  const insertProductSql =
    "INSERT INTO product (product_name, category_id,  price, discounted_price, quantity, sku, lauch_date, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    insertProductSql,
    [
      product_name,
      category_id,
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
        callback(productErr, null);
      } else {
        const productId = productResult.insertId;
        callback(null, productId);
      }
    }
  );
};
//===========================================================
const insertMedia = (productId, image, callback) => {
  const insertMediaSql = "INSERT INTO media (product_id, image) VALUES (?,?)";
  db.query(insertMediaSql, [productId, image], (mediaErr, mediaResult) => {
    if (mediaErr) {
      callback(mediaErr, null);
    } else {
      callback(null, mediaResult);
    }
  });
};

//========================================================

const getProducts = (callback) => {
  let sql = `SELECT 
      p.product_id, 
      p.product_name,
      p.category_id, 
      c.category_name,
      p.description,
      p.sku,
      p.discounted_price, 
      p.price, 
      p.quantity, 
      p.status,
      p.lauch_date,
      GROUP_CONCAT(m.image) as images
    FROM product p 
    LEFT JOIN category c ON p.category_id = c.id 
    LEFT JOIN category c2 ON c.parent_id = c2.id
    LEFT JOIN media m ON p.product_id = m.product_id
    GROUP BY p.product_id;
    `;

  db.query(sql, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

//=========================================================
const editProduct = (data, callback) => {
  const {
    id,
    product_name,
    category_id,
    price,
    discounted_price,
    quantity,
    launch_date,
    SKU,
    description,
    images,
  } = data;

  let formattedDate = null;
  if (launch_date) {
    const date = moment(launch_date);
    formattedDate = date.format("DD/MM/yyyy");
  }

  let updateProductQuery;
  let updateParams;
  if (formattedDate !== "Invalid date") {
    updateProductQuery = `UPDATE product
        SET 
            product_name = ?,
            category_id = ?,
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
            category_id = ?,
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

  const deleteMediaQuery = `DELETE FROM media WHERE product_id = ?`;
  const insertMediaQuery = `INSERT INTO media (image, product_id) VALUES ?`;

  db.query(updateProductQuery, updateParams, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      if (images && images.length > 0) {
        db.query(deleteMediaQuery, id, (err, result) => {
          if (err) {
            callback(err, null);
          } else {
            const imageValues = images.map((image) => [image, id]);
            db.query(insertMediaQuery, [imageValues], (err, result) => {
              if (err) {
                callback(err, null);
              } else {
                callback(null, "Product and media updated successfully");
              }
            });
          }
        });
      } else {
        callback(null, "Product updated successfully");
      }
    }
  });
};

//=========================================================
const updateProductStatus = (id, status, callback) => {
  const sql = "UPDATE product SET status = ? where product_id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, "Record updated successfully");
    }
  });
};

//=========================================================
const getCategories = async () => {
  try {
    const [rows, fields] = await db
      .promise()
      .query(
        `SELECT  id as category_id, category_name, parent_id FROM category`
      );
    return rows;
  } catch (error) {
    throw error;
  }
};
//=========================================================
module.exports = {
  deleteMediaByProductId,
  deleteProductById,
  insertProduct,
  insertMedia,
  getProducts,
  editProduct,
  updateProductStatus,
  getCategories,
};
