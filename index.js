const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 4500;

// Importing routes
const login = require("./src/routes/adminLogin");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const variantRoutes = require("./src/routes/variantRoutes");


app.use(bodyParser.json());
app.use(cors());
app.use("/api/category-image-uploades",express.static(path.join(__dirname, "./src/storage/uploads")));
app.use("/api/product-image-uploads",express.static(path.join(__dirname,"./src/storage/product")))

app.use("/api/admin", login);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", variantRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
