const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema({
  isGlobal: { type: Boolean, default: true, unique: true },
  metadata: {
    domainUrl: { type: String, required: true },
    ogImage: { type: String, required: true },
    
    // Localized Fields
    defaultTitle_en: { type: String, required: true },
    defaultTitle_ar: { type: String, required: true },
    
    titleTemplate_en: { type: String, required: true },
    titleTemplate_ar: { type: String, required: true },
    
    description_en: { type: String, required: true },
    description_ar: { type: String, required: true },
    
    keywords_en: { type: [String], required: true },
    keywords_ar: { type: [String], required: true }
  },
  schemaData: {
    businessType: { type: String, required: true, default: 'TravelAgency' },
    
    // Localized Fields
    businessName_en: { type: String, required: true },
    businessName_ar: { type: String, required: true },
    
    areaServed_en: { type: [String], required: true },
    areaServed_ar: { type: [String], required: true },
    
    servicesOffered_en: { type: [String], required: true },
    servicesOffered_ar: { type: [String], required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('AppSettings', appSettingsSchema);