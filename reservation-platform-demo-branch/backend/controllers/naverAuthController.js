const axios = require('axios');
const { sendSuccess, sendError, commonErrors, RESPONSE_CODES } = require('../utils/responseHelper');

exports.getNaverAuthUrl = (req, res) => {
  const state = process.env.NAVER_STATE || 'RANDOM_STATE';
  const clientId = process.env.NAVER_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.NAVER_CALLBACK_URL);
  const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
  res.redirect(url);
};

exports.naverCallback = async (req, res) => {
  const { code, state } = req.query;
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  const redirectUri = process.env.NAVER_CALLBACK_URL;

  try {
    // 1. 토큰 요청
    const tokenRes = await axios.get('https://nid.naver.com/oauth2.0/token', {
      params: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        state
      }
    });
    const { access_token } = tokenRes.data;

    // 2. 사용자 정보 요청
    const profileRes = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    // 3. 사용자 정보 활용 (DB 저장/로그인 처리 등)
    const naverUser = profileRes.data.response;
    // ...여기서 회원가입/로그인 처리

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.USER_LOGIN,
      'Naver authentication successful',
      '네이버 인증이 성공했습니다',
      { naverUser });
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.EXTERNAL_SERVICE_ERROR,
      'Naver authentication failed',
      '네이버 인증에 실패했습니다',
      err.message);
  }
};



