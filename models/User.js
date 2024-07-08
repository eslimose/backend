const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    default: false // Ensure this is set to true for the admin user
  }
});

module.exports = mongoose.model('User', UserSchema);
