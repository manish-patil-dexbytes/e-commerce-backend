const jwt = require('jsonwebtoken');

const generateToken = (req, res, next) => {
    const { email } = req.validatedData; // Assuming you've validated and obtained the email
  
    const token = jwt.sign({ email }, 'your_secret_key', { expiresIn: '1h' });
    req.token = token; // Set the token in the request object
    next();
  };

  const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    const tokenParts = token.split(' ');
    const actualToken = tokenParts[1]; // Extracting the token without 'Bearer ' prefix
   
    if (!actualToken) {
      return res.status(403).json({ message: 'Token not provided' });
    }
  
    jwt.verify(actualToken, 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid User' });
      }
      req.user = decoded; // Attach user data to the request object if needed
      next(); //  next route handler
    });
  };

  module.exports = { generateToken, verifyToken };