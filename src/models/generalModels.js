const { db } = require("../db/connection");

// Function to perform a select query
const SelectQuery = async (tableName, columns) => {
  try {
    const cols = columns.join(', ');
    const sql = `SELECT ${cols} FROM ${tableName}`;
    const result = await db.promise().query(sql);
    return result[0];
  } catch (error) {
    throw error;
  }
};

// Function to update status in a table based on ID
const updateStatus = (table, id, status, callback) => {
  try {
    const sql = `UPDATE ${table} SET status = ? WHERE ${table === "category" ? "id" : "product_id"} = ?`;
    db.query(sql, [status, id], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, "Record updated successfully");
      }
    });
  } catch (error) {
    callback(error, null);
  }
};

// Function to delete data from a table by ID
const deleteDataById = (tableName, columnName, id, callback) => {
  try {
    const deleteQuery = `DELETE FROM ${tableName} WHERE ${columnName} = ?`;
    db.query(deleteQuery, id, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  } catch (error) {
    callback(error, null);
  }
};

// Function to insert data into a table
const insertData = (tableName, fields, values, callback) => {
  try {
    const insertSql = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${values.map((val) => '?').join(', ')})`;
    db.query(insertSql, values, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result.insertId);
      }
    });
  } catch (error) {
    callback(error, null);
  }
};

// Function to update data in a table based on a condition
const updateData = (tableName, updateFields, updateValues, whereCondition, callback) => {
  try {
    const updateQuery = `UPDATE ${tableName} SET ${updateFields.map(field => `${field} = ?`).join(', ')} WHERE ${whereCondition}`;
    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  } catch (error) {
    callback(error, null);
  }
};

// Function to update media in a table based on conditions
const updateMedia = (tableName, updateFields, updateValues, whereCondition, deleteCondition, callback) => {
  try {
    // Deleting existing media based on a condition
    const deleteQuery = `DELETE FROM ${tableName} WHERE ${deleteCondition}`;
    db.query(deleteQuery, (deleteErr, deleteResult) => {
      if (deleteErr) {
        callback(deleteErr, null);
      } else {
        // Updating media based on a condition after deletion
        const updateQuery = `UPDATE ${tableName} SET ${updateFields.map(field => `${field} = ?`).join(', ')} WHERE ${whereCondition}`;
        db.query(updateQuery, updateValues, (updateErr, updateResult) => {
          if (updateErr) {
            callback(updateErr, null);
          } else {
            callback(null, updateResult);
          }
        });
      }
    });
  } catch (error) {
    callback(error, null);
  }
};

module.exports = {
  updateStatus,
  deleteDataById,
  insertData,
  updateData,
  updateMedia,
  SelectQuery,
};
