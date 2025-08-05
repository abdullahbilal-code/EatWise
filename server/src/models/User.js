const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  contact:   { type: String, required: true },
  gender:    { type: String, enum: ['Male', 'Female', 'Prefer not to say'], required: true },
  role:      { type: String, enum: ['regular', 'nutritionist'], default: 'regular' },
  password:  { type: String, required: true },

  // New Fields
  goal:           { type: String, enum: ['Lose', 'Gain'], default: null },
  weight:         { type: Number, default: null },  // in KG
  height: {
    feet:         { type: Number, default: null },
    inches:       { type: Number, default: null }
  },
  disease:        { type: String, default: null },
  comments:       { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
