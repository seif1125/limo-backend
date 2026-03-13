const express = require('express');
const router = express.Router();
const RentalRequest = require('../models/RentalRequest');

// GET all reservations
router.get('/', async (req, res) => {
    try {
        const data = await RentalRequest.find().populate('car').sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Status with Overlap Check
router.put('/status/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const currentRes = await RentalRequest.findById(req.params.id);
        if (!currentRes) return res.status(404).json({ message: "Reservation not found" });

        // If trying to set to ACTIVE, check for date overlaps
        if (status === 'active') {
            const overlap = await RentalRequest.findOne({
                _id: { $ne: currentRes._id }, // Don't check against itself
                car: currentRes.car,
                status: 'active',
                $or: [
                    { fromDate: { $lte: currentRes.toDate }, toDate: { $gte: currentRes.fromDate } }
                ]
            });

            if (overlap) {
                return res.status(400).json({ 
                    message: `Conflict: This car is already ACTIVE for another booking from ${new Date(overlap.fromDate).toLocaleDateString()} to ${new Date(overlap.toDate).toLocaleDateString()}` 
                });
            }
        }

        currentRes.status = status;
        await currentRes.save();
        res.json(currentRes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE Reservation
router.delete('/:id', async (req, res) => {
    try {
        await RentalRequest.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;