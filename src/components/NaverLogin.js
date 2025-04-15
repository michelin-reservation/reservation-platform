import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NaverLogin = () => {
  const navigate = useNavigate();

  const initializeNaverLogin = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: "ㅇYOUR_NAVER_CLIENT_ID", // 네이버 개발자 센터에서 발급받은 클라이언트 ID
      callbackUrl: "http://localhost:3001/oauth/naver/callback", // 콜백 URL
      isPopup: false,
      loginButton: { color: "green", type: 3, height: 60 }
    });
    naverLogin.init();
  };

  const handleNaverLogin = () => {
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=YOUR_NAVER_CLIENT_ID&redirect_uri=${encodeURIComponent("http://localhost:3001/oauth/naver/callback")}&state=STATE_STRING`;
  };

  useEffect(() => {
    const naverScript = document.createElement("script");
    naverScript.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";
    naverScript.type = "text/javascript";
    document.head.appendChild(naverScript);

    naverScript.onload = () => {
      initializeNaverLogin();
    };

    return () => {
      document.head.removeChild(naverScript);
    };
  }, []);

  return (
    <div>
      <div id="naverIdLogin"></div>
      <button 
        onClick={handleNaverLogin}
        style={{
          backgroundColor: '#03C75A',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          width: '100%',
          maxWidth: '300px',
          margin: '10px 0'
        }}
      >
        네이버로 로그인
      </button>
    </div>
  );
};

export default NaverLogin; 