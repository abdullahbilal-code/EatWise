const Appointment = require('../models/Appointment');
const User = require('../models/User');
// @desc   Nutritionist proposes an appointment slot for a user
// @route  POST /api/appointments
// @access Nutritionist
exports.createAppointment = async (req, res) => {
  try {
    const { user, date, time, purpose } = req.body;
    const nutritionist = req.user.userId;

    const appointment = await Appointment.create({
      user,
      nutritionist,
      date,
      time,
      purpose
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
};

// @desc   List all appointments for a nutritionist
// @route  GET /api/appointments/nutritionist
// @access Nutritionist
exports.getNutritionistAppointments = async (req, res) => {
  try {
    const nutritionist = req.user.userId;
    const appointments = await Appointment.find({ nutritionist })
      .populate('user', 'firstName lastName contact');
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching nutritionist appointments:', err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// @desc   List all appointments for a user
// @route  GET /api/appointments/user
// @access Authenticated user
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const appointments = await Appointment.find({ user: userId })
      .populate('nutritionist', 'firstName lastName contact');
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching user appointments:', err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// @desc   Update appointment status (confirm or cancel)
// @route  PATCH /api/appointments/:id
// @access Authenticated user
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected 'confirmed' or 'cancelled'

    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only the user (not nutritionist) can confirm/cancel their own appointments
    if (req.user.userId !== appointment.user.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
};

// controllers/appointmentController.js


exports.getAppointmentsForNutritionist = async (req, res) => {
  try {
    const nutritionistId = req.user.id; // extracted from verifyToken

    const appointments = await Appointment.find({ nutritionist: nutritionistId })
      .populate('user', 'firstName lastName') // populate basic user info
      .sort({ date: -1 }); // optional: latest first

    res.status(200).json(appointments);
  } catch (err) {
    console.error('Error fetching nutritionist appointments:', err);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
};
