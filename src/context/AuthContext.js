import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 토큰을 헤더에 설정
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // 사용자 정보 가져오기
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`);
          setUser(response.data);
        } catch (error) {
          console.error('인증 초기화 실패:', error);
          // 토큰이 유효하지 않은 경우 로그아웃
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem('token', token);
        // axios 기본 헤더에 토큰 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || '로그인에 실패했습니다.' 
        };
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '로그인에 실패했습니다.' 
      };
    }
  };

  const logout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('token');
    // axios 헤더에서 토큰 제거
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || '회원가입에 실패했습니다.' 
        };
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '회원가입에 실패했습니다.' 
      };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        signup,
        isAuthenticated: !!user 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 