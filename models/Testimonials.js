const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  comment: { 
    type: String, 
    required: true 
  }, // Changed from 'text' to 'comment'
  rating: { 
    type: Number, 
    default: 5, 
    min: 1, 
    max: 5 
  },
  origin: { 
    type: String, 
    trim: true 
  }, // e.g., "UK" or "Egypt"
  image: { 
    type: String, 
    required: [true, "A profile image URL is required"] 
  } // Changed from 'imageUrl' to 'image'
}, { 
  timestamps: true 
});

// Index for faster searching by name or company title
testimonialSchema.index({ name: 1, title: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);