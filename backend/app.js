const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 라우트 임포트
const userRoutes = require('./routes/users');
const restaurantRoutes = require('./routes/restaurants');
const authRoutes = require('./routes/auth');

// 환경 변수 로드
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 데이터베이스 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/michelin-reservation')
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/auth', authRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '미슐랭 예약 플랫폼 API' });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 