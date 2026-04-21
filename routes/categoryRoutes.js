const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// FETCH ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const list = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// ADD NEW CATEGORY
router.post('/', async (req, res) => {
  try {
    // Expecting: { name_en: "...", name_ar: "..." }
    const { name_en, name_ar } = req.body;
    
    const newCategory = new Category({ 
      name_en, 
      name_ar 
    });
    
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error during creation" });
  }
});

module.exports = router;