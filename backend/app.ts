import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import reservationRoutes from './routes/reservations.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import paymentRoutes from './routes/payments.js';
import reviewRoutes from './routes/reviewRoutes.js';
import vipRequestRoutes from './routes/vipRequests.js';
import adminRoutes from './routes/admin.js';
import businessRoutes from './routes/businessRoutes.js';
import restaurantsRoutes from './routes/restaurants.js';
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
app.use('/api/business', businessRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/metrics', metricsRoutes);

// Sentry 에러 핸들러
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

export default app;