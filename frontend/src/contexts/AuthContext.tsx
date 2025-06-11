import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'regular' | 'vip' | 'business';
  reservationCount?: number;
  isVip?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Simulated login function
  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem('token', data.token);
      setUser({
        id: data.user.user_id,
        name: data.user.name,
        email: data.user.email,
        type: data.user.user_type,
        reservationCount: data.user.reservationCount,
        isVip: data.user.user_type === 'VIP',
      });
    } catch (error: any) {
      throw new Error(error.message || '로그인 중 오류 발생');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};