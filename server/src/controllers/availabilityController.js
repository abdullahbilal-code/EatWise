const mongoose = require('mongoose');
const availabilitySchema = new mongoose.Schema({
  nutritionist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  