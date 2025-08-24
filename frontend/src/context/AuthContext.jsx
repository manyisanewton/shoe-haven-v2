import { createContext, useState, useEffect } from 'react';
import apiService from '../api/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // We could add a request here to verify the token and get user data
      // For now, we'll just assume the token means the user is logged in.
      // A more robust solution would be to have a /api/auth/me endpoint.
      setUser({ token }); // Simplified user object
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await apiService.post('/auth/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser({ token: access_token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};