const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // Ensure you create this middleware
const User = require('../models/User');

// Fetch all users
router.get('/users', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Delete a user
router.delete('/users/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
