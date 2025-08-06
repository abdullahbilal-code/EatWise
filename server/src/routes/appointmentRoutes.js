// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getUserAppointments,
  getNutritionistAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

// Middleware to check if user is a nutritionist
const isNutritionist = (req, res, next) => {
  if (!req.user || req.user.role !== 'nutritionist') {
    console.log('Role check failed:', {
      userRole: req.user?.role,
      expectedRole: 'nutritionist'
    });
    return res.status(403).json({ 
      error: 'Only nutritionists can perform this action',
      userRole: req.user?.role || 'none'
    });
  }
  next();
};

// Create appointment (nutritionist only)
router.post('/', verifyToken, isNutritionist, createAppointment);

// Get appointments for a user
router.get('/user', verifyToken, getUserAppointments);

// Get appointments for a nutritionist
router.get('/nutritionist', verifyToken, isNutritionist, getNutritionistAppointments);

// Update appointment status
router.put('/:id/:status', verifyToken, updateAppointmentStatus);

module.exports = router;
