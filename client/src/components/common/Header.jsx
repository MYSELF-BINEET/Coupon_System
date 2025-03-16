import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="flex items-center justify-between max-w-6xl px-6 py-5 mx-auto">
        <div className="flex items-center">
          <svg 
            className="w-8 h-8 mr-2 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.91 8.84L8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a1.93 1.93 0 0 0-.97 1.68v4.8a1.93 1.93 0 0 0 .97 1.68l3.65 1.89" />
            <path d="m22 17-8.5 4.5L5 17" />
            <path d="m2 8 8.5-4.5L19 8" />
            <path d="M13.5 12.5v9" />
            <path d="M8 14.5v2.45" />
            <path d="m2 10 8.5 4.5L19 10" />
          </svg>
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