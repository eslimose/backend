const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User'); // Ensure this path is correct

const authMiddleware = (req, res, next) => {
  //Get token from header
  const token = req.header('x-auth-token');

  //Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
