const axios = require('axios');
const User = require('../models/User');
const naverConfig = require('../config/naver');
const jwt = require('jsonwebtoken');

// 네이버 로그인 URL 생성
exports.getNaverAuthUrl = (req, res) => {
  const state = naverConfig.state;
  const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverConfig.clientID}&redirect_uri=${naverConfig.callbackURL}&state=${state}`;
  res.json({ url });
};

// 네이버 콜백 처리
exports.naverCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    // state 검증
    if (state !== naverConfig.state) {
      return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    // 액세스 토큰 요청
    const tokenResponse = await axios.post(
      'https://nid.naver.com/oauth2.0/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: naverConfig.clientID,
          client_secret: naverConfig.clientSecret,
          code,
          state
        }
      }
    );

    const { access_token } = tokenResponse.data;

    // 사용자 정보 요청
    const userInfoResponse = await axios.get(
      'https://openapi.naver.com/v1/nid/me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    const { response: naverUser } = userInfoResponse.data;

    // 기존 사용자 확인
    let user = await User.findOne({ email: naverUser.email });

    if (!user) {
      // 새 사용자 생성
      user = new User({
        name: naverUser.name,
        email: naverUser.email,
        password: Math.random().toString(36).slice(-8), // 임시 비밀번호
        phone: naverUser.mobile || '',
        role: 'user'
      });
      await user.save();
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('네이버 로그인 에러:', error);
    res.status(500).json({ message: '네이버 로그인 처리 중 오류가 발생했습니다.' });
  }
}; 