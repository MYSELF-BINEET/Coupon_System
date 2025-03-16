const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coupon-system';

// Initialize admin user
async function initializeAdmin() {
  try {
    const adminCount = await User.countDocuments({ isAdmin: true });
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Initialize admin account after successful connection
    await initializeAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;