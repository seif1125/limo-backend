const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    uppercase: true // Keeps data consistent (e.g., "SEDAN" vs "sedan")
  }
}, { 
  timestamps: true 
});

/**
 * THE DELETE GATE
 * Intercepts all Mongoose delete methods and throws an error.
 */
const blockDelete = function(next) {
  const err = new Error("DELETION PROHIBITED: Fleet categories are permanent records.");
  next(err);
};

categorySchema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete', 'findByIdAndDelete', 'remove'], blockDelete);

module.exports = mongoose.model('Category', categorySchema);