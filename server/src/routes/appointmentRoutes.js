// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getAppointmentsForNutritionist
} = require('../controllers/appointmentController');

// POST: create appointment proposal
router.post('/', verifyToken, createAppointment);

// GET: get all appointments for logged-in nutritionist
router.get('/nutritionist', verifyToken, getAppointmentsForNutritionist);

module.exports = router;
