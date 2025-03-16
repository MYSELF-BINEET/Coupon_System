const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    uppercase: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  value:{
    type: String,
    // required: true
  },
  expiryDate:{
    type: Date,
    required: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isUsed: { 
    type: Boolean, 
    default: false 
  },
  dateCreated: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Coupon', CouponSchema);
