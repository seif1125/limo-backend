const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Test Route to verify connection
// @route   GET /api/auth/test
router.get('/test', (req, res) => {
  res.json({ message: "Auth route is working! Ready for login." });
});

// @desc    Admin Login
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ username });
    
    // 2. Validate password using the method in User model
    if (user && (await user.matchPassword(password))) {
      
      // 3. Create JWT Token
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
      );

      // 4. Send response
      res.json({
        _id: user._id,
        username: user.username,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;