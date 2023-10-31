const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 4500;
const { db } = require("./src/db/connection");

// Importing routes
const login = require("./src/routes/adminLogin");
//============================
const getCategory = require("./src/routes/categoryRoutes");
const updateCategoryStatus = require("./src/routes/categoryRoutes");
const getParentCategory = require("./src/routes/categoryRoutes");
const addCategorys = require("./src/routes/categoryRoutes");

//==========================================================
const viewCategory = require("./src/routes/categoryRoutes");
const editCategory = require("./src/routes/categoryRoutes");
const addProduct = require("./src/routes/productRoutes");
const deleteProduct = require("./src/routes/productRoutes");
const getProducts = require("./src/routes/productRoutes");
const editProduct =require("./src/routes/productRoutes");
const updateProductStatus=require("./src/routes/productRoutes");
const getTreeCategories = require("./src/routes/productRoutes");

app.use(
  "/api/category-image-uploades",
  express.static(path.join(__dirname, "./src/storage/uploads"))
);
app.use(bodyParser.json());
app.use(cors());

app.use("/api/admin", login);
//===================================
app.use("/api", getProducts);
app.use("/api", addProduct);
app.use("/api/deleteProduct", deleteProduct);
app.use('/api',editProduct);
app.use('/api',getTreeCategories);
// app.use("/api",getProducts);
//=============================================
app.use("/api/product-status",updateProductStatus)
app.use("/api", getCategory);
app.use("/api/categories-status", updateCategoryStatus);
app.use("/api", getParentCategory);
app.use("/api/view-categories", viewCategory);
app.use("/api", addCategorys);
app.use("/api", editCategory);
//=============================================

//===============================================
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
