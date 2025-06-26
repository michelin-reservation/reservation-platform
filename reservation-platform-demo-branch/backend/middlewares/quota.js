const rateLimit = require('express-rate-limit');

/**
 * 전역 API 요청 제한 미들웨어
 * - 기본적인 DDoS 공격 및 비정상적인 트래픽으로부터 서버를 보호합니다.
 * - 환경변수 RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MINUTES 를 통해 설정 가능합니다.
 */
const globalQuota = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW_MINUTES || 1) * 60 * 1000, // 1분 (기본값)
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // IP당 1분에 100회 (기본값)
    message: { message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
    headers: true, // 응답 헤더에 제한 정보 포함 (X-RateLimit-Limit, X-RateLimit-Remaining 등)
    legacyHeaders: false, // 최신 표준 헤더 사용
});

module.exports = globalQuota;