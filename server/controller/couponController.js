// controllers/couponController.js
const couponService = require('../services/couponServices');

/**
 * Admin coupon controller
 */
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, description, value,expiryDate,isActive } = req.body;
    
    const newCoupon = await couponService.createCoupon({
      code,
      description,
      value,
      expiryDate,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json(newCoupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(error.message === 'Coupon code already exists' ? 400 : 500)
      .json({ message: error.message || 'Server error' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { code, description, isActive ,value,expiryDate} = req.body;

    // console.log(req.body);
    // console.log(req.params.id);
    
    const updatedCoupon = await couponService.updateCoupon(req.params.id, {
      code,
      description,
      value,
      expiryDate,
      isActive
    });
    
    res.json(updatedCoupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    if (error.message === 'Coupon not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Coupon code already exists') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    if (error.message === 'Coupon not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetCoupon = async (req, res) => {
  try {
    const coupon = await couponService.resetCoupon(
      req.params.id, 
      req.body.removeClaims
    );
    
    res.json({ message: 'Coupon reset successfully', coupon });
  } catch (error) {
    console.error('Error resetting coupon:', error);
    if (error.message === 'Coupon not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getClaimHistory = async (req, res) => {
  try {
    const claims = await couponService.getClaimHistory();
    res.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ message: 'Server error' });
  }
};