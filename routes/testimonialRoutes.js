const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonials'); // Ensure this path is correct

/**
 * @route   GET /api/testimonials
 * @desc    Get all testimonials (Public/Admin)
 */
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch testimonials", error: err.message });
    }
});

/**
 * @route   GET /api/testimonials/:id
 * @desc    Get a single testimonial (For Edit Page)
 */
router.get('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
        res.status(200).json(testimonial);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

/**
 * @route   POST /api/testimonials
 * @desc    Create a new testimonial (Admin)
 */
router.post('/', async (req, res) => {
  try {
      console.log("Data Received:", req.body); // Check if body is empty
      const newTestimonial = new Testimonial(req.body);
      const saved = await newTestimonial.save();
      res.status(201).json(saved);
  } catch (err) {
      console.error("POST Error Details:", err); // Look at your terminal for this!
      res.status(500).json({ 
          message: "Validation or Database Error", 
          error: err.message 
      });
  }
});

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update an existing testimonial (Admin)
 */
router.put('/:id', async (req, res) => {
    try {
        const updated = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true } // returns the updated doc and checks schema rules
        );
        if (!updated) return res.status(404).json({ message: "Testimonial not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: "Update failed", error: err.message });
    }
});

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Delete a testimonial (Admin)
 */
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Testimonial.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Testimonial not found" });
        res.status(200).json({ message: "Testimonial successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete operation failed", error: err.message });
    }
});

module.exports = router;