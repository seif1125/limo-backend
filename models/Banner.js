const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true }, // URL to the image
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  subtitle: {
    en: { type: String },
    ar: { type: String }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);