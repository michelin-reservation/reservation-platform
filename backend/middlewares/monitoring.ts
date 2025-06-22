import { register, Counter, Histogram } from 'prom-client';
import responseTime from 'response-time';
import { Request, Response } from 'express';

// API 요청 카운터
export const requestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

// API 응답 시간 히스토그램
export const responseTimer = new Histogram({
    name: 'http_response_duration_seconds',
    help: 'Histogram of response times in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 1.5, 2, 5], // 0.1초부터 5초까지
});

// 응답 시간을 측정하고 메트릭을 기록하는 미들웨어
export const responseTimeTracker = responseTime((req: Request, res: Response, time: number) => {
    const route = req.route?.path ?? req.originalUrl;
    if (route && req.method) {
        const statusCode = res.statusCode.toString();

        responseTimer.labels(req.method, route, statusCode).observe(time / 1000); // 초 단위로 변환
        requestCounter.labels(req.method, route, statusCode).inc();
    }
});

// /metrics 엔드포인트에서 메트릭을 노출
export const metricsEndpoint = (req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(register.metrics());
};