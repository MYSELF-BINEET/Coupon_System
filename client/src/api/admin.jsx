import api from '../utils/api';

const ADMIN_BASE = '/api/admin';

export const adminLogin = async (credentials) => {
  // console.log(credentials);
  try {
    const response = await api.post(`${ADMIN_BASE}/login`, credentials);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminLogout = async () => {
  try {
    const response = await api.post(`${ADMIN_BASE}/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCoupons = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/coupons`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCoupon = async (couponData) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/coupons`, couponData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCoupon = async (id, couponData) => {
  try {
    const response = await api.put(`${ADMIN_BASE}/coupons/${id}`, couponData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_BASE}/coupons/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetCoupon = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/reset-coupon/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaimHistory = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/claims`);
    return response.data;
  } catch (error) {
    throw error;
  }
};