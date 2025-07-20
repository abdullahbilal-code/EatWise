const mongoose = require('mongoose');
const availabilitySchema = new mongoose.Schema({
  nutritionist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // e.g., '2025-07-22'
    required: true
  },
  timeSlots: [String] // e.g., ['10:00', '11:00', '14:00']
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);
  