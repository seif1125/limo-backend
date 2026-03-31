// routes/settingsRoutes.js
const express = require('express');
const router = express.Router();

// Import your models directly into the route file
const AppSettings = require('../models/AppSettings');
const ContactSettings = require('../models/Contacts');

// ==========================================
// GET /api/settings
// Fetch both App and Contact settings
// ==========================================
router.get('/', async (req, res) => {
  try {
    // Fetch both simultaneously for maximum speed
    const [appSettings, contactSettings] = await Promise.all([
      AppSettings.findOne({ isGlobal: true }).lean(),
      ContactSettings.findOne({ isGlobal: true }).lean()
    ]);

    res.status(200).json({
      success: true,
      data: {
        appSettings: appSettings || null,
        contactSettings: contactSettings || null
      }
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ==========================================
// PUT /api/settings
// Update App and Contact settings from Admin Panel
// ==========================================
// routes/settingsRoutes.js

router.put('/', async (req, res) => {
  try {
    const { appSettingsData, contactSettingsData } = req.body;
    let updatedApp = null;
    let updatedContact = null;

    // 1. Only update AppSettings if data was sent
    if (appSettingsData) {
      updatedApp = await AppSettings.findOneAndUpdate(
        { isGlobal: true }, 
        { $set: appSettingsData }, // Using $set is safer
        { new: true, upsert: true, runValidators: true }
      );
    }

    // 2. Only update ContactSettings if data was sent
    if (contactSettingsData) {
      updatedContact = await ContactSettings.findOneAndUpdate(
        { isGlobal: true }, 
        { $set: contactSettingsData }, 
        { new: true, upsert: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: { 
        appSettings: updatedApp, 
        contactSettings: updatedContact 
      }
    });
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    });
  }
});

module.exports = router;