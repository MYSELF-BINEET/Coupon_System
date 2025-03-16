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

export const claimCoupon = async () => {
  try {
    const response = await api.post(`${PUBLIC_BASE}/claim-coupon`);
    return response.data;
  } catch (error) {
    throw error;
  }
};