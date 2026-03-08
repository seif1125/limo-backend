const express = require('express');
const router = express.Router();
const Contact = require('../models/Contacts');

// GET single contact doc (Socials + Locations)
router.get('/', async (req, res) => {
  const contact = await Contact.findOne();
  res.json(contact || {});
});

// Update or Create contact info
router.post('/', async (req, res) => {
  const contact = await Contact.findOneAndUpdate({}, req.body, { upsert: true, new: true });
  res.json(contact);
});

module.exports = router;