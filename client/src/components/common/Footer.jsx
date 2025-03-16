import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Coupon Distribution System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;