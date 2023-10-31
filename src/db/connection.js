const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Manish@14",
  database: "ecommerce",
});
// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});
module.exports = {
  db
};
