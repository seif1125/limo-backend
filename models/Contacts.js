const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phone: String,
  email: String,
  whatsapp: String,
  facebook: String,
  instagram: String,
  locations: [{
    name: { en: String, ar: String },
    address: { en: String, ar: String },
    mapsUrl: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);