import { createContext, useContext, useMemo, useState } from 'react';
import { getMe, login as loginRequest } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roxiler_user')) || null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const { data } = await loginRequest({ email, password });
    localStorage.setItem('roxiler_token', data.data.token);
    localStorage.setItem('roxiler_user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  };

  const refreshUser = async () => {
    const { data } = await getMe();
    localStorage.setItem('roxiler_user', JSON.stringify(data.data));
    setUser(data.data);
  };

  const logout = () => {
    localStorage.removeItem('roxiler_token');
    localStorage.removeItem('roxiler_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, refreshUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
