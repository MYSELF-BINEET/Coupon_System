import React, { useState, useEffect } from 'react';
import { checkCouponAvailability, claimCoupon } from '../../api/public';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';

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
      setClaimedCoupon(response.coupon);
      setSuccess('Congratulations! You have successfully claimed a coupon.');
      setAvailable(false);
      
      // Set cooldown
      const cooldownDuration = 1800000; // 30 minutes in milliseconds
      const cooldownUntil = Date.now() + cooldownDuration;
      localStorage.setItem('couponCooldownUntil', cooldownUntil.toString());
      setCooldown(true);
      setCooldownTime(cooldownDuration / 1000);
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
        
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
    return <Loading />;
  }

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow">
      <h2 className="mb-6 text-2xl font-bold text-center">Claim Your Coupon</h2>
      
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      
      {claimedCoupon ? (
        <div className="p-4 mb-6 border-2 border-blue-500 border-dashed rounded-lg">
          <div className="text-center">
            <div className="mb-2 text-xl font-bold text-blue-600">{claimedCoupon.code}</div>
            <div className="mb-4 text-sm text-gray-600">{claimedCoupon.description}</div>
            {claimedCoupon.value && (
              <div className="mb-2 text-lg font-semibold text-green-600">{claimedCoupon.value}</div>
            )}
            {claimedCoupon.expiryDate && (
              <div className="text-xs text-gray-500">
                Expires on: {new Date(claimedCoupon.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center">
          {cooldown ? (
            <div className="mb-4">
              <p className="mb-2 text-gray-600">You can claim another coupon in:</p>
              <div className="text-2xl font-bold text-blue-600">{formatTime(cooldownTime)}</div>
            </div>
          ) : (
            <>
              {available ? (
                <p className="mb-4 text-green-600">Coupons are available! Claim yours now.</p>
              ) : (
                <p className="mb-4 text-red-600">Sorry, no coupons are currently available.</p>
              )}
            </>
          )}
        </div>
      )}
      
      <div className="flex justify-center">
        <Button 
          disabled={!available || loading || cooldown} 
          onClick={handleClaimCoupon}
        >
          {loading ? 'Processing...' : cooldown ? 'Cooldown Active' : 'Claim Coupon'}
        </Button>
      </div>
      
      {!claimedCoupon && !cooldown && (
        <div className="mt-6 text-center">
          <button 
            onClick={checkAvailability} 
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Check availability again
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponClaim;