import React, { useState, useEffect } from 'react';
import { checkCouponAvailability, claimCoupon } from '../../api/public';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import { Clock, Gift, RefreshCw, CheckCircle } from 'lucide-react';

const ERROR_COOLDOWN_DURATION = 5; // 5 seconds cooldown after error
const CLAIM_COOLDOWN_DURATION = 10; // 2 minutes cooldown between claims
const AUTO_REFRESH_INTERVAL = 30; // Auto refresh every 30 seconds

const CouponClaim = () => {
  const [available, setAvailable] = useState(false);
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [refreshTimer, setRefreshTimer] = useState(AUTO_REFRESH_INTERVAL);

  useEffect(() => {
    checkAvailability();
    
    // Check for stored cooldown
    const storedCooldownUntil = localStorage.getItem('couponCooldownUntil');
    if (storedCooldownUntil) {
      const cooldownUntil = parseInt(storedCooldownUntil, 10);
      const now = Date.now();
      if (cooldownUntil > now) {
        startCooldown(Math.ceil((cooldownUntil - now) / 1000));
      } else {
        localStorage.removeItem('couponCooldownUntil');
      }
    }

    // Set up auto-refresh interval
    const autoRefreshInterval = setInterval(() => {
      setRefreshTimer((prev) => {
        if (prev <= 1) {
          checkAvailability();
          return AUTO_REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(autoRefreshInterval);
    };
  }, []);

  // const startCooldown = (seconds) => {
  //   setCooldown(true);
  //   setCooldownTime(seconds);
  //   const interval = setInterval(() => {
  //     setCooldownTime((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(interval);
  //         setCooldown(false);
  //         localStorage.removeItem('couponCooldownUntil');
  //         checkAvailability();
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  // };

  let cooldownInterval = null; // Store interval reference

const startCooldown = (seconds) => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval); // Clear any previous interval
  }

  setCooldown(true);
  setCooldownTime(seconds);

  cooldownInterval = setInterval(() => {
    setCooldownTime((prev) => {
      if (prev <= 1) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
        setCooldown(false);
        localStorage.removeItem('couponCooldownUntil');
        checkAvailability();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};


  const checkAvailability = async () => {
    setLoading(true);
    try {
      const response = await checkCouponAvailability();
      setAvailable(response.available);
      setError('');
      // Reset refresh timer after successful check
      setRefreshTimer(AUTO_REFRESH_INTERVAL);
    } catch (err) {
      setError('Unable to check coupon availability. Please try again later.');
      console.error(err);
      // Start a cooldown after an error
      const cooldownUntil = Date.now() + ERROR_COOLDOWN_DURATION * 1000;
      localStorage.setItem('couponCooldownUntil', cooldownUntil.toString());
      startCooldown(ERROR_COOLDOWN_DURATION);
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
      
      if (response.coupon) {
        setClaimedCoupon(response.coupon);
        setSuccess('Congratulations! You have successfully claimed a coupon.');
        setAvailable(false);
        
        // Set the normal claim cooldown
        const cooldownUntil = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('couponCooldownUntil', cooldownUntil.toString());
        setCooldown(true);
        setCooldownTime(cooldownUntil);
        startCooldown(cooldownUntil);
        
        // After claiming, automatically check for new availability when cooldown ends
        setTimeout(() => {
          checkAvailability();
        }, CLAIM_COOLDOWN_DURATION * 1000);
      } else if (response.status === 428) {
        // Handle precondition required error (rate limiting)
        let errorMessage = 'Rate limit exceeded. Please try again later.';
        let cooldownRemaining = 60;
        
        if (response.data?.data) {
          if (response.data.data.message) {
            errorMessage = response.data.data.message;
          }
          if (response.data.data.cooldownRemaining) {
            cooldownRemaining = response.data.data.cooldownRemaining * 60; // Convert minutes to seconds
            errorMessage += ` in ${response.data.data.cooldownRemaining} Minutes`;
          }
        }
        
        setError(errorMessage);
        
        const cooldownUntil = Date.now() + cooldownRemaining * 1000;
        localStorage.setItem('couponCooldownUntil', cooldownUntil.toString());
        startCooldown(cooldownRemaining);
        
        // After error, automatically check for new availability
        setTimeout(() => {
          checkAvailability();
        }, cooldownRemaining * 1000);
      }
    } catch (err) {
      setError('An error occurred while claiming your coupon. Please try again later.');
      console.error(err);
      
      // Start a cooldown after an error
      const cooldownUntil = Date.now() + ERROR_COOLDOWN_DURATION * 1000;
      localStorage.setItem('couponCooldownUntil', cooldownUntil.toString());
      startCooldown(ERROR_COOLDOWN_DURATION);
      
      // After error, automatically check for new availability
      setTimeout(() => {
        checkAvailability();
      }, ERROR_COOLDOWN_DURATION * 1000);
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
    <div className="max-w-md p-8 mx-auto bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-center mb-6">
        <Gift className="mr-2 text-indigo-600" size={24} />
        <h2 className="text-2xl font-bold text-indigo-800">Claim Your Coupon</h2>
      </div>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {claimedCoupon ? (
        <div className="p-6 mb-6 bg-white border-2 border-indigo-500 border-dashed rounded-lg">
          <div className="text-center">
            <CheckCircle className="mr-2 text-green-600" size={20} />
            <span className="font-semibold text-green-600">Coupon Claimed!</span>
            <div className="text-2xl font-bold text-indigo-700">{claimedCoupon.code}</div>
            <div className="text-sm text-gray-600">{claimedCoupon.description}</div>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center">
          {cooldown ? (
            <div className="p-4 mb-4 bg-blue-100 rounded-lg">
              <p>You can claim another coupon in:</p>
              <div className="text-2xl font-bold text-blue-700">{formatTime(cooldownTime)}</div>
            </div>
          ) : (
            available ? (
              <div className="p-4 text-green-700 rounded-lg bg-green-50">Coupons are available! Claim yours now.</div>
            ) : (
              <div className="p-4 text-red-700 rounded-lg bg-red-50">Sorry, no coupons are currently available.</div>
            )
          )}
        </div>
      )}
      <div className="flex justify-center">
        <Button disabled={!available || loading || cooldown} onClick={handleClaimCoupon} className={`px-10 py-3 font-semibold rounded-full transition-all duration-300 ${
            !available || loading || cooldown
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
          }`}>
          {loading ? 'Processing...' : cooldown ? 'Cooldown Active' : 'Claim Coupon'}
        </Button>
      </div>
      {!claimedCoupon && !cooldown && (
        <div className="mt-6 text-center">
          <button onClick={checkAvailability} className="flex items-center justify-center mx-auto text-sm text-indigo-600 hover:text-indigo-800">
            <RefreshCw className="mr-1" size={14} /> Check availability again
          </button>
          <div className="mt-2 text-xs text-gray-500">
            <Clock className="inline mr-1" size={12} /> Auto-refreshing in {refreshTimer}s
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponClaim;
