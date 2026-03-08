const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');

// @desc    Get all banners
// @route   GET /api/banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new banner (For Admin Panel)
// @route   POST /api/banners
router.post('/', async (req, res) => {
  try {
    const newBanner = new Banner(req.body);
    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;