const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  setAvailability,
  getAvailabilityByNutritionist,
} = require('../controllers/availabilityController');

// Nutritionist sets availability
router.post('/', verifyToken, setAvailability);

// Public: get availability by nutritionist ID
router.get('/:id', getAvailabilityByNutritionist);

module.exports = router;
