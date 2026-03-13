const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const cloudinary = require('cloudinary').v2;

// 1. GET ALL CARS
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET SINGLE CAR (For the Edit Page)
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. ADD NEW CAR
router.post('/', async (req, res) => {
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(400).json({ message: "Validation Error", details: err.errors });
  }
});

// 4. EDIT CAR
router.put('/:id', async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: true }
    );
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ message: "Update failed", details: err.errors });
  }
});

// 5. DELETE CAR & CLOUDINARY IMAGES
// routes/carRoutes.js
// routes/carRoutes.js
// routes/carRoutes.js
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // SAFE CLOUDINARY LOGIC
    if (car.images && Array.isArray(car.images)) {
      for (const url of car.images) {
        try {
          // Check if url is a valid string before splitting
          if (typeof url === 'string' && url.includes('cloudinary')) {
            const publicId = url.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image: ${publicId}`);
          }
        } catch (cloudinaryErr) {
          // If cloudinary fails, log it but DON'T crash the request
          console.error("Cloudinary asset skip:", url);
        }
      }
    }

    // FINAL DATABASE DELETE
    await car.deleteOne();
    
    res.status(200).json({ 
      success: true, 
      message: "Car deleted successfully from database" 
    });

  } catch (err) {
    // This will print the EXACT reason for the 500 error in your terminal
    console.error("CRITICAL DELETE ERROR:", err); 
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: err.message 
    });
  }
});// routes/carRoutes.js
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // SAFE CLOUDINARY LOGIC
    if (car.images && Array.isArray(car.images)) {
      for (const url of car.images) {
        try {
          // Check if url is a valid string before splitting
          if (typeof url === 'string' && url.includes('cloudinary')) {
            const publicId = url.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image: ${publicId}`);
          }
        } catch (cloudinaryErr) {
          // If cloudinary fails, log it but DON'T crash the request
          console.error("Cloudinary asset skip:", url);
        }
      }
    }

    // FINAL DATABASE DELETE
    await car.deleteOne();
    
    res.status(200).json({ 
      success: true, 
      message: "Car deleted successfully from database" 
    });

  } catch (err) {
    // This will print the EXACT reason for the 500 error in your terminal
    console.error("CRITICAL DELETE ERROR:", err); 
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: err.message 
    });
  }
});
module.exports = router;