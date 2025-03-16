// services/couponService.js
const Coupon = require('../models/coupon');
const Claim = require('../models/claim');
const { v4: uuidv4 } = require('uuid');

/**
 * Service layer for coupon-related business logic
 */
class CouponService {
  /**
   * Get all coupons with pagination and filtering
   */
  async getAllCoupons(filters = {}, sort = { dateCreated: -1 }) {
    return await Coupon.find(filters).sort(sort);
  }
  
  /**
   * Get a single coupon by ID
   */
  async getCouponById(id) {
    return await Coupon.findById(id);
  }
  
  /**
   * Create a new coupon
   */
  async createCoupon(couponData) {
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: couponData.code });
    if (existingCoupon) {
      throw new Error('Coupon code already exists');
    }
    
    return await Coupon.create(couponData);
  }
  
  /**
   * Update an existing coupon
   */
  async updateCoupon(id, couponData) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    
    // Check if code already exists for a different coupon
    if (couponData.code && couponData.code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: couponData.code });
      if (existingCoupon) {
        throw new Error('Coupon code already exists');
      }
    }
    
    Object.assign(coupon, couponData);
    return await coupon.save();
  }
  
  /**
   * Delete a coupon
   */
  async deleteCoupon(id) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    
    return await coupon.deleteOne();
  }
  
  /**
   * Reset a coupon (mark as unused)
   */
  async resetCoupon(id, removeClaims = false) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    
    coupon.isUsed = false;
    await coupon.save();
    
    // Optionally remove associated claims
    if (removeClaims) {
      await Claim.deleteMany({ couponId: coupon._id });
    }
    
    return coupon;
  }
  
  /**
   * Check if coupons are available
   */
  async checkAvailability() {
    const availableCoupons = await Coupon.countDocuments({ 
      isActive: true, 
      isUsed: false 
    });
    
    return { available: availableCoupons > 0, count: availableCoupons };
  }
  
  /**
   * Claim a coupon using round-robin approach
   */
  async claimCoupon(ipAddress, browserFingerprint) {
    // Find an available coupon using round-robin approach
    const coupon = await Coupon.findOneAndUpdate(
      { isActive: true, isUsed: false },
      { isUsed: true },
      { new: true, sort: { dateCreated: 1 } } // Get the oldest available coupon first
    );

    // console.log(ipAddress);
    
    if (!coupon) {
      throw new Error('No coupons available at this time');
    }
    
    // Record the claim
    await Claim.create({
      couponId: coupon._id,
      ipAddress,
      browserFingerprint
    });
    
    return {
      success: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        description: coupon.description
      }
    };
  }
  
  /**
   * Get all claim history
   */
  async getClaimHistory(filters = {}) {
    return await Claim.find(filters)
      .populate('couponId')
      .sort({ dateTime: -1 });
  }
  
  /**
   * Generate a fingerprint cookie if not present
   */
  generateFingerprint(req, res) {
    const fingerprint = req.cookies.browserFingerprint;

    console.log(fingerprint);
    
    // Set cookie if not already set
    if (!req.cookies.browserFingerprint) {
      res.cookie('browserFingerprint', fingerprint, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }
    
    return fingerprint;
  }
}

module.exports = new CouponService();