import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast} from 'react-hot-toast';
import { FiUser, FiLock, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import Header from '../../components/common/Header';
import { useCallback } from "react";

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
    // console.log(credentials.username);
    // console.log(credentials.password);
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter both username and password");
      // return;
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md p-8 mx-4 transition-all duration-300 transform bg-white shadow-lg rounded-xl hover:scale-105">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-indigo-600 rounded-full">
              <FiUser className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
            <p className="mt-2 text-gray-600">Secure access to administration dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiUser className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full px-4 py-3 pl-10 text-gray-700 transition duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiLock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-4 py-3 pl-10 text-gray-700 transition duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                {/* <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                /> */}
                {/* <label htmlFor="remember-me" className="block ml-2 text-gray-700">
                  Remember me
                </label> */}
              </div>
              <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-lg group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLogIn className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400" />
                  </span>
                  Sign In
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <FiArrowLeft className="mr-2" />
              Back to Home Page
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;