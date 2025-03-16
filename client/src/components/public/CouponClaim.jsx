import React, { useState, useEffect } from 'react';
import { checkCouponAvailability, claimCoupon } from '../../api/public';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import { Clock, Gift, RefreshCw, CheckCircle } from 'lucide-react';

const CouponClaim = () => {
  const [available, setAvailable] = useState(false);
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    checkAvailability();

    // Check for cooldown in localStorage
    const storedCooldownUntil = localStorage.getItem('couponCooldownUntil');
    if (storedCooldownUntil) {
      const cooldownUntil = parseInt(storedCooldownUntil, 10);
      const now = Date.now();
      
      if (cooldownUntil > now) {
        setCooldown(true);
        setCooldownTime(Math.ceil((cooldownUntil - now) / 1000));
        
        // Set interval to count down
        const interval = setInterval(() => {
          setCooldownTime(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setCooldown(false);
              localStorage.removeItem('couponCooldownUntil');
              checkAvailability();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(interval);
      } else {
        localStorage.removeItem('couponCooldownUntil');
      }
    }
  }, []);

  const checkAvailability = async () => {
    setLoading(true);
    try {
      const response = await checkCouponAvailability();
      setAvailable(response.available);
      setError('');
    } catch (err) {
      setError('Unable to check coupon availability. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimCoupon = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setClaimedCoupon(null);

    try {
      const response = await claimCoupon();
      // console.log(response);
      setClaimedCoupon(response.coupon);
      setSuccess('Congratulations! You have successfully claimed a coupon.');
      setAvailable(false);
      
      // Set cooldown
      // const cooldownDuration = 3600000; // 1 hour in milliseconds
      const cooldownDuration = 60 * 60 * 1000; // 2 minutes in milliseconds

      const cooldownUntil = Date.now() + cooldownDuration;
      localStorage.setItem('couponCooldownUntil', cooldownUntil.toString());
      // localStorage.setItem('browserFingerprint',response.browserFingerprint);
      setCooldown(true);
      setCooldownTime(cooldownDuration / 1000);
    } catch (err) {
      // console.log(err);
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please try again 1 hour later.');
        
        // Extract cooldown time from response if available
        const retryAfter = err.response.headers['retry-after'];
        if (retryAfter) {
          const cooldownSeconds = parseInt(retryAfter, 10);
          setCooldown(true);
          setCooldownTime(cooldownSeconds);
          
          const cooldownUntil = Date.now() + (cooldownSeconds * 1000);
          localStorage.setItem('couponCooldownUntil', cooldownUntil.toString());
        }
      } else {
        setError(err.response?.data?.message || 'Failed to claim coupon. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading && !cooldown) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-md p-8 mx-auto bg-white shadow-lg rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center justify-center mb-6">
        <Gift className="mr-2 text-indigo-600" size={24} />
        <h2 className="text-2xl font-bold text-indigo-800">Claim Your Coupon</h2>
      </div>
      
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      
      {claimedCoupon ? (
        <div className="p-6 mb-6 bg-white border-2 border-indigo-500 border-dashed rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="mr-2 text-green-600" size={20} />
              <span className="font-semibold text-green-600">Coupon Claimed!</span>
            </div>
            <div className="mb-4 text-2xl font-bold tracking-wide text-indigo-700">{claimedCoupon.code}</div>
            <div className="px-4 mb-4 text-sm text-gray-600">{claimedCoupon.description}</div>
            {claimedCoupon.value && (
              <div className="inline-block p-2 mb-3 text-lg font-semibold text-green-600 rounded-md bg-green-50">
                {claimedCoupon.value}
              </div>
            )}
            {claimedCoupon.expiryDate && (
              <div className="mt-2 text-xs text-gray-500">
                Expires on: {new Date(claimedCoupon.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center">
          {cooldown ? (
            <div className="p-4 mb-4 bg-blue-100 rounded-lg">
              <p className="mb-2 text-gray-700">You can claim another coupon in:</p>
              <div className="flex items-center justify-center">
                <Clock className="mr-2 text-blue-600" size={20} />
                <div className="text-2xl font-bold text-blue-700">{formatTime(cooldownTime)}</div>
              </div>
            </div>
          ) : (
            <>
              {available ? (
                <div className="p-4 rounded-lg bg-green-50">
                  <p className="flex items-center justify-center text-green-700">
                    <CheckCircle className="mr-2" size={18} />
                    Coupons are available! Claim yours now.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-red-50">
                  <p className="text-red-700">Sorry, no coupons are currently available.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      <div className="flex justify-center">
        <Button 
          disabled={!available || loading || cooldown}
          onClick={handleClaimCoupon}
          className={`px-6 py-3 font-semibold rounded-full transition-all duration-300 ${
            !available || loading || cooldown
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
          }`}
        >
          {loading ? 'Processing...' : cooldown ? 'Cooldown Active' : 'Claim Coupon'}
        </Button>
      </div>
      
      {!claimedCoupon && !cooldown && (
        <div className="mt-6 text-center">
          <button 
            onClick={checkAvailability} 
            className="flex items-center justify-center mx-auto text-sm text-indigo-600 hover:text-indigo-800"
          >
            <RefreshCw className="mr-1" size={14} />
            Check availability again
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponClaim;