const { db } = require("../db/connection");


const  updateStatus = (table, id, status, callback) => {
    // SQL query to update the status of a record in the specified table
    const sql = `UPDATE ${table} SET status = ? WHERE ${table === "category" ? "id" : "product_id"} = ?`;
    db.query(sql, [status, id], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, "Record updated successfully");
      }
    });
  };

  const deleteDataById = (tableName, columnName, id, callback) => {
    const deleteQuery = `DELETE FROM ${tableName} WHERE ${columnName} = ?`;
  
    db.query(deleteQuery, id, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  };
  
  const insertData = (tableName, fields, values, callback) => {
    const insertSql = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${values.map((val) => '?').join(', ')})`;
    db.query(insertSql, values, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result.insertId);
      }
    });
  };


  //================================
  const updateData = (tableName, updateFields, updateValues, whereCondition, callback) => {
    const updateQuery = `UPDATE ${tableName} SET ${updateFields.map(field => `${field} = ?`).join(', ')} WHERE ${whereCondition}`;
    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  };
  //========================================
  const updateMedia = (tableName, updateFields, updateValues, whereCondition, deleteCondition, callback) => {
    const deleteQuery = `DELETE FROM ${tableName} WHERE ${deleteCondition}`;
    db.query(deleteQuery, (deleteErr, deleteResult) => {
      if (deleteErr) {
        callback(deleteErr, null);
      } else {
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
  };
  
  module.exports ={updateStatus,deleteDataById,insertData,updateData,updateMedia}