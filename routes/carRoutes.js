const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const cloudinary = require('cloudinary').v2;

/**
 * HELPER: Validation check for Rental Logic
 * Ensures if Full Day is enabled, the required sub-fields exist.
 */
const validateRentalOptions = (data) => {
  if (data.rentalOptions?.isFullDayRental) {
    const { fullDayHours, limitKilometers, extraKmCost, extraHourCost } = data.rentalOptions;
    if (!fullDayHours || !limitKilometers || extraKmCost === undefined || extraHourCost === undefined) {
      return "Full Day Rental requires: hours, km limit, extra km cost, and extra hour cost.";
    }
  }
  return null;
};

// 1. GET ALL CARS (With Category Details)
router.get('/', async (req, res) => {
  try {
  
    const cars = await Car.find().populate('category');
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Database retrieval error", error: err.message });
  }
});
router.get('/featured', async (req, res) => {
  try {
    const featuredCars = await Car.find({ 
      featured: true, 
      isAvailable: true 
    })
    .populate('category')
    .sort({ createdAt: -1 }).lean();

    res.json(featuredCars);
  } catch (err) {
    res.status(500).json({ message: "Error fetching featured cars", error: err.message });
  }
});

router.get('/available', async (req, res) => {
  try {
    const visibleCars = await Car.find({ isAvailable: true })
      .populate('category')
      .sort({ createdAt: -1 });

    res.json(visibleCars);
  } catch (err) {
    res.status(500).json({ message: "Error fetching visible fleet", error: err.message });
  }
});

// 2. GET SINGLE CAR
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('category');
    if (!car) return res.status(404).json({ message: "Vehicle not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vehicle", error: err.message });
  }
});

// 3. ADD NEW CAR
router.post('/', async (req, res) => {
  const error = validateRentalOptions(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    // Re-populate category before sending back
    const populatedCar = await Car.findById(savedCar._id).populate('category');
    res.status(201).json(populatedCar);
  } catch (err) {
    res.status(400).json({ message: "Validation Error", error: err.message });
  }
});

// 4. EDIT CAR
router.put('/:id', async (req, res) => {
  const error = validateRentalOptions(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    // Note: { runValidators: true, context: 'query' } ensures Mongoose 
    // custom validators work on updates.
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: true, context: 'query' }
    ).populate('category');

    if (!updatedCar) return res.status(404).json({ message: "Vehicle not found" });
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

// 5. DELETE CAR & CLEANUP CLOUDINARY
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Vehicle not found" });

    // if (car.images && car.images.length > 0) {
    //   const deletePromises = car.images
    //     .filter(url => url.includes('cloudinary'))
    //     .map(url => {
    //       // 1. Get the path after '/upload/'
    //       const parts = url.split('/upload/');
    //       if (parts.length < 2) return Promise.resolve();

    //       // 2. Remove the version (e.g., v171444444/) and the extension (.jpg)
    //       const pathWithVersion = parts[1];
    //       const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, ''); 
    //       const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.'));

    //       console.log("Attempting to delete Cloudinary ID:", publicId);
    //       return cloudinary.uploader.destroy(publicId);
    //     });
      
    //   await Promise.allSettled(deletePromises);
    // }

    await car.deleteOne();
    res.status(200).json({ success: true, message: "Vehicle and assets removed" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Cleanup failed", details: err.message });
  }
});

module.exports = router;