const promClient = require('prom-client');

// 응답 시간 히스토그램 (이름 변경하여 중복 방지)
const responseTimeHistogram = new promClient.Histogram({
    name: 'http_request_duration_microseconds',
    help: 'HTTP 요청 응답 시간',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

// 요청 카운터 (이름 변경하여 중복 방지)
const requestCounter = new promClient.Counter({
    name: 'http_requests_total_count',
    help: '총 HTTP 요청 수',
    labelNames: ['method', 'route', 'status_code']
});

// 응답 시간 추적 미들웨어
const responseTimeTracker = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000; // 초 단위
        const route = req.route ? req.route.path : req.path;

        responseTimeHistogram
            .labels(req.method, route, res.statusCode)
            .observe(duration);

        requestCounter
            .labels(req.method, route, res.statusCode)
            .inc();
    });

    next();
};

// 메트릭스 엔드포인트
const metricsEndpoint = async (req, res) => {
    try {
        res.set('Content-Type', promClient.register.contentType);
        res.end(await promClient.register.metrics());
    } catch (error) {
        res.status(500).json({ error: '메트릭 수집 중 오류가 발생했습니다.' });
    }
};

module.exports = {
    responseTimeTracker,
    metricsEndpoint,
    responseTimeHistogram,
    requestCounter
};