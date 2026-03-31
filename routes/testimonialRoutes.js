const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonials');

/**
 * @route   GET /api/testimonials
 * @desc    Get all testimonials (Public/Admin)
 */
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch testimonials", error: err.message });
    }
});

/**
 * @route   POST /api/testimonials
 * @desc    Create a new testimonial (Admin)
 */
router.post('/', async (req, res) => {
    try {
        // req.body should now look like: { name, title, comment, rating, origin, image }
        const newTestimonial = new Testimonial(req.body);
        const saved = await newTestimonial.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("POST Error:", err);
        res.status(400).json({ 
            success: false, 
            message: "Validation Error", 
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
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Testimonial not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ success: false, message: "Update failed", error: err.message });
    }
});

/**
 * @route   DELETE /api/testimonials/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Testimonial.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Testimonial not found" });
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Delete failed", error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }
        res.status(200).json(testimonial);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;