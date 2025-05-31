require('dotenv').config();
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('현재 경로:', process.cwd());

const express = require('express');
const cors = require('cors');
const http = require('http');
const { syncDatabase } = require('./models');
const setupSwagger = require('./swagger');
const NotificationServer = require('./websocket/notificationServer');
const { loggingMiddleware } = require('./utils/logger');
const { cache } = require('./middleware/cache');

const app = express();
const server = http.createServer(app);

// WebSocket 서버 초기화
const notificationServer = new NotificationServer(server);

// 미들웨어 설정
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(loggingMiddleware);

// 라우트 설정
app.use('/api/users', require('./routes/users'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/vip-requests', require('./routes/vipRequests'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// 캐시 적용 예시
app.get('/api/restaurants', cache(300), require('./routes/restaurants')); // 5분 캐시
app.get('/api/restaurants/:id', cache(300), require('./routes/restaurants'));

// Swagger 설정
setupSwagger(app);

// DB 동기화
syncDatabase();

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

// WebSocket 서버를 전역적으로 사용할 수 있도록 설정
app.set('notificationServer', notificationServer);

module.exports = { app, server }; 