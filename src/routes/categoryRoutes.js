const express = require("express");
const router = express.Router();
const {
  getCategories,
  getParentCategory,
  addCategory,
  viewCategory,
  editCategory,
  updateCategoryStatus,
  getImagePath,
} = require("../controllers/category.Controllers");
const multer = require("multer");
const path = require("path");

const storagePath = path.join(__dirname, "../storage/uploads");

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storagePath);
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(null, new Error("Only Image is allowed"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

router.get("/get-categories", getCategories);
router.put("/status/:id", updateCategoryStatus);
router.get("/parent-category", getParentCategory);
router.post("/add-category", upload.single("image"), addCategory);
router.put("/edit-category", upload.single("image"), editCategory);
router.use("/uploads", express.static(path.join(__dirname, "../storage/uploads")));
router.get("/view-categories/:id", viewCategory);
// router.get("/:id", viewCategory);

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const {
//   getCategories,
//   getParentCategory,
//   addCategory,
//   viewCategory,
//   editCategory,
//   updateCategoryStatus,
//   getImagePath,
// } = require("../controllers/category.Controllers");
// const multer = require("multer");
// const path = require("path");

// const storagePath = path.join(__dirname, "../storage/uploads");

// const imgconfig = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, storagePath);
//   },
//   filename: (req, file, callback) => {
//     callback(null, `image-${Date.now()}.${file.originalname}`);
//   },
// });

// const isImage = (req, file, callback) => {
//   if (file.mimetype.startsWith("image")) {
//     callback(null, true);
//   } else {
//     callback(null, new Error("Only Image is allowed"));
//   }
// };

// const upload = multer({
//   storage: imgconfig,
//   fileFilter: isImage,
// });

// // GET all categories
// router.get("/", getCategories);

// // Update category status by ID
// router.put("/:id/status", updateCategoryStatus);

// // GET parent categories
// router.get("/parent", getParentCategory);

// // Add a new category
// router.post("/", upload.single("image"), addCategory);

// // Edit a category by ID
// router.put("/:id", upload.single("image"), editCategory);

// // Serve uploaded images
// router.use("/uploads", express.static(path.join(__dirname, "../storage/uploads")));

// // GET a category by ID
// router.get("/:id", viewCategory);

// module.exports = router;
