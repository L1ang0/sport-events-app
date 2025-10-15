import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  checkAuth, 
  login as apiLogin, 
  isAdmin, 
  isCurrentUser as checkIsCurrentUser 
} from '../api/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const hasRole = (roleName) => {
    return user?.roles?.some(role => role.name === roleName);
  };

  const isCurrentUser = (userId) => {
    return checkIsCurrentUser(user, userId);
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      const currentUser = await checkAuth();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await apiLogin(credentials);
      localStorage.setItem('token', data.token);
      await loadUser();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    currentUser: user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: isAdmin(user),
    hasRole,
    isCurrentUser,
    login,
    logout,
    refresh: loadUser
  };
}