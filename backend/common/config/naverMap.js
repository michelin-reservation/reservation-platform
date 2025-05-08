import dotenv from 'dotenv';
dotenv.config();

export default {
  clientId: process.env.NAVER_MAP_CLIENT_ID || 'ik37jksj5y',
  clientSecret: process.env.NAVER_MAP_CLIENT_SECRET || '',
  ncpClientId: process.env.NAVER_MAP_CLIENT_ID || 'ik37jksj5y',
  domains: ['http://localhost:3000'],
}; 