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

