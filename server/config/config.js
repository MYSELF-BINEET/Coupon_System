module.exports = {
    PORT: process.env.PORT || 5271,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_EXPIRE: '1d',
    COUPON_COOLDOWN_MS: 59 * 60 * 1000 // 1 hour
  };