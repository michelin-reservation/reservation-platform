import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // 사용자 정보 가져오기
      axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('프로필 로드 실패:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
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

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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