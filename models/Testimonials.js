const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name_en: { 
    type: String, 
    required: true, 
    trim: true 
  },
  name_ar: { 
    type: String, 
    required: true, 
    trim: true 
  }, // Arabic version of the name
  title_en: { 
    type: String, 
    required: true, 
    trim: true 
  },
  title_ar: { 
    type: String, 
    required: true, 
    trim: true 
  }, // Arabic version of the title
  comment_en: { 
    type: String, 
    required: true 
  }, // Changed from 'text' to 'comment'
  comment_ar: { 
    type: String, 
    required: true 
  }, // Arabic version of the comment
  rating: { 
    type: Number, 
    default: 5, 
    min: 1, 
    max: 5 
  },
  origin_en: {  
    type: String, 
    trim: true
  },
  origin_ar: { 
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