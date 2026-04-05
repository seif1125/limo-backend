const express = require('express');
const router = express.Router();
const RentalRequest = require('../models/RentalRequest.js');

// 1. GET ALL (With Car Details)
router.get('/', async (req, res) => {
    try {
        const data = await RentalRequest.find()
            .populate('car')
            .sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. GET SINGLE (By ID with Car Details)
router.get('/:id', async (req, res) => {
    try {
        const data = await RentalRequest.findById(req.params.id).populate('car');
        
        if (!data) {
            return res.status(404).json({ message: "Reservation record not found" });
        }
        
        res.json(data);
    } catch (err) {
        // Handle invalid MongoDB IDs specifically
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid Reservation ID format" });
        }
        res.status(500).json({ message: err.message });
    }
});

// 2. CREATE NEW RESERVATION
router.post('/', async (req, res) => {
    try {
        const { cashDeposit, rate } = req.body;

        // Auto-calculate remaining balance
        // Note: 'rate' here is treated as the total agreed price for the booking
        const cashRemain = (rate || 0) - (cashDeposit || 0);

        const newRequest = new RentalRequest({
            ...req.body,
            cashRemain: cashRemain > 0 ? cashRemain : 0
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        console.error("POST RENTAL ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// 3. UPDATE STATUS & FINANCIALS (With Overlap Check)
router.put('/:id', async (req, res) => {
    const { status, cashDeposit, rate, additionalHours, additionalKms } = req.body;
    
    try {
        const currentRes = await RentalRequest.findById(req.params.id);
        if (!currentRes) return res.status(404).json({ message: "Reservation not found" });

        // A. FINANCIAL RE-CALCULATION
        // If the user updates the rate or deposit, we recalculate the remainder
        if (cashDeposit !== undefined || rate !== undefined) {
            const newRate = rate !== undefined ? rate : currentRes.rate;
            const newDeposit = cashDeposit !== undefined ? cashDeposit : currentRes.cashDeposit;
            currentRes.cashRemain = newRate - newDeposit;
            currentRes.cashDeposit = newDeposit;
            currentRes.rate = newRate;
        }

        // B. OVERLAP CHECK (Only if changing status to 'active')
        if (status === 'active' && currentRes.status !== 'active') {
            const overlap = await RentalRequest.findOne({
                _id: { $ne: currentRes._id }, 
                car: currentRes.car,
                status: 'active',
                $or: [
                    { 
                        fromDate: { $lt: currentRes.toDate }, 
                        toDate: { $gt: currentRes.fromDate } 
                    }
                ]
            });

            if (overlap) {
                return res.status(400).json({ 
                    message: `Conflict: Car is ACTIVE for another booking until ${new Date(overlap.toDate).toLocaleString()}` 
                });
            }
        }

        // C. APPLY OTHER UPDATES
        if (status) currentRes.status = status;
        if (additionalHours !== undefined) currentRes.additionalHours = additionalHours;
        if (additionalKms !== undefined) currentRes.additionalKms = additionalKms;

        await currentRes.save();
        res.json(currentRes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. DELETE
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await RentalRequest.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Reservation deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;