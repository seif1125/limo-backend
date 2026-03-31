const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema({
  isGlobal: { type: Boolean, default: true, unique: true },
  metadata: {
    domainUrl: { type: String, required: true },
    defaultTitle: { type: String, required: true },
    titleTemplate: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [String], required: true }, // Array must exist
    ogImage: { type: String, required: true }
  },
  schemaData: {
    businessName: { type: String, required: true },
    businessType: { type: String, required: true, default: 'TravelAgency' },
    areaServed: { type: [String], required: true },
    servicesOffered: { type: [String], required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('AppSettings', appSettingsSchema);