const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      isActive: false,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const activationToken = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1d' });
    const activationUrl =  `http://localhost:3001/activate/${activationToken}`;

    const message = `<h1>Account Activation</h1>
                     <p>Please click the link below to activate your account</p>
                     <a href="${activationUrl}">Activate Account</a>`;

    // Send activation email
    await sendEmail(user.email, 'Account Activation', message);

    await user.save();

    res.json({ success: true, message: 'Registration successful. Please check your email for activation link.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Activate account
exports.activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    user.isActive = true;
    await user.save();

    res.json({ success: true, message: 'Account activated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1d' });
    user.resetToken = resetToken;
    await user.save();

    const resetUrl = `http://localhost:3001/reset-password/${resetToken}`;

    const message = `<h1>Password Reset</h1>
                     <p>Please click the link below to reset your password</p>
                     <a href="${resetUrl}">Reset Password</a>`;

    // Send password reset email
    await sendEmail(user.email, 'Password Reset', message);

    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = '';

    await user.save();

    await sendEmail(user.email, 'Password Reset', 'Your password has been reset. You can now log in with your new password.');

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return res.status(400).json({ success: false, message: 'Invalid credentials or account not activated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      'secret_key', // Use a secure key in production
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ success: true, token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
