require('dotenv').config();
console.log('DB_USER:', process.env.DB_USER);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('현재 경로:', process.cwd());

const express = require('express');
const cors = require('cors');
const http = require('http');
const { syncDatabase } = require('./models');
const setupSwagger = require('./swagger');
const NotificationServer = require('./websocket/notificationServer');
const { loggingMiddleware } = require('./utils/logger');
const { cache } = require('./middlewares/cache');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const requireRole = require('./middlewares/role');
const errorHandler = require('./middlewares/errorHandler');
const helmet = require('helmet');
const globalQuota = require('./middlewares/quota');
const morgan = require('morgan');
const logger = require('./utils/logger');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const promClient = require('prom-client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('./middlewares/auth');
const { contextMiddleware } = require('./middlewares/contextMiddleware');
const businessRoutes = require('./routes/businessRoutes');
const restaurantsRoutes = require('./routes/restaurants');
const { responseTimeTracker, metricsEndpoint } = require('./middlewares/monitoring');
// const users = require('./routes/users'); // 불필요, 주석 처리

const app = express();
const server = http.createServer(app);

// WebSocket 서버 초기화
const notificationServer = new NotificationServer(server);

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
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use(helmet());
app.use(globalQuota); // 전역 요청 제한 미들웨어 적용

// 모니터링 미들웨어 적용
app.use(responseTimeTracker);

// app.js -> quota.js 로 이동 후 주석 처리
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1분
//   max: 100, // IP당 1분에 100회
//   message: { message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' }
// });
// app.use(limiter);

// [신규 라우트 설정 - 전역 미들웨어 적용 구조]
// 인증이 필요 없는 라우트를 먼저 등록
app.use('/api/auth', authRoutes);

// '/api' 경로로 들어오는 모든 요청에 대해 인증 및 컨텍스트 미들웨어 적용
const apiRouter = express.Router();
apiRouter.use(authenticateToken);
apiRouter.use(contextMiddleware);

// 기존 라우트들을 apiRouter에 연결
apiRouter.use('/users', userRoutes);
apiRouter.use('/restaurants', restaurantsRoutes);
apiRouter.use('/reservations', require('./routes/reservations'));
apiRouter.use('/reviews', require('./routes/reviewRoutes'));
apiRouter.use('/favorites', require('./routes/favoriteRoutes'));
apiRouter.use('/vip-requests', require('./routes/vipRequests'));
apiRouter.use('/payments', require('./routes/payments'));
apiRouter.use('/admin', requireRole(['관리자']), require('./routes/admin'));
apiRouter.use('/business', businessRoutes);

// 메인 앱에 apiRouter 연결
app.use('/api', apiRouter);

// 캐시 적용 예시 (캐시는 개별 라우터로 이동 또는 이 구조에 맞게 재설정 필요)
// app.get('/api/restaurants', cache(300), require('./routes/restaurants'));
// app.get('/api/restaurants/:id', cache(300), require('./routes/restaurants'));

// Prometheus 메트릭스 엔드포인트
app.get('/metrics', metricsEndpoint);

// Swagger 설정
setupSwagger(app);

// 임시: Swagger JSON 생성용 엔드포인트
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const specs = require('./swagger').specs;
  res.send(specs);
});

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