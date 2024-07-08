const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Check if the user is admin
    User.findById(req.user.id).then(user => {
      if (user && user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }
    });
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
