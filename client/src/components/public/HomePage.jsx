import React from 'react';
import CouponClaim from './CouponClaim';
import { Gift, Info, Users } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
            <Gift className="h-10 w-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            Welcome to Coupon Distribution System
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-indigo-700 leading-relaxed">
              Claim your exclusive coupon below. No login required!
            </p>
          </div>
        </div>
        
        <div className="mb-12">
          <CouponClaim />
        </div>
        
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 border border-indigo-100">
          <div className="flex items-center justify-center mb-4">
            <Info className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-indigo-800">How It Works</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start p-3 bg-indigo-50 rounded-lg">
              <Users className="h-5 w-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
              <p>Each user is limited to one coupon per time period to ensure fair distribution.</p>
            </div>
            
            <div className="flex items-start p-3 bg-indigo-50 rounded-lg">
              <svg className="h-5 w-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
              <p>Distribution is done in a round-robin fashion - every eligible user gets a chance.</p>
            </div>
          </div>
        </div>
        
        {/* <footer className="mt-12 text-center text-sm text-indigo-500">
          <p>© {new Date().getFullYear()} Coupon Distribution System. All rights reserved.</p>
        </footer> */}
      </div>
    </div>
  );
};

export default HomePage;