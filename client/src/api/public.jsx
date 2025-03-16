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

// export const claimCoupon = async () => {
//   try {
//     const response = await api.post(`${PUBLIC_BASE}/claim-coupon`);
//     return response.data;
//   } catch (error) {
    
//     throw error; // Re-throw for other errors

//     if (error.response) {
//       // Handle 429 response and extract data
//       return error.response;
//     }
//   }
// };

export const claimCoupon = async () => {
  try {
    const response = await api.post(`${PUBLIC_BASE}/claim-coupon`);
    return response.data;
  } catch (error) {
    if (error.response.status=428) {
      // If it's a 429 error, return the response for further handling
        return error.response;
      }
    throw error; // Re-throw for other unexpected errors
  }
};