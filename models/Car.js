const mongoose = require('mongoose');

/**
 * Validation Logic: Returns true if any special rental option is active,
 * making the cost/limit fields required.
 */
function additionalDataRequired() {
  // For New Documents
  if (this instanceof mongoose.Document) {
    return (
      this.rentalOptions?.isFullDayRental || 
      this.rentalOptions?.isAirport || 
      this.rentalOptions?.isCityToCity
    );
  }
  // For Updates
  if (this.getUpdate) {
    const update = this.getUpdate();
    const rentalOpts = update.$set?.rentalOptions || update.rentalOptions;
    return (
      rentalOpts?.isFullDayRental === true || 
      rentalOpts?.isCityToCity === true || 
      rentalOpts?.isAirport === true
    );
  }
  return false;
}

const carSchema = new mongoose.Schema({
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
    isAirport: { type: Boolean, default: false },
    isCityToCity: { type: Boolean, default: false },
    fullDayHours: { 
        type: Number, 
        min: 1, 
        max: 24, 
        required: [additionalDataRequired, 'Required for special services'] 
    },
    limitKilometers: { 
        type: Number, 
        required: [additionalDataRequired, 'Required for special services'] 
    },
    extraKmCost: { 
        type: Number, 
        required: [additionalDataRequired, 'Required for special services'] 
    },
    extraHourCost: { 
        type: Number, 
        required: [additionalDataRequired, 'Required for special services'] 
    }
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

// Prevent model recompilation errors in Next.js development
module.exports = mongoose.models.Car || mongoose.model('Car', carSchema);