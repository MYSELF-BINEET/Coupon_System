// routes/admin.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const couponController = require('../controller/couponController');
const { authenticateAdmin } = require('../middleware/auth');

// Auth routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Coupon management routes (protected)
router.get('/coupons', authenticateAdmin, couponController.getAllCoupons);
router.post('/coupons', authenticateAdmin, couponController.createCoupon);
router.put('/coupons/:id', authenticateAdmin, couponController.updateCoupon);
router.delete('/coupons/:id', authenticateAdmin, couponController.deleteCoupon);
router.post('/reset-coupon/:id', authenticateAdmin, couponController.resetCoupon);

// Claim history route (protected)
router.get('/claims', authenticateAdmin, couponController.getClaimHistory);

module.exports = router;