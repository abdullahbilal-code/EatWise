const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  bookAppointment,
  getAppointmentsByUser,
  getAllAppointmentsForAdmin,
} = require('../controllers/appointmentController');
