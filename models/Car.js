const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  make: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  model: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String },
    ar: { type: String }
  },
  year: { type: Number, required: true },
  priceUsd: { type: Number, required: true },
  priceEgp: { type: Number, required: true },
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);