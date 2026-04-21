const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  // Global Field
  imageUrl: { type: String, required: true },
  buttonUrl: { type: String, default: '' },

  // Localized Fields (English)
  title_en: { type: String, required: true },
  subtitle_en: { type: String, required: true },
  buttonText_en: { type: String, default: '' },

  // Localized Fields (Arabic)
  title_ar: { type: String, required: true },
  subtitle_ar: { type: String, required: true },
  buttonText_ar: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);