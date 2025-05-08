import dotenv from 'dotenv';
dotenv.config();

export default {
  clientID: '***REMOVED***',
  clientSecret: 'IEmSj6D_QQ',
  callbackURL: 'http://localhost:8000/auth/naver/callback',
  state: process.env.NAVER_STATE || 'RANDOM_STATE',
}; 