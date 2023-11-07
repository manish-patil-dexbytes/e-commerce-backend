const multer = require("multer");
const path = require("path");

// Multer configuration for category  uploads
const storagePath = path.join(__dirname, "../storage/uploads");
const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storagePath); // destination for file uploads
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`); // Set the filename for uploaded files
  },
});

// Function to check if the file is an image
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true); // allow the upload if the file is an image
  } else {
    callback(null, new Error("Only Image is allowed")); // Reject the upload if the file is not an image
  }
};
const upload = multer({
  storage: imgconfig, // Set the storage configuration
  fileFilter: isImage, // Set the file filter
});

//====================================================
// Multer configuration for product uploads
const storagePathProduct = path.join(__dirname, "../storage/product");
const imgconfigs = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storagePathProduct); // Set the destination for product file uploads
  },
  filename: (req, file, callback) => {
    callback(null, `products-${Date.now()}.${file.originalname}`); // Set the filename for product uploaded files
  },
});

// Function to check if the file is an image or video
const isImageOrVideo = (req, file, callback) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    callback(null, true); // Allow the upload if the file is an image or video
  } else {
    callback(new Error("Only Image or Video is allowed")); // Reject the upload if the file is neither an image nor a video
  }
};
const productUpload = multer({
  storage: imgconfigs, // Set the storage configuration for product uploads
  fileFilter: isImageOrVideo, // Set the file filter for product uploads
});

module.exports = { upload, productUpload };
