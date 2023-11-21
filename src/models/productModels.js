const { query } = require("express");
const { db } = require("../db/connection");
const moment = require("moment");

//========================================================
const getProducts = async (callback) => {
  try {
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

    const result = await db.promise().query(sql);
    callback(null, result[0]);
  } catch (err) {
    callback(err, null);
  }
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

  try {
    db.query(updateProductQuery, updateParams, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (images && images.length > 0) {
          db.query(deleteMediaQuery, id, (err, result) => {
            if (err) {
              throw err;
            } else {
              const imageValues = images.map((image) => [image, id]);
              db.query(insertMediaQuery, [imageValues], (err, result) => {
                if (err) {
                  throw err;
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
  } catch (err) {
    callback(err, null);
  }
};
//=========================================================
module.exports = {
  getProducts,
  editProduct,
};
