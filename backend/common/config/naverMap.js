import dotenv from 'dotenv';
dotenv.config();

export default {
  clientId: process.env.NAVER_MAP_CLIENT_ID,
  clientSecret: process.env.NAVER_MAP_CLIENT_SECRET,
  ncpClientId: process.env.NAVER_MAP_CLIENT_ID,
  domains: process.env.NAVER_MAP_DOMAINS ? process.env.NAVER_MAP_DOMAINS.split(',') : ['http://localhost:3000'],
};