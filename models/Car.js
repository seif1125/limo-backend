const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { en: String, ar: String },
  brand: String, // e.g., Mercedes, Rolls Royce
  images: [String],
  pricePerDay: Number,
  features: { en: [String], ar: [String] },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);