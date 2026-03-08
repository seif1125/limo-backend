const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  pickupDate: Date,
  returnDate: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('RentalRequest', rentalRequestSchema);