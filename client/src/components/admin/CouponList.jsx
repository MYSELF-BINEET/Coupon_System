import React, { useState, useEffect } from 'react';
import { getAllCoupons, deleteCoupon, resetCoupon } from '../../api/admin';
import Button from '../common/Button';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import { Search, RefreshCw, Tag, Calendar, Filter, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const CouponList = ({ onEdit, onRefresh, refreshTrigger }) => {
  const [coupons, setCoupons] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [refreshTrigger]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCoupons();
      setCoupons(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch coupons. Please try again.');
      toast.error("Failed to fetch coupons. Please try again.")
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        // Create modal container
        const modalContainer = document.createElement("div");
        modalContainer.className =
          "fixed inset-0 z-50 flex items-center justify-center";
  
        // Create backdrop
        const backdrop = document.createElement("div");
        backdrop.className =
          "absolute inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm";
  
        // Create modal dialog
        const modal = document.createElement("div");
        modal.className =
          "w-full max-w-md mx-4 overflow-hidden transition-all transform bg-white rounded-lg shadow-xl";
        modal.innerHTML = `
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="flex-shrink-0 bg-red-100 p-2 rounded-full">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="ml-3 text-lg font-medium text-gray-900">Delete Coupon</h3>
            </div>
            <p class="text-sm text-gray-600">Are you sure you want to delete this coupon? This action cannot be undone.</p>
            <div class="mt-6 flex justify-end space-x-3">
              <button id="cancel-delete" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                Cancel
              </button>
              <button id="confirm-delete" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                Delete
              </button>
            </div>
          </div>
        `;
  
        // Add elements to DOM
        modalContainer.appendChild(backdrop);
        modalContainer.appendChild(modal);
        document.body.appendChild(modalContainer);
  
        // Add fade-in animation
        setTimeout(() => {
          backdrop.classList.add("opacity-100");
          modal.classList.add("scale-100");
        }, 10);
  
        // Handle button clicks
        const cancelButton = modal.querySelector("#cancel-delete");
        const confirmButton = modal.querySelector("#confirm-delete");
  
        cancelButton.addEventListener("click", () => {
          closeModal(false);
        });
  
        confirmButton.addEventListener("click", () => {
          closeModal(true);
        });
  
        // Close modal function
        const closeModal = (result) => {
          // Fade-out animation
          backdrop.classList.remove("opacity-100");
          modal.classList.add("scale-95", "opacity-0");
  
          // Remove from DOM after animation
          setTimeout(() => {
            document.body.removeChild(modalContainer);
            resolve(result);
          }, 200);
        };
      });
    };
  
    // Use the custom confirm dialog
    if (!(await confirmDelete())) {
      return;
    }
  
    try {
      await deleteCoupon(id);
      setSuccessMessage("Coupon deleted successfully");
      toast.success("Coupon deleted successfully");
      fetchCoupons();
      if (onRefresh) onRefresh();
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to delete coupon");
      toast.error("Failed to delete coupon");
      console.error(err);
    }
  };
  

  const handleReset = async (id) => {
    const confirmReset = () => {
      return new Promise((resolve) => {
        // Create modal container
        const modalContainer = document.createElement("div");
        modalContainer.className =
          "fixed inset-0 z-50 flex items-center justify-center";
  
        // Create backdrop
        const backdrop = document.createElement("div");
        backdrop.className =
          "absolute inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm";
  
        // Create modal dialog
        const modal = document.createElement("div");
        modal.className =
          "w-full max-w-md mx-4 overflow-hidden transition-all transform bg-white rounded-lg shadow-xl";
        modal.innerHTML = `
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="flex-shrink-0 bg-yellow-100 p-2 rounded-full">
                <svg class="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="ml-3 text-lg font-medium text-gray-900">Reset Coupon</h3>
            </div>
            <p class="text-sm text-gray-600">Are you sure you want to reset this coupon? This will make it available again.</p>
            <div class="mt-6 flex justify-end space-x-3">
              <button id="cancel-reset" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                Cancel
              </button>
              <button id="confirm-reset" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Reset Coupon
              </button>
            </div>
          </div>
        `;
  
        // Add elements to DOM
        modalContainer.appendChild(backdrop);
        modalContainer.appendChild(modal);
        document.body.appendChild(modalContainer);
  
        // Add fade-in animation
        setTimeout(() => {
          backdrop.classList.add("opacity-100");
          modal.classList.add("scale-100");
        }, 10);
  
        // Handle button clicks
        const cancelButton = modal.querySelector("#cancel-reset");
        const confirmButton = modal.querySelector("#confirm-reset");
  
        cancelButton.addEventListener("click", () => {
          closeModal(false);
        });
  
        confirmButton.addEventListener("click", () => {
          closeModal(true);
        });
  
        // Close modal function
        const closeModal = (result) => {
          // Fade-out animation
          backdrop.classList.remove("opacity-100");
          modal.classList.add("scale-95", "opacity-0");
  
          // Remove from DOM after animation
          setTimeout(() => {
            document.body.removeChild(modalContainer);
            resolve(result);
          }, 200);
        };
      });
    };
  
    // Use the custom confirm dialog
    if (!(await confirmReset())) {
      return;
    }
  
    try {
      await resetCoupon(id);
      setSuccessMessage("Coupon reset successfully");
      toast.success("Coupon reset successfully");
      fetchCoupons();
      if (onRefresh) onRefresh();
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to reset coupon");
      console.error(err);
    }
  };
  

  const filteredCoupons = coupons
    .filter(coupon => 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(coupon => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'available') return !coupon.isUsed;
      if (statusFilter === 'claimed') return coupon.isUsed;
      return true;
    });

  if (loading && coupons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <Loading />
      </div>
    );
  }
  if (loading) {
    return (
      // <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loading />
      // </div>
      // <div>kandsl</div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Coupon Management</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="light" 
              className="flex items-center gap-2 text-sm font-medium text-indigo-800 bg-white/90 hover:bg-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            <Button 
              variant="light" 
              className="flex items-center gap-2 text-sm font-medium text-indigo-800 bg-white/90 hover:bg-white"
              onClick={fetchCoupons}
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      
      {(showFilters || searchTerm) && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="claimed">Claimed</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mx-4 mt-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}
      
      {successMessage && (
        <div className="mx-4 mt-4">
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                <div className="flex items-center gap-1">
                  <Tag size={14} />
                  Code
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Description</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Value</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Expiry Date
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <tr key={coupon._id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 font-mono text-sm font-medium text-gray-800 bg-gray-100 rounded">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{coupon.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{coupon.value}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      coupon.isUsed 
                        ? 'bg-red-100 text-red-800 border border-red-200' 
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {coupon.isUsed ? 'Claimed' : 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {coupon.expiryDate ? (
                      <div className="flex items-center gap-1">
                        <span>
                          {new Date(coupon.expiryDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {new Date(coupon.expiryDate) < new Date() && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">Expired</span>
                        )}
                      </div>
                    ) : (
                      'No Expiry'
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                    <Button
                      variant="secondary"
                      className="px-3 py-1 text-xs"
                      onClick={() => onEdit(coupon)}
                    >
                      Edit
                    </Button>
                    {coupon.isUsed && (
                      <Button
                        variant="success"
                        className="px-3 py-1 text-xs"
                        onClick={() => handleReset(coupon._id)}
                      >
                        Reset
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      className="px-3 py-1 text-xs"
                      onClick={() => handleDelete(coupon._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <Tag size={32} className="mb-2 text-gray-300" />
                    <p className="font-medium text-gray-500">No coupons found</p>
                    <p className="mt-1 text-sm text-gray-400">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'Add some coupons to get started'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-500">
          Showing {filteredCoupons.length} of {coupons.length} coupons
        </div>
        {/* <Button
      onClick={fetchCoupons}
      disabled={loading}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
    >
      {loading ? "Refreshing..." : "Refresh List"}
    </Button> */}
      </div>
    </div>
  );
};

export default CouponList;