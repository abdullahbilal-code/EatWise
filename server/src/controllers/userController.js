const User = require('../models/User');

exports.getAllNutritionists = async (req, res) => {
  try {
    const nutritionists = await User.find({ role: 'nutritionist' }).select('-password');
    res.json(nutritionists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nutritionists' });
  }
};

