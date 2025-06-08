const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

const initSentry = () => {
  if (!process.env.SENTRY_DSN) {
    console.warn('⚠️ SENTRY_DSN이 설정되지 않았습니다. Sentry가 비활성화됩니다.');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  console.log('✅ Sentry가 초기화되었습니다.');
};

module.exports = initSentry; 