module.exports = {
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL,
  state: process.env.NAVER_STATE || 'RANDOM_STATE', // CSRF 방지용
}; 