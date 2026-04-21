const express = require('express');
const router = express.Router();

// 1. FIX: Ensure the import path and variable name match your file
// Based on your previous message, the file is likely 'ContactSettings.js'
const AppSettings = require('../models/AppSettings');
const ContactSettings = require('../models/Contacts'); 

// ==========================================
// GET /api/app-settings
// ==========================================
router.get('/', async (req, res) => {
  try {
    // Using .lean() for faster, read-only performance
    const [appSettings, contactSettings] = await Promise.all([
      AppSettings.findOne({ isGlobal: true }).lean(),
      ContactSettings.findOne({ isGlobal: true }).lean()
    ]);

    res.status(200).json({
      success: true,
      data: {
        // This structure matches your admin panel's expectations
        appSettings: appSettings || null,
        contactSettings: contactSettings || null
      }
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
});

// ==========================================
// PUT /api/app-settings
// ==========================================
router.put('/', async (req, res) => {
  try {
    const { appSettingsData, contactSettingsData } = req.body;
    
    // We store the results of the operations directly
    let updatedApp = null;
    let updatedContact = null;

    // Use await directly to capture the result of each operation
    if (appSettingsData) {
      updatedApp = await AppSettings.findOneAndUpdate(
        { isGlobal: true },
        { $set: appSettingsData },
        { new: true, upsert: true, runValidators: true }
      );
    }

    if (contactSettingsData) {
      updatedContact = await ContactSettings.findOneAndUpdate(
        { isGlobal: true },
        { $set: contactSettingsData },
        { new: true, upsert: true, runValidators: true }
      );
    }

    // Now these variables are defined and populated
    res.status(200).json({
      success: true,
      data: {
        appSettings: updatedApp,
        contactSettings: updatedContact
      }
    });

  } catch (error) {
    console.error("Settings update error:", error);
    // Returning here ensures the function stops if an error occurs
    return res.status(500).json({ success: false, message: "Failed to update settings" });
  }
});

module.exports = router;