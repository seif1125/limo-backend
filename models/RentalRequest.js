const mongoose = require('mongoose');

// List of Egyptian Governorates
const egyptianGovernorates = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbiya", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", "Sharqia", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "South Sinai", "Kafr el-Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
];

// Detailed Location Sub-Schema
const detailedLocationSchema = new mongoose.Schema({
  address: { type: String, required: true }, // Street name/area
  // Coordinates for Leaflet Map
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false }); // We don't need a separate ID for the location object

function isFullDayRequired() {
  return this.reservationType === 'Full Day';
}

const rentalRequestSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone1: { type: String, required: true },
  phone2: { type: String },
  nationality: { type: String, required: true },

  reservationType: { 
    type: String, 
    enum: ['Full Day', 'Original Pickup'], 
    required: true 
  },

  // UPDATED: Structured Locations
  pickupLocation: { type: detailedLocationSchema, required: true },
  dropoffLocation: { type: detailedLocationSchema, required: true },
  
  fromDate: { type: Date, required: true }, 
  toDate: { type: Date, required: true },

  fullDayHours: { type: Number, required: isFullDayRequired },
  limitKilometers: { type: Number, required: isFullDayRequired },
  extraKmCost: { type: Number, required: isFullDayRequired },
  extraHourCost: { type: Number, required: isFullDayRequired },

  additionalHours: { type: Number, default: 0 },
  additionalKms: { type: Number, default: 0 },

  rate: { type: Number, required: true }, 
  additionalPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true },
  paymentType: { 
    type: String, 
    enum: ['Cash', 'Visa', 'Transfer'], 
    required: true 
  },
  cashDeposit: { type: Number, default: 0 },
  cashRemain: { type: Number, default: 0 },

  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  status: { type: String, enum: ['pending', 'active'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('RentalRequest', rentalRequestSchema);