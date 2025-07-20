const Availability = require('../models/Availability');

exports.setAvailability = async (req, res) => {
  try {
    const { date, timeSlots } = req.body;

    const availability = new Availability({
      nutritionist: req.user.userId,
      date,
      timeSlots
    });

    await availability.save();
    res.status(201).json({ message: 'Availability set successfully', availability });
  } catch (err) {
    res.status(500).json({ error: 'Failed to set availability' });
  }
};
