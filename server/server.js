// server.js - Main application entry point
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import configuration
const { PORT } = require('./config/config');
const connectDB = require('./config/db');

// Import routes
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Server status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'online' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});