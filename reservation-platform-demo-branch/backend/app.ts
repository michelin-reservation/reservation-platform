import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import express, { Application } from 'express';

// .js 확장자를 명시하여 JavaScript 라우터를 정확히 참조합니다.
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reservationRoutes from './routes/reservations.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import paymentRoutes from './routes/payments.js';
import reviewRoutes from './routes/reviewRoutes.js';
import vipRequestRoutes from './routes/vipRequests.js';
import adminRoutes from './routes/admin.js';
import businessRoutes from './routes/businessRoutes.js';

// VIP 관련 라우트들
import vipBenefitsRoutes from './routes/vipBenefits.js';
import vipConciergeRoutes from './routes/vipConcierge.js';

// 라우트 경로 충돌을 피하기 위해 두 개의 레스토랑 라우터를 다른 경로에 등록합니다.
import restaurantsV1Routes from './routes/restaurants.js'; // 기존 Sequelize 기반
import restaurantsV2Routes from './routes/restaurantRoutes.js'; // 신규 Prisma 기반

// .js/.ts 확장자를 명시하여 미들웨어를 정확히 참조합니다.
import { errorHandler } from './middlewares/errorHandler.js';
import corsMiddleware from './middlewares/cors.js';
import { responseTimeTracker, metricsEndpoint } from './middlewares/monitoring.js';

// Sentry 초기화
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new RewriteFrames({ root: global.__dirname }),
  ],
  tracesSampleRate: 1.0,
});

const app: Application = express();
app.use(express.json());

// CORS 및 모니터링 미들웨어 적용
app.use(corsMiddleware);
app.use(responseTimeTracker); // 경로 없이 전역으로 적용

// Sentry 요청 핸들러
app.use(Sentry.Handlers.requestHandler());

// API 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/vip-requests', vipRequestRoutes);
app.use('/api/vip-benefits', vipBenefitsRoutes);
app.use('/api/vip-concierge', vipConciergeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/restaurants', restaurantsV1Routes);
app.use('/api/restaurants-v2', restaurantsV2Routes);
app.get('/metrics', metricsEndpoint);

// Sentry 에러 핸들러
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

export default app;