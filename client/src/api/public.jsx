import api from '../utils/api';

const PUBLIC_BASE = '/api/public';

export const checkCouponAvailability = async () => {
  try {
    const response = await api.get(`${PUBLIC_BASE}/check-availability`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const claimCoupon = async () => {
//   try {
//     const response = await api.post(`${PUBLIC_BASE}/claim-coupon`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const claimCoupon = async () => {
  try {
    // Get the browserFingerprint from localStorage
    // const browserFingerprint = localStorage.getItem('browserFingerprint');
    // console.log(browserFingerprint);
    
    // Send the request with the fingerprint in the request body
    const response = await api.post(`${PUBLIC_BASE}/claim-coupon`);
    
    return response.data;


  } catch (error) {

    throw error;
  }
};