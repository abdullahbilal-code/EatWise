const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verification:', {
      userId: decoded.userId,
      role: decoded.role
    });

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
 

exports.verifyNutritionist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'nutritionist') {
      return res.status(403).json({ message: 'Access denied: Nutritionist only' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error in role check' });
  }
};
