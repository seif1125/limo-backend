const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  // CHANGE THIS: Remove the { en, ar } objects
  title: { 
    type: String, 
    required: true 
  },
  subtitle: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  buttonText: { 
    type: String, 
    default: '' 
  },
  buttonUrl: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);