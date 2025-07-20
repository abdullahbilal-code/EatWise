const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nutritionist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },