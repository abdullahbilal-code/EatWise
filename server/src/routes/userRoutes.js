const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getAllNutritionists,
  getUserProfile,
} = require('../controllers/userController');

// Public: get list of all nutritionists
router.get('/nutritionists', getAllNutritionists);

// Authenticated user profile
router.get('/me', verifyToken, getUserProfile);

module.exports = router;
