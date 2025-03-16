import React from 'react';
import CouponClaim from './CouponClaim';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Coupon Distribution System</h1>
        <p className="text-lg text-gray-600">
          Claim your exclusive coupon below. No login required!
        </p>
      </div>
      
      <CouponClaim />
      
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Each user is limited to one coupon per time period to ensure fair distribution.</p>
        <p className="mt-2">Distribution is done in a round-robin fashion - every eligible user gets a chance.</p>
      </div>
    </div>
  );
};

export default HomePage;