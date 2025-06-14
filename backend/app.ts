import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import reservationRoutes from './routes/reservationRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reviewRoutes from './routes/reviewRoutes';
import vipRequestRoutes from './routes/vipRequestRoutes';
import adminRoutes from './routes/adminRoutes';
import metricsRoutes from './routes/metrics';
import { errorHandler } from './middlewares/errorHandler';

// Sentry 초기화
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new RewriteFrames({ root: global.__dirname }),
  ],
  tracesSampleRate: 1.0,
});

const app = express();
app.use(express.json());

// Sentry 요청 핸들러
app.use(Sentry.Handlers.requestHandler());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/vip-requests', vipRequestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/metrics', metricsRoutes);

// Sentry 에러 핸들러
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

export default app; 