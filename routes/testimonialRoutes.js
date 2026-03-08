const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonials');

router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json(testimonials);
});

router.post('/', async (req, res) => {
  const testimonial = new Testimonial(req.body);
  await testimonial.save();
  res.status(201).json(testimonial);
});

module.exports = router;