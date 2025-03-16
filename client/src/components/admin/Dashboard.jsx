import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllCoupons, getClaimHistory } from "../../api/admin";
import Button from "../common/Button";
import Loading from "../common/Loading";
import { RefreshCw, LogOut, Gift, Tag, CheckCircle, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const { adminData, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalCoupons: 0,
    availableCoupons: 0,
    claimedCoupons: 0,
    totalClaims: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);


  const handleSubmit = async () => {
    // e.preventDefault();
    
    // if (!credentials.username || !credentials.password) {
    //   toast.error("Please enter both username and password");
    //   return;
    // }
  
    try {
      const logoutPromise = logout();
  
      await toast.promise(
        logoutPromise,
        {
          loading: "Please wait...",
          success: "Logout successful!",
          error: "Failed to logout. Please try again.",
        }
      );
  
      await logoutPromise;
      // navigate("/");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Failed to logout.")
    }
  };

  const fetchDashboardData = async () => {
    if (!refreshing) setLoading(true);
    setRefreshing(true);

    try {
      // Get coupons data
      const coupons = (await getAllCoupons()) || [];

      // Get claims data
      const claims = (await getClaimHistory()) || [];

      // Calculate stats
      const totalCoupons = coupons.length;
      const availableCoupons = coupons.filter(
        (coupon) => !coupon.isUsed && coupon.isActive
      ).length;
      const claimedCoupons = coupons.filter((coupon) => coupon.isUsed).length;
      const totalClaims = claims.length;

      setStats({
        totalCoupons,
        availableCoupons,
        claimedCoupons,
        totalClaims,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      // <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loading />
      // </div>
      // <div>kandsl</div>
    );
  }

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-blue-500 to-blue-600">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-blue-100">Coupon Management System</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 rounded-lg bg-white/10">
              <span className="mr-2 text-sm font-medium">
                {adminData?.username || "Admin User"}
              </span>
              <Button
                variant="ghost"
                onClick={handleSubmit}
                className="p-2 text-sm text-white rounded-lg hover:bg-white/20"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Coupons Card */}
            <div className="p-6 transition-all duration-200 transform bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Coupons
                  </h3>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {stats.totalCoupons}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Gift size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            {/* Available Coupons Card */}
            <div className="p-6 transition-all duration-200 transform bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Available Coupons
                  </h3>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {stats.availableCoupons}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Tag size={24} className="text-green-600" />
                </div>
              </div>
              <div className="h-2 mt-4 overflow-hidden bg-gray-100 rounded">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{
                    width: `${
                      (stats.availableCoupons / stats.totalCoupons) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {Math.round(
                  (stats.availableCoupons / stats.totalCoupons) * 100
                )}
                % of total
              </p>
            </div>

            {/* Claimed Coupons Card */}
            <div className="p-6 transition-all duration-200 transform bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Claimed Coupons
                  </h3>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {stats.claimedCoupons}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <CheckCircle size={24} className="text-orange-600" />
                </div>
              </div>
              <div className="h-2 mt-4 overflow-hidden bg-gray-100 rounded">
                <div
                  className="h-full bg-orange-500 rounded"
                  style={{
                    width: `${
                      (stats.claimedCoupons / stats.totalCoupons) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {Math.round((stats.claimedCoupons / stats.totalCoupons) * 100)}%
                of total
              </p>
            </div>

            {/* Total Claims Card */}
            <div className="p-6 transition-all duration-200 transform bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Claims
                  </h3>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {stats.totalClaims}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center mt-8 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw
                size={18}
                className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh Dashboard"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
