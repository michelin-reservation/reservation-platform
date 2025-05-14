const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { syncDatabase } = require('./models');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// CORS 설정
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// 라우터 설정
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/reservations', require('./routes/reservations'));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '미슐랭 예약 플랫폼 API' });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '서버 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 서버 시작
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  try {
    await syncDatabase();
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  } catch (error) {
    console.error('서버 시작 실패:', error);
  }
});

module.exports = app; 