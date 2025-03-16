const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  couponId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Coupon', 
    required: true 
  },
  ipAddress: { 
    type: String, 
    required: true 
  },
  browserFingerprint: { 
    type: String, 
    required: true 
  },
  dateTime: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index for faster lookups by IP and fingerprint within time windows
ClaimSchema.index({ ipAddress: 1, dateTime: -1 });
ClaimSchema.index({ browserFingerprint: 1, dateTime: -1 });

module.exports = mongoose.model('Claim', ClaimSchema);