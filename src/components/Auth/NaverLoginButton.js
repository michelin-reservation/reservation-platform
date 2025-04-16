import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const NaverLoginButton = () => {
  const handleNaverLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8001/auth/naver');
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('네이버 로그인 URL을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('네이버 로그인 초기화 실패:', error);
      alert('네이버 로그인을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleNaverLogin}
      fullWidth
      sx={{
        backgroundColor: '#03C75A',
        color: 'white',
        padding: '12px',
        fontSize: '1rem',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#02b350',
        },
        marginTop: 2,
        marginBottom: 2
      }}
    >
      네이버로 로그인
    </Button>
  );
};

export default NaverLoginButton; 