const express = require('express');
const router = express.Router();
const RentalRequest = require('../models/RentalRequest.js');

// Admin gets all requests
router.get('/', async (req, res) => {
  const requests = await RentalRequest.find().populate('car');
  res.json(requests);
});

// Customer submits a request
router.post('/', async (req, res) => {
  try {
    const request = new RentalRequest(req.body);
    await request.save();
    res.status(201).json({ message: "Request received", request });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;