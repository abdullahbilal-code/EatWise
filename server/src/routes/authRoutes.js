const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getAllNutritionists,
  getUserProfile,
} = require('../controllers/userController');

const { verifyToken } = require('../middleware/authMiddleware');

// Public: Register new user
router.post('/register', register);

// Public: Login
router.post('/login', login);

// Public: Get list of all nutritionists
router.get('/nutritionists', getAllNutritionists);

// Authenticated: Get own user profile
router.get('/me', verifyToken, getUserProfile);

module.exports = router;
