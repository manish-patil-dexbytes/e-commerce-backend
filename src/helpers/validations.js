function validateEmail(email) {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
}
// Middleware to validate password format
function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
}

const validateText = (text) => {
  return text && text.trim().length > 0;
};

const validateInput= (text) => {
  const regex = /^[a-zA-Z ]+$/; // Regular expression to match only letters and spaces
  return text && text.trim().length > 0 && regex.test(text);
};
module.exports = {
  validateEmail,
  validatePassword,
  validateText,
  validateInput
};


// const { validateText, validateDescription, validateImage } = require('./validations');

// router.post("/add-category", upload.single("image"), (req, res) => {
//   const { category_name, parent_category, description, status } = req.body;
//   const image = req.file ? req.file.filename : null;

//   // Check if the required fields are not empty
//   if (!validateCategoryName(category_name) || !validateDescription(description) || !validateImage(image)) {
//     return res.status(400).json({ success: false, message: "Required fields are missing" });
//   }

//   // Rest of your code...
// });
