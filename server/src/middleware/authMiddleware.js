const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log (authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  console.log(token);

  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;  // Contains userId and role
    console.log(decoded, ' decoded');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
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
