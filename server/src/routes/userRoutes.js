const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

const {
  getAllNutritionists,
  getUserProfile,
  updateUserDetails,
  getAllProfiles,        // ← import your new controller
} = require('../controllers/userController');

// Public: list all nutritionists
router.get('/nutritionists', getAllNutritionists);

// Authenticated: get own profile
router.get('/me', verifyToken, getUserProfile);

// Authenticated: update own profile (dashboard form)
router.post('/update-profile', verifyToken, updateUserDetails);

// Authenticated: list all regular users for nutritionist dashboards
router.get('/all-profiles', verifyToken, getAllProfiles);

module.exports = router;
