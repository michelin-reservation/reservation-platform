import React from 'react';
import { Button } from '@mui/material';

const NaverLoginButton = () => {
  const handleNaverLogin = () => {
    // 네이버 로그인 URL 생성
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.REACT_APP_NAVER_REDIRECT_URI);
    const state = 'RANDOM_STATE'; // CSRF 방지를 위한 랜덤 문자열
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    
    // 네이버 로그인 페이지로 이동
    window.location.href = naverAuthUrl;
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