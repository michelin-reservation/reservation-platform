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
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const isAdmin = require('./middleware/isAdmin');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./utils/logger');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const promClient = require('prom-client');
// const users = require('./routes/users'); // 불필요, 주석 처리

const app = express();
const server = http.createServer(app);

// WebSocket 서버 초기화
const notificationServer = new NotificationServer(server);

// 미들웨어 설정
app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 100, // IP당 1분에 100회
  message: { message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' }
});
app.use(limiter);

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/users', users); // 불필요, 주석 처리
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/vip-requests', require('./routes/vipRequests'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', isAdmin, require('./routes/admin'));
app.use('/api/business', require('./routes/businessRoutes'));

// 캐시 적용 예시
app.get('/api/restaurants', cache(300), require('./routes/restaurants')); // 5분 캐시
app.get('/api/restaurants/:id', cache(300), require('./routes/restaurants'));

// Swagger 설정
setupSwagger(app);

// DB 동기화
syncDatabase();

// Sentry 연동 (에러 추적)
let sentryDsn = process.env.SENTRY_DSN_DEV;
if (process.env.NODE_ENV === 'production') sentryDsn = process.env.SENTRY_DSN_PROD;

Sentry.init({
  dsn: sentryDsn,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
});

// Sentry 요청 추적 미들웨어
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Prometheus 메트릭 수집
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Sentry 테스트용 라우터
app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

// WebSocket 서버를 전역적으로 사용할 수 있도록 설정
app.set('notificationServer', notificationServer);

app.use(errorHandler);
app.use(Sentry.Handlers.errorHandler());

module.exports = { app, server }; 