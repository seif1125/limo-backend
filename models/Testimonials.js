const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  // English and Arabic versions of the feedback
  content: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  // Rating out of 5 stars
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  // Optional: Link to a customer photo or company logo
  image: {
    type: String,
    default: ""
  },
  // For the admin to approve reviews before they go live on the site
  isApproved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);