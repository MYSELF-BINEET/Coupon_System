// controllers/claimController.js
const couponService = require('../services/couponServices');

/**
 * Public coupon claim controller
 */
exports.checkAvailability = async (req, res) => {
  try {
    const availability = await couponService.checkAvailability();
    res.json(availability);
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.claimCoupon = async (req, res) => {
  try {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ipAddress);
    const browserFingerprint = couponService.generateFingerprint(req, res);

    // console.log(ipAddress);
    
    const result = await couponService.claimCoupon(ipAddress, browserFingerprint);
    res.json(result);
  } catch (error) {
    console.error('Error claiming coupon:', error);
    
    if (error.message === 'No coupons available at this time') {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};