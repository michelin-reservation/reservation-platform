const client = require('prom-client');

// 메트릭 레지스트리 생성
const register = new client.Registry();

// 기본 메트릭 추가
client.collectDefaultMetrics({ register });

// 커스텀 메트릭 정의
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const activeUsers = new client.Gauge({
  name: 'active_users',
  help: 'Number of active users'
});

const totalReservations = new client.Counter({
  name: 'total_reservations',
  help: 'Total number of reservations made'
});

// 메트릭 레지스트리에 등록
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(activeUsers);
register.registerMetric(totalReservations);

module.exports = {
  register,
  httpRequestDurationMicroseconds,
  activeUsers,
  totalReservations
}; 