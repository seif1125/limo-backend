const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true }
  },
  title: {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true }
  },
  text: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  imageUrl: { 
    type: String, 
    required: [true, "A profile image is required for testimonials"] 
  }
}, { 
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Optional: Add an index if you plan to search by name frequently
testimonialSchema.index({ 'name.en': 1, 'name.ar': 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);