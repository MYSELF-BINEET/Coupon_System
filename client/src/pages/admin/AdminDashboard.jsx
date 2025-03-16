import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../../components/admin/Dashboard';
import { Gift, Clock, ChevronRight } from 'lucide-react';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>Admin</li>
            <li className="flex items-center">
              <ChevronRight size={14} className="mx-1" />
              <span className="font-medium text-gray-900">Dashboard</span>
            </li>
          </ol>
        </nav>
        
        {/* Header section */}
        <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-gray-500">Manage your coupon system and view analytics</p>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link 
                to="/admin/coupons" 
                className="inline-flex items-center justify-center px-4 py-2 font-medium text-blue-600 transition-colors duration-150 bg-white border border-blue-100 rounded-lg shadow-sm hover:bg-blue-50"
              >
                <Gift size={18} className="mr-2" />
                Manage Coupons
              </Link>
              <Link 
                to="/admin/claims" 
                className="inline-flex items-center justify-center px-4 py-2 font-medium text-blue-600 transition-colors duration-150 bg-white border border-blue-100 rounded-lg shadow-sm hover:bg-blue-50"
              >
                <Clock size={18} className="mr-2" />
                View Claim History
              </Link>
            </div>
          </div>
        </div>
        
        {/* Dashboard component */}
        <Dashboard />
        
        {/* Optional: Quick Info Cards */}
        {/* <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <p className="mt-1 text-gray-500">Common tasks for administrators</p>
            <div className="mt-4 space-y-2">
              <Link to="/admin/coupons/new" className="flex items-center py-2 text-blue-600 hover:text-blue-800">
                <ChevronRight size={16} className="mr-2" />
                Generate New Coupons
              </Link>
              <Link to="/admin/users" className="flex items-center py-2 text-blue-600 hover:text-blue-800">
                <ChevronRight size={16} className="mr-2" />
                Manage Users
              </Link>
              <Link to="/admin/settings" className="flex items-center py-2 text-blue-600 hover:text-blue-800">
                <ChevronRight size={16} className="mr-2" />
                System Settings
              </Link>
            </div>
          </div>
          
          <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <p className="mt-1 text-gray-500">Latest system events</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 mr-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900">10 new coupons generated</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 mr-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900">User claimed coupon #1234</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 mr-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900">System backup completed</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900">System Status</h3>
            <p className="mt-1 text-gray-500">Current platform health</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API</span>
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Healthy</span>
              </div>
              <div className="h-2 mt-3 bg-gray-100 rounded-full">
                <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500">System load: 75%</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;