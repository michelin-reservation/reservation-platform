import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const NaverLoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleLoginSuccess = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
          console.error('네이버 로그인 에러:', error);
          alert('로그인에 실패했습니다.');
          navigate('/login');
          return;
        }

        if (!token) {
          throw new Error('토큰이 없습니다.');
        }

        // 토큰을 저장하고 로그인 상태 업데이트
        localStorage.setItem('token', token);
        await login(token);
        
        // 메인 페이지로 리다이렉트
        navigate('/');
      } catch (error) {
        console.error('로그인 처리 중 에러:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
        navigate('/login');
      }
    };

    handleLoginSuccess();
  }, [navigate, location.search, login]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
    >
      <CircularProgress size={50} sx={{ mb: 3 }} />
      <Typography variant="h6">
        로그인 처리 중입니다...
      </Typography>
    </Box>
  );
};

export default NaverLoginSuccess; 