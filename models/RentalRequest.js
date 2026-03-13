const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone1: { type: String, required: true },
  phone2: { type: String },
  nationality: { 
    type: String, 
    enum: ['Egyptian', 'Foreigner'], 
    required: true 
  },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'active'], 
    default: 'pending' 
  },
  car: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Car', // Ensure this matches your Fleet model name
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('RentalRequest', rentalRequestSchema);