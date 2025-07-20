const Appointment = require('../models/Appointment');

exports.bookAppointment = async (req, res) => {
  try {
    const { nutritionist, date, time, biologicalInfo, nutritionGoal, notes } = req.body;

    const appointment = new Appointment({
      patient: req.user.userId,
      nutritionist,
      date,
      time,
      details: { biologicalInfo, nutritionGoal, notes },
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
};

exports.getAppointmentsByUser = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.userId })
      .populate('nutritionist', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};
exports.getAllAppointmentsForAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('nutritionist', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all appointments' });
  }
};
