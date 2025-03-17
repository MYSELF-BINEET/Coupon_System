// routes/public.js
const express = require('express');
const router = express.Router();
const claimController = require('../controller/claimController');
const { couponClaimLimiter, checkRecentClaims } = require('../middleware/rateLimiter');

// Public routes
router.get('/check-availability', claimController.checkAvailability);
router.post('/claim-coupon', checkRecentClaims, claimController.claimCoupon);

module.exports = router;

// couponClaimLimiter,
