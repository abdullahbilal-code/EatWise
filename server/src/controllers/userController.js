const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER CONTROLLER
exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    contact,
    role,
    password,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      gender,
      contact,
      role,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// LOGIN CONTROLLER
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    console.log('User logged in:', user._id.toString(), user.role);

    // If user is a nutritionist, allow login
    // if (user.role !== 'nutritionist') {
    //   return res.status(403).json({ error: 'Access denied: Nutritionist only' });
    // }

    // Generate JWT
    // const token = jwt.sign(
    //   { userId: user._id, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '1h' }
    // );
    const token = jwt.sign(
    { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

    res.status(200).json({ token, user: { id: user._id, role: user.role, name: user.firstName } });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// EXISTING CONTROLLERS

// GET ALL NUTRITIONISTS
exports.getAllNutritionists = async (req, res) => {
  try {
    const nutritionists = await User.find({ role: 'nutritionist' }).select('-password');
    res.json(nutritionists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nutritionists' });
  }
};

// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
//Update user details
exports.updateUserDetails = async (req, res) => {
  try {
    const user = req.user; // comes from verifyToken middleware
    const { goal, weight, height, disease, comments } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      {
        goal,
        weight,
        height,
        disease,
        comments,
      },
      { new: true }
    );

    console.log(req.body);
    console.log('User Updated', updatedUser);
    console.log('User ID:', user.userId);

    res.json({ message: 'Details updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



// ...

// Controller for GET /api/users/all-profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const users = await User.find(
      { role: 'regular' },
      'firstName lastName contact goal weight height disease comments'
    );
    res.json(users);
  } catch (err) {
    console.error('Error fetching all profiles:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};



