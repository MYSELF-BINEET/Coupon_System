import React, { useState, useEffect } from 'react';
import { createCoupon, updateCoupon } from '../../api/admin';
import Button from '../common/Button';
import { toast } from 'react-hot-toast';

const CouponForm = ({ couponToEdit, onSuccess, onCancel }) => {
  const defaultFormState = {
    code: '',
    description: '',
    value: '',
    expiryDate: '',
    isActive: true
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (couponToEdit) {
      const expiryDate = couponToEdit.expiryDate
        ? new Date(couponToEdit.expiryDate).toISOString().split('T')[0]
        : '';

      setFormData({
        code: couponToEdit.code || '',
        description: couponToEdit.description || '',
        value: couponToEdit.value || '',
        expiryDate: expiryDate,
        isActive: couponToEdit.isActive !== undefined ? couponToEdit.isActive : true
      });
    } else {
      setFormData(defaultFormState);
    }
  }, [couponToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.code) {
        throw new Error('Coupon code is required');
      }

      if (couponToEdit?._id) {
        await updateCoupon(couponToEdit._id, formData);
        toast.success('Coupon updated successfully!', { position: 'bottom-right', autoClose: 4000 });
      } else {
        await createCoupon(formData);
        setFormData(defaultFormState);
        toast.success('Coupon created successfully!', { position: 'bottom-right', autoClose: 4000 });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save coupon. Please try again.', { position: 'bottom-right', autoClose: 5000 });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-8 mx-auto bg-white border border-gray-100 rounded-lg shadow-lg">
      <h2 className="pb-3 mb-6 text-2xl font-bold text-gray-800 border-b">
        {couponToEdit?._id ? 'Edit Coupon' : 'Create New Coupon'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="code">
            Coupon Code<span className="text-red-500">*</span>
          </label>
          <input
            id="code"
            name="code"
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter coupon code (e.g. SUMMER2025)"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter a brief description of this coupon"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="value">
            Value
          </label>
          <input
            id="value"
            name="value"
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.value}
            onChange={handleChange}
            placeholder="e.g. 10% OFF, $5 OFF, etc."
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="expiryDate">
            Expiry Date
          </label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-10 h-5 rounded-full transition ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-medium text-gray-700">Active</span>
          </label>
        </div>

        <div className="flex justify-end pt-5 mt-6 space-x-3 border-t border-gray-200">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : couponToEdit?._id ? 'Update Coupon' : 'Create Coupon'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;