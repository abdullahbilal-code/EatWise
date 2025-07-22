const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  bookAppointment,
  getAppointmentsByUser,
  getAllAppointmentsForAdmin,
} = require('../controllers/appointmentController');

// Patient books an appointment
router.post('/', verifyToken, bookAppointment);

// Patient views their appointments
router.get('/my', verifyToken, getAppointmentsByUser);

// Admin views all appointments
router.get('/admin', verifyToken, getAllAppointmentsForAdmin);

module.exports = router;