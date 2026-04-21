// models/ContactSettings.js
const mongoose = require('mongoose');

const contactSettingsSchema = new mongoose.Schema({
  // Enforces only one document in the collection
  isGlobal: { type: Boolean, default: true, unique: true },
  
  emails: {
    supportMail: { type: String, default: "support@viplimoegypt.com" },
    reservationMail: { type: String, default: "reservations@viplimoegypt.com" }
  },
  phones: {
    whatsapp1: { type: String, default: "+201222708033" },
    whatsapp2: { type: String, default: "" },
    whatsapp3: { type: String, default: "" },
    hotline: { type: String, default: "" } // Good for VIP services
  },
  socials: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    tiktok: { type: String, default: "" }, // Highly recommended for visual car showcases
    linkedin: { type: String, default: "" },
    youtube:{type:String,default:""},
    snapchat:{type:String,default:""},
    threads:{type:String,default:""},
    
     // Great for B2B executive travel
  },
  locations: [{
    en: { type: String, required: true },
    ar: { type: String,  },
    href: { type: String, required: true },
    workingHours:{
      en: { type: String, default: "24/7 Available",required:true },
      ar: { type: String, default: "متاح على مدار 24 ساعة" }
    },
    contactNumber: { type: String, default: "+201222708033" },
  }],

}, { timestamps: true });

module.exports = mongoose.model('ContactSettings', contactSettingsSchema);