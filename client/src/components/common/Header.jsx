import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="flex items-center justify-between max-w-6xl px-6 py-5 mx-auto">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white transition-all duration-300 hover:text-yellow-200 hover:scale-105">
            Coupon Distribution
          </Link>
        </div>
        <nav>
          <ul className="flex items-center space-x-8">
            <li>
              <Link to="/" className="font-medium text-white transition-all duration-300 hover:text-yellow-200 hover:translate-y-px">
                Home
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="px-4 py-2 font-medium text-blue-700 transition-all duration-300 bg-white rounded-lg shadow-md hover:bg-yellow-200 hover:text-blue-800 hover:shadow-lg">
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;