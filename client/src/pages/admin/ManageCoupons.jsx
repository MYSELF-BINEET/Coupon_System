import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CouponList from '../../components/admin/CouponList';
import CouponForm from '../../components/admin/CouponForm';
import { ArrowLeft, PlusCircle, Tag } from 'lucide-react';

const ManageCouponsPage = () => {
  const [couponToEdit, setCouponToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditCoupon = (coupon) => {
    setCouponToEdit(coupon);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setCouponToEdit(null);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCouponToEdit(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setCouponToEdit(null);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header with gradient background */}
        <div className="p-6 mb-8 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <Tag className="w-8 h-8 mr-3 text-white" />
              <h1 className="text-2xl font-bold text-white">Coupon Management</h1>
            </div>
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center px-4 py-2 text-blue-700 transition-colors duration-200 bg-white rounded-md shadow-sm hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          {showForm ? (
            <div className="animate-fadeIn">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                {couponToEdit ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <CouponForm
                couponToEdit={couponToEdit}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          ) : (
            <div className="mb-6">
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Coupon
              </button>
            </div>
          )}

          {/* Only show the list when not showing the form */}
          {!showForm && (
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Active Coupons</h2>
              <CouponList
                onEdit={handleEditCoupon}
                onRefresh={() => setRefreshTrigger(prev => prev + 1)}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCouponsPage;