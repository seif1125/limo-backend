const mongoose = require('mongoose');

// Helper function to handle Mongoose's tricky validation context
function isFullDayRequired() {
  // Scenario 1: Creating a new car (.save())
  if (this instanceof mongoose.Document) {
    return this.rentalOptions?.isFullDayRental === true;
  }

  // Scenario 2: Updating an existing car (.findByIdAndUpdate())
  if (this.getUpdate) {
    const updatePayload = this.getUpdate();
    // Safely look for the field inside the update payload or the $set operator
    const rentalOpts = updatePayload.$set?.rentalOptions || updatePayload.rentalOptions;
    return rentalOpts?.isFullDayRental === true;
  }

  return false;
}

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  model: { type: String, required: true }, 
  year: { type: Number, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },

  rentalOptions: {
    isFullDayRental: { type: Boolean, default: false },
    isStandardRental: { type: Boolean, default: true },

    // Apply the custom validator to your 4 fields
    fullDayHours: { 
      type: Number, 
      min: 1, 
      max: 24,
      required: [isFullDayRequired, 'Full Day Hours are required for Full Day Rentals.']
    },
    limitKilometers: { 
      type: Number,
      required: [isFullDayRequired, 'Included Kilometers are required for Full Day Rentals.'] 
    },
    extraKmCost: { 
      type: Number,
      required: [isFullDayRequired, 'Extra KM Cost is required for Full Day Rentals.']
    },
    extraHourCost: { 
      type: Number,
      required: [isFullDayRequired, 'Extra Hour Cost is required for Full Day Rentals.']
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

module.exports = mongoose.model('Car', carSchema);