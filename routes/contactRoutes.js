const express = require('express');
const router = express.Router();
const Contact = require('../models/Contacts');

// GET contact info (Returns the first document found)
router.get('/', async (req, res) => {
    try {
        const contact = await Contact.findOne();
        res.json(contact || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE contact info (Upsert pattern)
router.post('/', async (req, res) => {
    try {
        const updated = await Contact.findOneAndUpdate(
            {}, // empty filter finds the first doc
            req.body,
            { upsert: true, new: true, runValidators: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;