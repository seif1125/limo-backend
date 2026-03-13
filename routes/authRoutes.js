const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST: /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create User (This triggers the pre-save hook above)
    const user = await User.create({ name, email, password });

    // 3. Check for JWT_SECRET (Common cause of 500 errors)
    if (!process.env.JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // 4. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // ✅ FIX 3: Ensure a 201 status and JSON is sent
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    return res.status(500).json({ message: err.message });
  }
});

// POST: /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;