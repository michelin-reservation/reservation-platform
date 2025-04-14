module.exports = {
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL || 'http://localhost:5000/api/auth/naver/callback',
  state: 'RANDOM_STATE' // CSRF 방지를 위한 랜덤 문자열
}; 