import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../data/users';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'vip' | 'business' | 'admin';
  vipLevel?: 'Gold' | 'Platinum' | 'Diamond';
  reservationCount?: number;
  isVip?: boolean;
  restaurantId?: string; // business 사용자를 위한 식당 ID
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // 로컬 사용자 데이터를 사용하는 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      const userData = loginUser(email, password);
      
      if (!userData) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      // 로컬 스토리지에 토큰 저장 (시뮬레이션)
      const token = `local_token_${Date.now()}`;
      localStorage.setItem('token', token);
      
      // 사용자 정보 설정
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        type: userData.role,
        vipLevel: userData.role === 'vip' ? (userData as any).vipLevel : undefined,
        reservationCount: userData.role === 'vip' ? (userData as any).totalReservations : 0,
        isVip: userData.role === 'vip',
        restaurantId: userData.role === 'business' ? (userData as any).restaurantId : undefined,
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

  // 페이지 로드 시 저장된 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token.startsWith('local_token_')) {
      // 로컬 토큰이 있으면 로그인 상태로 간주
      // 실제로는 토큰에서 사용자 정보를 복원해야 하지만, 
      // 여기서는 간단히 시뮬레이션
      console.log('로컬 토큰 발견:', token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};