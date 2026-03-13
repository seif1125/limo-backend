const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  subtitle: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  imageUrl: { type: String, required: true },
  button1: {
    // This MUST be an object with 'en' and 'ar' to match your payload
    text: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" }
    },
    link: { type: String, default: "" }
  }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);