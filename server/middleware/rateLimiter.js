const rateLimit = require('express-rate-limit');
const { COUPON_COOLDOWN_MS } = require('../config/config');
const Claim = require('../models/claim');

// Standard API rate limiter
exports.apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
});

// Stricter limiter for public coupon claiming
exports.couponClaimLimiter = rateLimit({
  windowMs: COUPON_COOLDOWN_MS, // Configurable cooldown period
  max: 5, // 5 requests per IP during cooldown period
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
});

// Custom middleware to check for recent claims
exports.checkRecentClaims = async (req, res, next) => {
  try {
    // console.log(req);
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const browserFingerprint =  req.cookies.browserFingerprint;
    // console.log(browserFingerprint);
    // console.log(ipAddress);
    
    // Skip check if no fingerprint is available yet
    // if (!browserFingerprint) {
    //   return next();
    // }
    
    // Check for recent claims within cooldown period
    const recentClaim = await Claim.findOne({
      $or: [
        { ipAddress },
        { browserFingerprint }
      ],
      dateTime: { $gt: new Date(Date.now() - COUPON_COOLDOWN_MS) }
    });

    // console.log(recentClaim);
    
    if (recentClaim) {
      // Calculate remaining cooldown time in minutes
      const cooldownRemaining = Math.ceil(
        (COUPON_COOLDOWN_MS - (Date.now() - recentClaim.dateTime)) / (60 * 1000)
      );

      // console.log(cooldownRemaining);
      
      return res.status(428).json({
        data:{
          message: 'You recently claimed a coupon. Please try again later.',
          cooldownRemaining:cooldownRemaining
        }
      });
    }

    
    next();
  } catch (error) {
    console.error('Claim check error:', error);
    next(error);
  }
};