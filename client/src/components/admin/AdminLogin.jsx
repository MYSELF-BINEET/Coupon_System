import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiUser, FiLock, FiLogIn, FiArrowLeft, FiShield } from 'react-icons/fi';
import Header from '../../components/common/Header';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter both username and password");
      return;
    }
  
    try {
      const loginPromise = login(credentials);
  
      await toast.promise(
        loginPromise,
        {
          loading: "Authenticating...",
          success: "Login successful!",
          error: "Failed to login. Please try again.",
        }
      );
  
      await loginPromise;
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Failed to login.")
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="relative w-full max-w-sm p-6 mx-4 transition-all duration-300 transform bg-white shadow-xl rounded-2xl hover:shadow-2xl">
          {/* Top accent decorative element */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-lg"></div>
          
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-md">
              <FiShield className="text-2xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
            <p className="mt-1 text-sm text-gray-600">Secure access to administration dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiUser className="w-4 h-4 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full px-4 py-2 pl-10 text-gray-700 transition duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiLock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-4 py-2 pl-10 text-gray-700 transition duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            
            <div className="flex justify-end text-xs">
              <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
                Forgot password?
              </a>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-lg group hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLogIn className="w-4 h-4 text-indigo-200 group-hover:text-indigo-100" />
                  </span>
                  Sign In
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiArrowLeft className="mr-1" />
              Back to Home Page
            </a>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute w-12 h-12 bg-indigo-100 rounded-full -bottom-6 -left-6 opacity-30"></div>
          <div className="absolute w-8 h-8 bg-purple-100 rounded-full -top-4 -right-4 opacity-30"></div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;