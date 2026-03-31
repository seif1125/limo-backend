const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const cloudinary = require('cloudinary').v2;

// 1. GET ALL
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST (With Limit)
router.post('/', async (req, res) => {
  try {
    const count = await Banner.countDocuments();
    if (count >= 2) {
      return res.status(400).json({ message: "Maximum of 2 banners allowed." });
    }

    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ message: "Validation failed", errors: err.errors });
  }
});

// 3. DELETE (With Cloudinary Cleanup)
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // 1. SAFE CLOUDINARY CLEANUP
    try {
      // Check if imageUrl exists and is a string
      if (typeof banner.imageUrl === 'string' && banner.imageUrl.includes('res.cloudinary.com')) {
        const parts = banner.imageUrl.split('/');
        const lastPart = parts[parts.length - 1]; // e.g., "v12345/sample.jpg"
        const publicId = lastPart.split('.')[0]; // e.g., "sample"

        console.log("Deleting from Cloudinary:", publicId);
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cloudErr) {
      // We log but don't stop the process if Cloudinary fails
      console.error("Cloudinary Cleanup Warning:", cloudErr.message);
    }

    // 2. DELETE FROM DATABASE
    await Banner.findByIdAndDelete(req.params.id);

    res.json({ message: "Banner removed successfully" });
  } catch (error) {
    console.error("DELETE ROUTE ERROR:", error);
    res.status(500).json({ 
      message: "Server failed to delete banner", 
      error: error.message 
    });
  }
});

module.exports = router;