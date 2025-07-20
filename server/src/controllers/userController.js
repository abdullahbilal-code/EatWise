const User = require('../models/User');

exports.getAllNutritionists = async (req, res) => {
  try {
    const nutritionists = await User.find({ role: 'nutritionist' }).select('-password');
    res.json(nutritionists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nutritionists' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
