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
    // Destructure based on the specific keys sent from your frontend
    const { appSettings, contactSettings } = req.body;
    
    let updatedApp = null;
    let updatedContact = null;

    // Use a Promise array to update both in parallel if both are provided
    const updatePromises = [];

    if (appSettings) {
      updatePromises.push(
        AppSettings.findOneAndUpdate(
          { isGlobal: true },
          { $set: appSettings },
          { new: true, upsert: true, runValidators: true }
        ).then(res => updatedApp = res)
      );
    }

    if (contactSettings) {
      updatePromises.push(
        ContactSettings.findOneAndUpdate(
          { isGlobal: true },
          { $set: contactSettings },
          { new: true, upsert: true, runValidators: true }
        ).then(res => updatedContact = res)
      );
    }

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Settings synchronized successfully",
      data: {
        appSettings: updatedApp,
        contactSettings: updatedContact
      }
    });
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error saving configuration" 
    });
  }
});

module.exports = router;