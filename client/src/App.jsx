import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";


// Auth Provider
import { AuthProvider } from "./context/AuthContext";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Home from "./pages/public/Home";
import Login from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCoupons from "./pages/admin/ManageCoupons";
import ClaimHistory from "./components/admin/ClaimHistory";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/coupons" element={<ManageCoupons />} />
          <Route
  path="/admin/claims"
  element={
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header with gradient background */}
        <div className="p-6 mb-8 rounded-lg shadow-md bg-gradient-to-r from-purple-600 to-indigo-700">
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <svg 
                className="w-8 h-8 mr-3 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h1 className="text-2xl font-bold text-white">Claim History</h1>
            </div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 text-purple-700 transition-colors duration-200 bg-white rounded-md shadow-sm hover:bg-purple-50"
            >
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="pb-4 mb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Claims</h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all customer claim requests
            </p>
          </div>
          <ClaimHistory />
        </div>
      </div>
    </div>
  }
/>
        </Route>

        {/* Redirect for /admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast notifications */}
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}

export default App;
