require('dotenv').config();
console.log('DB_USER:', process.env.DB_USER);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('현재 경로:', process.cwd());

const express = require('express');
const cors = require('cors');
const http = require('http');
// const { syncDatabase } = require('./models'); // 시연회용 주석처리
// const setupSwagger = require('./swagger'); // 시연회용 주석처리
// const NotificationServer = require('./websocket/notificationServer'); // 시연회용 주석처리
// const { loggingMiddleware } = require('./utils/logger'); // 시연회용 주석처리
// const { cache } = require('./middlewares/cache'); // 시연회용 주석처리
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
// const requireRole = require('./middlewares/role'); // 시연회용 주석처리
// const errorHandler = require('./middlewares/errorHandler'); // 시연회용 주석처리
// const helmet = require('helmet'); // 시연회용 주석처리
// const globalQuota = require('./middlewares/quota'); // 시연회용 주석처리
const morgan = require('morgan');
// const logger = require('./utils/logger'); // 시연회용 주석처리
// const Sentry = require('@sentry/node'); // 시연회용 주석처리
// const Tracing = require('@sentry/tracing'); // 시연회용 주석처리
// const promClient = require('prom-client'); // 시연회용 주석처리
// const { PrismaClient } = require('@prisma/client'); // 시연회용 주석처리
// const prisma = new PrismaClient(); // 시연회용 주석처리
// const { authenticateToken } = require('./middlewares/auth'); // 시연회용 주석처리
// const { contextMiddleware } = require('./middlewares/contextMiddleware'); // 시연회용 주석처리
// const businessRoutes = require('./routes/businessRoutes'); // 시연회용 주석처리
const restaurantsRoutes = require('./routes/restaurants');
// const { responseTimeTracker, metricsEndpoint } = require('./middlewares/monitoring'); // 시연회용 주석처리

const app = express();
const server = http.createServer(app);

// WebSocket 서버 초기화 (시연회용 주석처리)
// const notificationServer = new NotificationServer(server);

// 미들웨어 설정
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://223.130.155.88:5174',
    'https://eieconcierge.com',
    'https://www.eieconcierge.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined', { stream: { write: msg => console.log(msg.trim()) } })); // logger 대신 console.log 사용
// app.use(helmet()); // 시연회용 주석처리
// app.use(globalQuota); // 시연회용 주석처리

// 모니터링 미들웨어 적용 (시연회용 주석처리)
// app.use(responseTimeTracker);

// [시연회용 간소화된 라우트 설정]
// 인증이 필요 없는 라우트를 먼저 등록
app.use('/api/auth', authRoutes);

// 시연회용: 인증 없이 모든 API 접근 허용
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/vip-requests', require('./routes/vipRequests'));
app.use('/api/payments', require('./routes/payments'));
// app.use('/api/admin', requireRole(['관리자']), require('./routes/admin')); // 시연회용 주석처리
// app.use('/api/business', businessRoutes); // 시연회용 주석처리

// Prometheus 메트릭스 엔드포인트 (시연회용 주석처리)
// app.get('/metrics', metricsEndpoint);

// Swagger 설정 (시연회용 주석처리)
// setupSwagger(app);

// 임시: Swagger JSON 생성용 엔드포인트 (시연회용 주석처리)
// app.get('/swagger.json', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   const specs = require('./swagger').specs;
//   res.send(specs);
// });

// DB 동기화 (시연회용 주석처리)
// syncDatabase();

// Sentry 연동 (에러 추적) - 시연회용 주석처리
// let sentryDsn = process.env.SENTRY_DSN_DEV;
// if (process.env.NODE_ENV === 'production') sentryDsn = process.env.SENTRY_DSN_PROD;

// Sentry.init({
//   dsn: sentryDsn,
//   integrations: [
//     new Sentry.Integrations.Http({ tracing: true }),
//     new Tracing.Integrations.Express({ app })
//   ],
//   tracesSampleRate: 1.0
// });

// Sentry 요청 추적 미들웨어 (시연회용 주석처리)
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());

// Prometheus 메트릭 수집 (시연회용 주석처리)
// const collectDefaultMetrics = promClient.collectDefaultMetrics;
// collectDefaultMetrics();
// app.get('/metrics', async (req, res) => {
//   res.set('Content-Type', promClient.register.contentType);
//   res.end(await promClient.register.metrics());
// });

// Sentry 테스트용 라우터 (시연회용 주석처리)
// app.get('/debug-sentry', function mainHandler(req, res) {
//   throw new Error('My first Sentry error!');
// });

// 시연회용: 간단한 헬스체크 엔드포인트 추가
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '미슐랭 예약 플랫폼 백엔드 서버가 정상 동작 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// 시연회용: 간단한 메인 페이지
app.get('/', (req, res) => {
  res.json({
    message: '미슐랭 예약 플랫폼 API 서버',
    version: '1.0.0',
    status: 'running'
  });
});

// 서버 시작
const PORT = process.env.PORT || 8001;  // 시연회용 포트 변경 (8000 -> 8001)
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

// WebSocket 서버를 전역적으로 사용할 수 있도록 설정 (시연회용 주석처리)
// app.set('notificationServer', notificationServer);

// app.use(errorHandler); // 시연회용 주석처리
// app.use(Sentry.Handlers.errorHandler()); // 시연회용 주석처리

module.exports = { app, server };