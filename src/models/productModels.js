const { db } = require("../db/connection");
const moment = require("moment");

//========================================================
//function to get all the products 
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
(
    SELECT JSON_ARRAYAGG(v.id)
    FROM (
        SELECT DISTINCT pv.variant_id AS id
        FROM product_variants pv
        WHERE pv.product_id = p.product_id
    ) AS v
) AS variants,
(
    SELECT JSON_OBJECTAGG(variant_id, attributes)
    FROM (
        SELECT pv.variant_id AS variant_id, JSON_ARRAYAGG(va.id) AS attributes
        FROM product_variants pv
        JOIN variant_attributes va ON pv.attribute_id = va.id
        WHERE pv.product_id = p.product_id
        GROUP BY pv.variant_id
    ) AS variant_attributes
) AS attributes,
GROUP_CONCAT(m.image) AS images
FROM product p 
LEFT JOIN category c ON p.category_id = c.id 
LEFT JOIN category c2 ON c.parent_id = c2.id 
LEFT JOIN media m ON p.product_id = m.product_id 
LEFT JOIN product_variants pv ON p.product_id = pv.product_id 
GROUP BY p.product_id;
`;

    const result = await db.promise().query(sql);
    callback(null, result[0]);
  } catch (err) {
    callback(err, null);
  }
};

//=========================================================
//function to edit the products
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
    variants,
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
  const deleteVariantsQuery = `DELETE FROM product_variants WHERE product_id = ?`;
  const insertVariantsQuery = `INSERT INTO product_variants (product_id, variant_id, attribute_id) VALUES ?`;

  try {
    db.query(updateProductQuery, updateParams, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        const handleMediaAndVariants = () => {
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
        };

        if (!variants || variants.length === 0) {
          db.query(deleteVariantsQuery, id, (err, result) => {
            if (err) {
              callback(err, null);
            } else {
              handleMediaAndVariants(); // Handle media based on conditions
            }
          });
        } else {
          const variantValues = variants.map((variant) =>
            variant.attributes.map((attribute) => [
              id,
              variant.variant,
              attribute,
            ])
          );
          const flattenedVariantValues = variantValues.flat(1);

          db.query(deleteVariantsQuery, id, (err, result) => {
            if (err) {
              callback(err, null);
            } else {
              db.query(
                insertVariantsQuery,
                [flattenedVariantValues],
                (err, result) => {
                  if (err) {
                    callback(err, null);
                  } else {
                    handleMediaAndVariants(); // Handle media based on conditions
                  }
                }
              );
            }
          });
        }
      }
    });
  } catch (err) {
    callback(err, null);
  }
};

module.exports = { getProducts, editProduct };
