const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinary');

// @route   GET /api/banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    console.error("GET BANNERS ERROR:", error); // This shows in your terminal
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/banners
router.post('/', async (req, res) => {
  try {
    const count = await Banner.countDocuments();
    if (count >= 2) {
      return res.status(400).json({ message: "Limit reached: Maximum 2 banners allowed." });
    }

    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    // LOG THE REAL REASON IN THE TERMINAL
    console.log("--- DATABASE VALIDATION ERROR ---");
    console.log(error.message); 
    
    // SEND THE REASON BACK TO THE FRONTEND
    res.status(400).json({ 
      message: "Validation Failed", 
      details: error.errors // This contains the specific field names that failed
    });
  }
});
// @route   DELETE /api/banners/:id
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    // 1. Better Public ID Extraction
    try {
      if (banner.imageUrl && banner.imageUrl.includes('res.cloudinary.com')) {
        const parts = banner.imageUrl.split('/');
        // This gets the part after /upload/ (usually includes v12345/filename)
        const uploadIndex = parts.findIndex(part => part === 'upload') + 2; 
        const pathParts = parts.slice(uploadIndex);
        const publicIdWithExtension = pathParts.join('/');
        const publicId = publicIdWithExtension.split('.')[0];

        console.log("Attempting to delete from Cloudinary:", publicId);
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cloudErr) {
      console.error("Cloudinary error (Skipping):", cloudErr.message);
      // We don't crash the server here; we move on to delete the DB record
    }

    // 2. Delete from MongoDB
    await banner.deleteOne();

    res.json({ message: "Banner and image removed successfully" });
  } catch (error) {
    console.error("DELETE ROUTE CRASH:", error);
    res.status(500).json({ message: "Server failed to delete banner" });
  }
});
module.exports = router;