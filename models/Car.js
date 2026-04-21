const mongoose = require('mongoose');

function isFullDayRequired() {
  if (this instanceof mongoose.Document) return this.rentalOptions?.isFullDayRental === true;
  if (this.getUpdate) {
    const update = this.getUpdate();
    const rentalOpts = update.$set?.rentalOptions || update.rentalOptions;
    return rentalOpts?.isFullDayRental === true;
  }
  return false;
}

const carSchema = new mongoose.Schema({
  // Multilingual Fields
  name_en: { type: String, required: true, trim: true },
  name_ar: { type: String, required: true, trim: true },
  
  model_en: { type: String, required: true },
  model_ar: { type: String, required: true },
  
  description_en: { type: String, required: true },
  description_ar: { type: String, required: true },

  year: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },

  rentalOptions: {
    isFullDayRental: { type: Boolean, default: false },
    isStandardRental: { type: Boolean, default: true },
    fullDayHours: { type: Number, min: 1, max: 24, required: [isFullDayRequired, 'Required for Full Day'] },
    limitKilometers: { type: Number, required: [isFullDayRequired, 'Required for Full Day'] },
    extraKmCost: { type: Number, required: [isFullDayRequired, 'Required for Full Day'] },
    extraHourCost: { type: Number, required: [isFullDayRequired, 'Required for Full Day'] }
  },

  specs: {
    passengers: { type: Number, default: 4 },
    luggage: { type: Number, default: 2 },
    wifi: { type: Boolean, default: true },
    fourWheel: { type: Boolean, default: false },
    gps: { type: Boolean, default: true },
    leatherSeats: { type: Boolean, default: true },
    climateControl: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);