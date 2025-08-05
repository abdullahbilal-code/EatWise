require('dotenv').config();
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Test route
app.get('/', (req, res) => {
  res.send('EatWise API is live');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);

// app.use('/api/appointments', require('./routes/appointmentRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/availability', require('./routes/availabilityRoutes'));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection failed ', err));


// Start Server
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});





