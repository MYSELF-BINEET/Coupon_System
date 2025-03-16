import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
        <div>
          <Link to="/" className="text-xl font-bold text-blue-600 transition-colors duration-300 hover:text-blue-800">
            Coupon Distribution
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="font-medium text-gray-700 transition-colors duration-300 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="font-medium text-gray-700 transition-colors duration-300 hover:text-blue-600">
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