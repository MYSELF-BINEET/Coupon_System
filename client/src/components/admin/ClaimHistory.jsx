import React, { useState, useEffect } from "react";
import { getClaimHistory } from "../../api/admin";
import Loading from "../common/Loading";
import Alert from "../common/Alert";
import Button from "../common/Button";

const ClaimHistory = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchClaimHistory();
  }, []);

  const fetchClaimHistory = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      const data = await getClaimHistory();
      console.log(data);
      setClaims(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch claim history. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  if (loading && claims.length === 0) {
    return <Loading />;
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          Coupon Claim History
        </h2>
      </div>
      
      {error && (
        <div className="px-6 pt-4">
          <Alert type="error" message={error} onClose={() => setError("")} />
        </div>
      )}
      
      <div className="px-4 py-2 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-50 rounded-tl-md">
                Coupon Code
              </th>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-50">
                IP Address
              </th>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-50">
                Session ID
              </th>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-50 rounded-tr-md">
                Claim Date
              </th>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-50 rounded-tr-md">
                Claim Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claims.length > 0 ? (
              claims.map((claim, index) => (
                <tr 
                  key={claim.id || `claim-${index}`}
                  className="transition-colors duration-200 hover:bg-blue-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 whitespace-nowrap">
                    {claim.couponId.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {claim.ipAddress}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {claim.browserFingerprint}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(claim.dateTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(claim.dateTime).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-sm text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">No claim history found</span>
                    <span className="text-gray-400">Coupon claims will appear here when available</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
        <div className="text-sm text-gray-500">
          {claims.length > 0 && `Showing ${claims.length} ${claims.length === 1 ? 'entry' : 'entries'}`}
        </div>
        
        <Button 
          onClick={fetchClaimHistory}
          disabled={isRefreshing}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh History'}
        </Button>
      </div>
    </div>
  );
};

export default ClaimHistory;