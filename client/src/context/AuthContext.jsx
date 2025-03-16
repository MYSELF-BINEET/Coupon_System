import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { adminLogin, adminLogout } from '../api/admin';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await adminLogin(credentials);
      if (response.token) {
        Cookies.set('admin_token', response.token, { expires: 1 });
        setIsAuthenticated(true);
        setAdminData(response.admin);
      }
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await adminLogout();
      Cookies.remove('admin_token');
      setIsAuthenticated(false);
      setAdminData(null);
      // toast.success("Logout Successful");

      // Ensure navigation happens only after state updates
      // setTimeout(() => navigate("/"), 0);
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, adminData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
