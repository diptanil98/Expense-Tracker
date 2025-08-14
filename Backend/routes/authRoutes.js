// Backend/routes/authRoutes.js (register + login)
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  console.log('req.body:', req.body); // Add this line
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ status: 'fail', message: 'username, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ username, email, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    user.password = undefined;

    res.status(201).json({ status: 'success', token, data: { user } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    user.password = undefined;

    res.status(200).json({ status: 'success', token, data: { user } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

module.exports = router;